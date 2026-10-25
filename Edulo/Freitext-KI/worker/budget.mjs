// All money is integer millionths of a euro. One Durable Object owns every account.
export const UID = /^[a-z0-9]{2}(?:-[a-z0-9]{6}){3}$/i;
export const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export class ApiError extends Error {
  constructor(status, code, message) { super(message); this.status = status; this.code = code; }
}
const positive = n => Number.isSafeInteger(n) && n > 0;
const nonnegative = n => Number.isSafeInteger(n) && n >= 0;
const object = x => x && typeof x === 'object' && !Array.isArray(x);
export function configuration(env) {
  try {
    const accounts = JSON.parse(env.ACCOUNTS_JSON);
    const prices = JSON.parse(env.PRICE_CONFIG_JSON);
    const limits = JSON.parse(env.LIMITS_JSON);
    if (!object(accounts) || !Object.keys(accounts).length || !Object.entries(accounts).every(([uid, a]) =>
      UID.test(uid) && object(a) && nonnegative(a.totalGrantedEuroMicros) && positive(a.weeklyLimitEuroMicros))) throw Error();
    if (!object(prices) || !positive(prices.inputNanoUsdPerToken) ||
      !nonnegative(prices.cachedInputNanoUsdPerToken) || prices.cachedInputNanoUsdPerToken > prices.inputNanoUsdPerToken ||
      !positive(prices.outputNanoUsdPerToken) || !positive(prices.euroMicrosPerUsd) ||
      typeof prices.version !== 'string' || !prices.version.trim() || prices.version.length > 80) throw Error();
    if (!object(limits) || !positive(limits.globalLifetimeLimitEuroMicros) || !positive(limits.globalWeeklyLimitEuroMicros)) throw Error();
    return { accounts, prices, limits };
  } catch { throw new ApiError(503, 'not_configured', 'Der Rückmeldedienst ist noch nicht vollständig eingerichtet.'); }
}
export function weekKey(now) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Berlin', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(new Date(now)).map(p => [p.type, p.value]));
  const day = new Date(Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day)));
  day.setUTCDate(day.getUTCDate() - (day.getUTCDay() + 6) % 7);
  return day.toISOString().slice(0, 10);
}
export async function digest(value) {
  return [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value)))].map(v => v.toString(16).padStart(2, '0')).join('');
}
export function cost(usage, prices) {
  const input = usage?.input_tokens, output = usage?.output_tokens;
  const cached = usage?.input_tokens_details?.cached_tokens ?? 0;
  if (![input, output, cached].every(nonnegative) || cached > input ||
    (usage.total_tokens !== undefined && (!nonnegative(usage.total_tokens) || usage.total_tokens !== input + output))) {
    throw new ApiError(502, 'usage_unresolved', 'Der API-Verbrauch muss von der Lehrkraft geklärt werden.');
  }
  // output_tokens already includes reasoning tokens; cached tokens are a subset of input.
  const nanoUsd = BigInt(input - cached) * BigInt(prices.inputNanoUsdPerToken) +
    BigInt(cached) * BigInt(prices.cachedInputNanoUsdPerToken) + BigInt(output) * BigInt(prices.outputNanoUsdPerToken);
  const euroMicros = (nanoUsd * BigInt(prices.euroMicrosPerUsd) + 999_999_999n) / 1_000_000_000n;
  if (euroMicros > BigInt(Number.MAX_SAFE_INTEGER)) throw new ApiError(502, 'usage_unresolved', 'Der API-Verbrauch muss geklärt werden.');
  return Number(euroMicros);
}
const empty = () => ({ spent: 0, reserved: 0 });
const safeAdd = (a, b) => {
  const value = a + b;
  if (!Number.isSafeInteger(value) || value < 0) throw new ApiError(503, 'ledger_unavailable', 'Das Guthaben kann gerade nicht verarbeitet werden.');
  return value;
};
export class Ledger {
  constructor(storage, now = () => Date.now()) { this.storage = storage; this.now = now; }
  async keys(uid, requestId) {
    const account = `account:${await digest(uid)}`;
    return { account, request: requestId ? `${account}:request:${requestId.toLowerCase()}` : undefined };
  }
  async state(tx, keys, config, uid, week) {
    const settings = await tx.get('admin:settings');
    const accounts = settings?.accounts ?? config.accounts;
    const granted = Object.hasOwn(accounts, uid) ? accounts[uid] : undefined;
    if (!granted) throw new ApiError(403, 'uid_not_allowed', 'Diese Edulo-Anmelde-ID ist nicht freigegeben.');
    const account = await tx.get(keys.account) ?? { ...empty(), granted: 0, blocked: false };
    // A top-up changes the cumulative grant. A lower/stale configuration can never reset funds.
    account.granted = Math.max(account.granted, granted.totalGrantedEuroMicros);
    const awKey = `${keys.account}:week:${week}`;
    const gwKey = `global:week:${week}`;
    return { account, aw: await tx.get(awKey) ?? empty(), global: await tx.get('global') ?? empty(),
      gw: await tx.get(gwKey) ?? empty(), awKey, gwKey, weeklyLimit: granted.weeklyLimitEuroMicros,
      limits: settings?.limits ?? config.limits };
  }
  budget(s, week) {
    return { remainingEuroMicros: Math.max(0, s.account.granted - s.account.spent - s.account.reserved),
      weeklyRemainingEuroMicros: Math.max(0, s.weeklyLimit - s.aw.spent - s.aw.reserved),
      reservedEuroMicros: s.account.reserved, weekKey: week };
  }
  async save(tx, keys, s) {
    await tx.put(keys.account, s.account); await tx.put(s.awKey, s.aw);
    await tx.put('global', s.global); await tx.put(s.gwKey, s.gw);
  }
  async quota(uid, config) {
    const keys = await this.keys(uid), week = weekKey(this.now());
    return this.storage.transaction(async tx => {
      const s = await this.state(tx, keys, config, uid, week);
      await this.save(tx, keys, s);
      return this.budget(s, week);
    });
  }
  async reserve(uid, requestId, hash, amount, config) {
    const keys = await this.keys(uid, requestId), week = weekKey(this.now());
    return this.storage.transaction(async tx => {
      const s = await this.state(tx, keys, config, uid, week);
      const previous = await tx.get(keys.request);
      if (previous) {
        if (previous.hash !== hash) throw new ApiError(409, 'request_conflict', 'Diese Anfrage-ID gehört bereits zu einer anderen Eingabe.');
        await this.save(tx, keys, s);
        return { existing: true, record: previous, budget: this.budget(s, week) };
      }
      if (s.account.blocked) throw new ApiError(409, 'account_review_required', 'Ein ungeklärter API-Verbrauch muss zuerst von der Lehrkraft geprüft werden.');
      const budget = this.budget(s, week);
      if (!positive(amount) || amount > budget.remainingEuroMicros || amount > budget.weeklyRemainingEuroMicros)
        throw new ApiError(402, 'budget_exhausted', 'Das verfügbare Guthaben oder Wochenlimit reicht für diese Anfrage nicht aus.');
      if (amount > s.limits.globalLifetimeLimitEuroMicros - s.global.spent - s.global.reserved ||
        amount > s.limits.globalWeeklyLimitEuroMicros - s.gw.spent - s.gw.reserved)
        throw new ApiError(503, 'global_budget_exhausted', 'Das Gesamtlimit des Rückmeldedienstes ist erreicht.');
      for (const item of [s.account, s.aw, s.global, s.gw]) item.reserved = safeAdd(item.reserved, amount);
      const record = { hash, requestId, amount, week, status: 'reserved', priceVersion: config.prices.version,
        prices: config.prices, createdAt: this.now() };
      await this.save(tx, keys, s); await tx.put(keys.request, record);
      return { existing: false, record, budget: this.budget(s, week) };
    });
  }
  async finish(uid, requestId, config, result, actual, unresolved = false, audit = {}) {
    const keys = await this.keys(uid, requestId), currentWeek = weekKey(this.now());
    return this.storage.transaction(async tx => {
      const record = await tx.get(keys.request);
      if (!record || record.status !== 'reserved') throw new ApiError(503, 'ledger_unavailable', 'Die Abrechnung muss geprüft werden.');
      const s = await this.state(tx, keys, config, uid, record.week);
      if (unresolved) {
        s.account.blocked = true;
        s.account.unresolvedCount = safeAdd(s.account.unresolvedCount ?? 0, 1);
        record.unresolved = true;
      } else {
        if (!nonnegative(actual)) throw Error('Invalid settlement');
        for (const item of [s.account, s.aw, s.global, s.gw]) {
          item.reserved -= record.amount; item.spent = safeAdd(item.spent, actual);
        }
        if (actual > record.amount) { s.account.blocked = true; s.account.overrun = true; }
        record.status = actual === 0 ? 'none' : 'settled'; record.actual = actual;
      }
      record.result = result; record.audit = audit; record.finishedAt = this.now();
      await this.save(tx, keys, s); await tx.put(keys.request, record);
      const current = currentWeek === record.week ? s : await this.state(tx, keys, config, uid, currentWeek);
      return { record, budget: this.budget(current, currentWeek) };
    });
  }
  async result(uid, requestId, config) {
    const keys = await this.keys(uid, requestId), week = weekKey(this.now());
    return this.storage.transaction(async tx => {
      const s = await this.state(tx, keys, config, uid, week);
      const record = await tx.get(keys.request);
      if (!record) throw new ApiError(404, 'request_not_found', 'Diese Anfrage wurde nicht gefunden.');
      await this.save(tx, keys, s);
      return { record, budget: this.budget(s, week) };
    });
  }
  async adminSnapshot(tx, config, week) {
    const settings = await tx.get('admin:settings') ?? { accounts: config.accounts, limits: config.limits };
    const accounts = [];
    for (const uid of Object.keys(settings.accounts).sort()) {
      const keys = await this.keys(uid);
      const s = await this.state(tx, keys, config, uid, week);
      accounts.push({ uid, name: settings.accounts[uid].name ?? '', grantedEuroMicros: s.account.granted, totalGrantedEuroMicros: s.account.granted,
        spentEuroMicros: s.account.spent, weeklyLimitEuroMicros: s.weeklyLimit,
        weeklySpentEuroMicros: s.aw.spent, blocked: Boolean(s.account.blocked), budget: this.budget(s, week) });
    }
    const global = await tx.get('global') ?? empty();
    const gw = await tx.get(`global:week:${week}`) ?? empty();
    return { accounts, global: { spentEuroMicros: global.spent, reservedEuroMicros: global.reserved,
      weeklySpentEuroMicros: gw.spent, weeklyReservedEuroMicros: gw.reserved, weekKey: week, ...settings.limits },
      limits: { ...settings.limits }, weekKey: week };
  }
  async admin(config, body) {
    const fields = { list: ['action'], add: ['operationId', 'action', 'uid', 'amountEuroMicros', 'weeklyLimitEuroMicros'],
      topup: ['operationId', 'action', 'uid', 'amountEuroMicros'], weekly: ['operationId', 'action', 'uid', 'weeklyLimitEuroMicros'],
      rename: ['operationId', 'action', 'uid', 'name'],
      limits: ['operationId', 'action', 'globalLifetimeLimitEuroMicros', 'globalWeeklyLimitEuroMicros'] };
    const expected = object(body) && Object.hasOwn(fields, body.action) ? [...fields[body.action],
      ...(body.action === 'add' && Object.hasOwn(body, 'name') ? ['name'] : [])] : undefined;
    if (!expected || Object.keys(body).length !== expected.length || !expected.every(key => Object.hasOwn(body, key)))
      throw new ApiError(400, 'invalid_admin_request', 'Die Verwaltungsanfrage enthält nicht die erwarteten Felder.');
    const week = weekKey(this.now());
    if (body.action === 'list') return this.storage.transaction(tx => this.adminSnapshot(tx, config, week));
    if (typeof body.operationId !== 'string' || body.operationId.length !== 36 || !UUID.test(body.operationId))
      throw new ApiError(400, 'invalid_operation_id', 'Die Verwaltungs-ID ist ungültig.');
    if (expected.includes('uid') && (typeof body.uid !== 'string' || body.uid.length !== 23 || !UID.test(body.uid)))
      throw new ApiError(400, 'invalid_uid', 'Die exakte Edulo-Anmelde-ID ist ungültig.');
    if (expected.includes('name') && (typeof body.name !== 'string' || body.name.length > 120 || /[\u0000-\u001f\u007f]/.test(body.name)))
      throw new ApiError(400, 'invalid_account_name', 'Der Name darf höchstens 120 Zeichen und keine Steuerzeichen enthalten.');
    if ((body.action === 'add' && !nonnegative(body.amountEuroMicros)) ||
      (body.action === 'topup' && !positive(body.amountEuroMicros)) ||
      (expected.includes('weeklyLimitEuroMicros') && !positive(body.weeklyLimitEuroMicros)) ||
      (body.action === 'limits' && (!positive(body.globalLifetimeLimitEuroMicros) || !positive(body.globalWeeklyLimitEuroMicros))))
      throw new ApiError(400, 'invalid_admin_amount', 'Geldbeträge müssen sichere ganze Euro-Millionstel sein; Wochen- und Globallimits müssen positiv sein.');
    const operationKey = `admin:operation:${body.operationId.toLowerCase()}`;
    const hash = await digest(JSON.stringify(Object.fromEntries(Object.keys(body).sort().map(key => [key, body[key]]))));
    return this.storage.transaction(async tx => {
      const previous = await tx.get(operationKey);
      if (previous) {
        if (previous.hash !== hash) throw new ApiError(409, 'operation_conflict', 'Diese Verwaltungs-ID wurde bereits für eine andere Änderung verwendet.');
        return { operationId: previous.body.operationId, action: previous.action, replayed: true,
          ...await this.adminSnapshot(tx, config, week) };
      }
      // Seed exactly once. Subsequent edits preserve all previously configured accounts.
      const settings = await tx.get('admin:settings') ?? {
        accounts: Object.fromEntries(Object.entries(config.accounts).map(([uid, account]) => [uid, { ...account }])), limits: { ...config.limits },
      };
      const exists = Object.hasOwn(settings.accounts, body.uid ?? '');
      if (body.action === 'add') {
        if (exists) throw new ApiError(409, 'account_exists', 'Diese Edulo-Anmelde-ID ist bereits vorhanden.');
        settings.accounts[body.uid] = { name: (body.name ?? '').trim(), totalGrantedEuroMicros: body.amountEuroMicros, weeklyLimitEuroMicros: body.weeklyLimitEuroMicros };
      } else if (body.action === 'topup' || body.action === 'weekly' || body.action === 'rename') {
        if (!exists) throw new ApiError(404, 'account_not_found', 'Diese Edulo-Anmelde-ID ist nicht vorhanden.');
        if (body.action === 'rename') settings.accounts[body.uid].name = body.name.trim();
        else if (body.action === 'weekly') settings.accounts[body.uid].weeklyLimitEuroMicros = body.weeklyLimitEuroMicros;
        else {
          const keys = await this.keys(body.uid);
          const account = await tx.get(keys.account) ?? { ...empty(), granted: 0, blocked: false };
          const configured = settings.accounts[body.uid].totalGrantedEuroMicros;
          const granted = Math.max(account.granted, configured) + body.amountEuroMicros;
          if (!Number.isSafeInteger(granted)) throw new ApiError(400, 'invalid_admin_amount', 'Die Aufladung überschreitet den sicheren Zahlenbereich.');
          settings.accounts[body.uid].totalGrantedEuroMicros = granted;
          account.granted = granted;
          await tx.put(keys.account, account);
        }
      } else if (body.action === 'limits') {
        settings.limits = { globalLifetimeLimitEuroMicros: body.globalLifetimeLimitEuroMicros,
          globalWeeklyLimitEuroMicros: body.globalWeeklyLimitEuroMicros };
      }
      await tx.put('admin:settings', settings);
      const result = { operationId: body.operationId, action: body.action, ...await this.adminSnapshot(tx, config, week) };
      await tx.put(operationKey, { hash, action: body.action, body: { ...body }, at: this.now() });
      return result;
    });
  }
  async reconcile(uid, requestId, config, actual, supportingNote, confirmedNoCharge) {
    if (!nonnegative(actual) || typeof supportingNote !== 'string' || supportingNote.trim().length < 10 || supportingNote.length > 1000 ||
      (confirmedNoCharge !== undefined && typeof confirmedNoCharge !== 'boolean') ||
      (actual === 0 && confirmedNoCharge !== true))
      throw new ApiError(400, 'invalid_reconciliation', 'Ein überprüfter Betrag und ein aussagekräftiger Beleg sind erforderlich; null Euro erfordert confirmedNoCharge:true.');
    const keys = await this.keys(uid, requestId), currentWeek = weekKey(this.now());
    const reconciliationHash = await digest(JSON.stringify({ actual, supportingNote: supportingNote.trim(), confirmedNoCharge: confirmedNoCharge === true }));
    return this.storage.transaction(async tx => {
      const record = await tx.get(keys.request);
      if (!record) throw new ApiError(404, 'request_not_found', 'Diese Anfrage wurde nicht gefunden.');
      const s = await this.state(tx, keys, config, uid, record.week);
      if (record.reconciliation) {
        if (record.reconciliation.hash !== reconciliationHash)
          throw new ApiError(409, 'reconciliation_conflict', 'Die bereits dokumentierte Klärung kann nicht geändert werden.');
      } else {
        if (record.status !== 'reserved')
          throw new ApiError(409, 'request_already_settled', 'Abgeschlossene Buchungen können nicht geändert oder erstattet werden.');
        if (!record.result && this.now() - record.createdAt < 120_000)
          throw new ApiError(409, 'request_in_progress', 'Die Anfrage kann noch laufen. Eine Klärung ist frühestens nach zwei Minuten möglich.');
        if (actual > record.amount)
          throw new ApiError(409, 'reconciliation_overrun', 'Der bestätigte Verbrauch übersteigt die Reservierung. Gesonderte manuelle Abrechnung erforderlich; die Reservierung bleibt gesperrt.');
        for (const item of [s.account, s.aw, s.global, s.gw]) {
          item.reserved -= record.amount; item.spent = safeAdd(item.spent, actual);
        }
        if (record.unresolved) s.account.unresolvedCount = Math.max(0, (s.account.unresolvedCount ?? 1) - 1);
        s.account.blocked = Boolean(s.account.overrun || s.account.unresolvedCount > 0);
        record.status = 'settled'; record.actual = actual; record.unresolved = false;
        record.reconciliation = { hash: reconciliationHash, actualEuroMicros: actual,
          supportingNote: supportingNote.trim(), confirmedNoCharge: confirmedNoCharge === true, at: this.now() };
        record.result = { status: 502, body: { requestId, error: { code: 'feedback_unavailable_reconciled',
          message: 'Die ursprüngliche Rückmeldung konnte nicht wiederhergestellt werden. Die Lehrkraft hat die Kosten geklärt. Du kannst eine neue Rückmeldung anfordern.' } } };
        await this.save(tx, keys, s); await tx.put(keys.request, record);
      }
      const current = currentWeek === record.week ? s : await this.state(tx, keys, config, uid, currentWeek);
      return { record, budget: this.budget(current, currentWeek) };
    });
  }
}

/** Instantaneous schematic energy trains. The physics state is never changed. */
(function (root) {
  'use strict';
  const SPEED = 1.6, INTERVAL = 1.6, CONVERSION = 1.1, EPS = 1e-8;
  const finite = n => Number.isFinite(n) ? n : 0;
  const positive = n => Math.max(0, finite(n));
  const mod = (n, period) => ((n % period) + period) % period;
  const stationId = station => Number(station.slice(station.indexOf(':') + 1));

  function create() {
    let lastTime = null;
    const epochs = new Map(), travelStates = new Map(), conversionStates = new Map();
    const knownChannels = new Set(), rootSchedules = new Map(), routeSerials = new Map();
    function reset() {
      lastTime = null; epochs.clear(); travelStates.clear(); conversionStates.clear();
      knownChannels.clear(); rootSchedules.clear(); routeSerials.clear();
    }

    function update(plan, state, measureRoute) {
      const time = positive(state?.simulationTime);
      if (lastTime !== null && time < lastTime - EPS) reset();
      const previousTime = lastTime;
      if (!plan || !Array.isArray(plan.devices) || !state || !Array.isArray(state.devices)) {
        reset(); lastTime = time;
        return { packets: [], stocks: [], channels: [], routes: [] };
      }

      const devices = new Map(plan.devices.map(d => [d.id, d]));
      const raw = new Map(state.devices.map(d => [d.id, d]));
      const stocks = [];
      for (const d of plan.devices) if (d.type === 'motor') {
        const original = raw.get(d.id);
        if (original?.weight) stocks.push({ device: d.id, kind: 'potential-stock',
          joules: positive(d.potentialJ), mass: positive(original.mass) });
        stocks.push({ device: d.id, kind: 'kinetic-stock', joules: positive(d.kineticJ),
          mass: positive(original?.mass) });
      }

      // Every physical cable may carry a transfer and one or two independent
      // electrical contributions to its own I²R heat. Keep both cable paths.
      const outgoing = new Map();
      for (const wire of plan.wires || []) {
        const flows = Array.isArray(wire.flows) ? wire.flows :
          wire.power > EPS ? [{ from: wire.from, to: wire.to, power: wire.power, kind: 'transfer' }] : [];
        for (const flow of flows) {
          if (!devices.has(flow.from) || !(flow.power > EPS)) continue;
          const list = outgoing.get(flow.from) || [];
          list.push({ kind: 'electrical', form: 'electrical',
            to: flow.kind === 'heat' ? 'wire:' + wire.index :
              (devices.get(flow.to)?.type || 'motor') + ':' + flow.to,
            wire: wire.index, weight: flow.power });
          outgoing.set(flow.from, list);
        }
      }

      const channels = [], routes = [], channelById = new Map(), routeById = new Map();
      const rootIds = new Set();
      function choices(station, input) {
        const id = stationId(station), d = devices.get(id), original = raw.get(id);
        if (station.startsWith('wire:')) return [{ kind: 'heat', form: 'thermal',
          to: 'environment:' + id, weight: 1 }];
        if (station.startsWith('weight:')) return input.kind === 'potential' ?
          [{ kind: 'fall', form: 'kinetic', to: 'motor:' + id, weight: 1 }] :
          [{ kind: 'potential', form: 'potential', to: station, store: true, weight: 1 }];
        if (station.startsWith('lamp:')) return [
          { kind: 'heat', form: 'thermal', to: 'environment:' + id, weight: positive(d?.heat) },
          { kind: 'light', form: 'light', to: 'environment:' + id, weight: positive(d?.light) }
        ];
        if (station.startsWith('shaft:')) {
          const result = [
            { kind: 'heat', form: 'thermal', to: 'environment:' + id, weight: positive(d?.frictionHeat) }
          ];
          if (original?.weight && d?.mechanicalOut > EPS) result.push({ kind: 'lift',
            form: 'kinetic', to: 'weight:' + id, weight: d.mechanicalOut });
          else if (original?.crank && d?.mechanicalOut > EPS) result.push({ kind: 'mechanical-out',
            form: 'kinetic', to: 'hand:' + id, weight: d.mechanicalOut });
          if (d?.kineticPower > EPS) result.push({ kind: 'kinetic', form: 'kinetic',
            to: 'rotor:' + id, store: true, weight: d.kineticPower });
          return result;
        }
        if (!station.startsWith('motor:') || !d) return [];
        if (input.form === 'electrical' && d.electromagneticPower > EPS) {
          return [
            ...(outgoing.get(id) || []),
            { kind: 'heat', form: 'thermal', to: 'environment:' + id, weight: positive(d.copperHeat) },
            { kind: 'shaft', form: 'kinetic', to: 'shaft:' + id, weight: positive(d.electromagneticPower) }
          ];
        }
        if (input.form !== 'electrical' && d.electromagneticPower > EPS && d.electricalIn > EPS) {
          // Simultaneous hand and electric drive both enter the same shaft.
          // Their separate lanes retain their own input/output lineage.
          return [{ kind: 'shaft', form: 'kinetic', to: 'shaft:' + id, weight: 1 }];
        }
        const result = [...(outgoing.get(id) || []),
          { kind: 'heat', form: 'thermal', to: 'environment:' + id,
            weight: input.form === 'electrical' ? positive(d.copperHeat) : positive(d.heat) }];
        if (original?.weight && d.mechanicalOut > EPS) result.push({ kind: 'lift', form: 'kinetic',
          to: 'weight:' + id, weight: d.mechanicalOut });
        else if (original?.crank && d.mechanicalOut > EPS) result.push({ kind: 'mechanical-out',
          form: 'kinetic', to: 'hand:' + id, weight: d.mechanicalOut });
        if (d.kineticPower > EPS) result.push({ kind: 'kinetic', form: 'kinetic',
          to: 'rotor:' + id, store: true, weight: d.kineticPower });
        return result;
      }
      function addChannel(id, station, input, sourceRoute, origin, depth) {
        if (depth > 16 || !(input.joules > EPS)) return null;
        const channel = { id, station, device: stationId(station), input: { ...input },
          outputs: [], sourceRoute, rootId: origin, index: 0, count: 1 };
        channels.push(channel); channelById.set(id, channel);
        let output = choices(station, input).filter(o => o.weight > EPS);
        if (!output.length) output = [{ kind: 'heat', form: 'thermal',
          to: 'environment:' + channel.device, weight: 1 }];
        const total = output.reduce((sum, o) => sum + o.weight, 0);
        output.forEach((o, index) => {
          const joules = input.joules * o.weight / total;
          const routeId = o.store ? null : id + '/out:' + index + ':' + o.to + ':' + (o.wire ?? '');
          channel.outputs.push({ kind: o.kind, form: o.form, joules, store: !!o.store,
            to: o.to, wire: o.wire, routeId });
          if (routeId) addRoute(routeId, o.kind, o.form, joules, station, o.to,
            channel.device, o.wire, id, origin, depth + 1);
        });
        return channel;
      }
      function addRoute(id, kind, form, joules, from, to, device, wire, sourceChannel, origin, depth) {
        if (!(joules > EPS) || depth > 16) return null;
        const route = { id, kind, form, joules, from, to, device, wire,
          sourceChannel, targetChannel: null, rootId: origin, length: 0 };
        routes.push(route); routeById.set(id, route);
        if (!to.startsWith('environment:') && !to.startsWith('hand:') && !to.startsWith('rotor:')) {
          const targetId = id + '/in';
          const target = addChannel(targetId, to, { kind, form, joules }, id, origin, depth + 1);
          if (target) route.targetChannel = target.id;
        }
        return route;
      }

      for (const d of plan.devices) {
        if (d.type !== 'motor') continue;
        const original = raw.get(d.id);
        if (original?.hand && d.handPower > EPS) {
          const rootId = 'hand:' + d.id;
          rootIds.add(rootId);
          const cap = (positive(d.heat) + positive(d.electricalOut) +
            positive(d.mechanicalOut)) * INTERVAL + positive(d.kineticJ);
          const joules = Math.min(d.handPower * INTERVAL, cap);
          addRoute('root:' + rootId, 'mechanical-in', 'kinetic', joules,
            rootId, 'motor:' + d.id, d.id, undefined, null, rootId, 0);
        }
        if (original?.weight && d.gravityPower > EPS && d.potentialJ > EPS) {
          const rootId = 'fall:' + d.id;
          rootIds.add(rootId);
          const quantum = positive(original.mass) * 9.81 * 1.5 / 20;
          addChannel('root:' + rootId, 'weight:' + d.id,
            { kind: 'potential', form: 'potential', joules: Math.min(quantum, d.potentialJ) },
            null, rootId, 0);
        }
        if (!original?.hand && !original?.weight && d.kineticPower < -EPS && d.kineticJ > EPS) {
          const rootId = 'rotor:' + d.id;
          rootIds.add(rootId);
          addRoute('root:' + rootId, 'kinetic', 'kinetic',
            Math.min(-d.kineticPower * INTERVAL, d.kineticJ), rootId,
            'motor:' + d.id, d.id, undefined, null, rootId, 0);
        }
      }

      for (const known of [...epochs.keys()]) if (!rootIds.has(known)) epochs.delete(known);
      for (const id of rootIds) if (!epochs.has(id)) epochs.set(id, time);
      const atStation = new Map();
      for (const channel of channels) {
        const group = atStation.get(channel.station) || [];
        channel.index = group.length;
        group.push(channel); atStation.set(channel.station, group);
      }
      for (const group of atStation.values()) group.forEach(c => { c.count = group.length; });
      for (const route of routes) {
        let length;
        try { length = measureRoute?.(route, channels); } catch { length = undefined; }
        route.length = Number.isFinite(length) && length > EPS ? length : 1;
      }
      function timeChannel(channel, offset) {
        channel.arrivalOffset = offset;
        for (const o of channel.outputs) if (o.routeId) {
          const route = routeById.get(o.routeId);
          timeRoute(route, offset + CONVERSION);
        }
      }
      function timeRoute(route, offset) {
        route.departureOffset = offset;
        if (route.targetChannel) timeChannel(channelById.get(route.targetChannel),
          offset + route.length / SPEED);
      }
      for (const route of routes) if (!route.sourceChannel) timeRoute(route, 0);
      for (const channel of channels) if (!channel.sourceRoute) timeChannel(channel, 0);

      const currentRoutes = new Set(routes.map(r => r.id));
      const currentChannels = new Set(channels.map(c => c.id));
      for (const id of [...travelStates.keys()]) if (!currentRoutes.has(id)) {
        travelStates.delete(id); routeSerials.delete(id);
      }
      for (const id of [...knownChannels]) if (!currentChannels.has(id)) {
        knownChannels.delete(id); conversionStates.delete(id);
      }
      for (const id of [...rootSchedules.keys()]) if (!rootIds.has(id)) rootSchedules.delete(id);
      const newRoutes = routes.filter(r => !travelStates.has(r.id));
      const newChannels = channels.filter(c => !knownChannels.has(c.id));
      for (const route of newRoutes) travelStates.set(route.id, []);

      function launch(routeId) {
        const route = routeById.get(routeId), train = travelStates.get(routeId);
        if (!route || !train) return;
        const serial = routeSerials.get(routeId) || 0;
        routeSerials.set(routeId, serial + 1);
        train.push({ id: routeId + '/pulse:' + serial, distance: 0 });
      }
      function finish(channelId) {
        const channel = channelById.get(channelId);
        conversionStates.delete(channelId);
        if (channel) for (const output of channel.outputs) if (output.routeId) launch(output.routeId);
      }
      function start(channelId) {
        if (!channelById.has(channelId)) return;
        // A shortening path can make the next arrival early. Finish the former
        // conversion at that event instead of hiding the incoming packet.
        if (conversionStates.has(channelId)) finish(channelId);
        conversionStates.set(channelId, { age: 0, duration: CONVERSION });
      }
      let now = previousTime === null ? time : previousTime;
      let remaining = previousTime === null ? 0 : Math.max(0, time - previousTime);
      for (let events = 0; remaining > EPS && events < 10000; events++) {
        for (const [channelId, conversion] of conversionStates) {
          const sourceRoute = channelById.get(channelId)?.sourceRoute;
          const route = routeById.get(sourceRoute), train = travelStates.get(sourceRoute);
          if (!route || !train?.length) continue;
          const gap = Math.min(...train.map(p => Math.max(0, (route.length - p.distance) / SPEED)));
          if (gap < conversion.duration - conversion.age)
            conversion.duration = Math.max(conversion.age, Math.min(conversion.duration,
              conversion.age + 0.82 * gap));
        }
        let until = remaining;
        for (const route of routes) for (const pulse of travelStates.get(route.id) || [])
          until = Math.min(until, Math.max(0, (route.length - pulse.distance) / SPEED));
        for (const conversion of conversionStates.values())
          until = Math.min(until, Math.max(0, conversion.duration - conversion.age));
        for (const scheduled of rootSchedules.values())
          until = Math.min(until, Math.max(0, scheduled.nextTime - now));
        for (const train of travelStates.values()) for (const pulse of train) pulse.distance += SPEED * until;
        for (const conversion of conversionStates.values()) conversion.age += until;
        now += until; remaining -= until;
        let fired = false;
        for (const [id, conversion] of [...conversionStates]) if (conversion.age >= conversion.duration - EPS) {
          finish(id); fired = true;
        }
        for (const route of routes) {
          const train = travelStates.get(route.id);
          for (let i = train.length - 1; i >= 0; i--) if (train[i].distance >= route.length - EPS) {
            train.splice(i, 1); fired = true;
            if (route.targetChannel) start(route.targetChannel);
          }
        }
        for (const [rootId, scheduled] of rootSchedules) if (scheduled.nextTime <= now + EPS) {
          const route = routeById.get('root:' + rootId);
          if (route) launch(route.id);
          else start('root:' + rootId);
          scheduled.nextTime += INTERVAL; fired = true;
        }
        if (!fired && until <= EPS) break;
      }

      // A newly enabled stream includes its previous schematic pulses. This is
      // only an initial condition: subsequent motion uses saved world distances.
      for (const route of newRoutes) {
        const elapsed = time - epochs.get(route.rootId) - route.departureOffset;
        const last = Math.floor(elapsed / INTERVAL);
        const first = Math.ceil((elapsed - route.length / SPEED) / INTERVAL);
        const train = travelStates.get(route.id);
        // A live upstream conversion may have launched on this newly appearing
        // branch during the current update. That launch is the real state;
        // seeding the same branch as well would create duplicate packets.
        if (train.length) continue;
        for (let n = first; n <= last; n++) {
          const distance = (elapsed - n * INTERVAL) * SPEED;
          if (distance < -EPS || distance >= route.length - EPS) continue;
          train.push({ id: route.id + '/pulse:' + n, distance });
        }
        routeSerials.set(route.id, Math.max(1, last + 1));
      }
      for (const channel of newChannels) {
        knownChannels.add(channel.id);
        if (conversionStates.has(channel.id)) continue;
        const phase = mod(time - epochs.get(channel.rootId) - channel.arrivalOffset, INTERVAL);
        if (phase < CONVERSION) conversionStates.set(channel.id, { age: phase, duration: CONVERSION });
      }
      for (const rootId of rootIds) if (!rootSchedules.has(rootId))
        rootSchedules.set(rootId, { nextTime: time + INTERVAL });
      lastTime = time;

      const packets = [];
      for (const route of routes) for (const pulse of travelStates.get(route.id) || []) {
        packets.push({ id: pulse.id, kind: route.kind, form: route.form,
          device: route.device, from: route.from, to: route.to, wire: route.wire,
          station: route.to, channel: route.targetChannel, stage: 'travel',
          progress: Math.min(1, pulse.distance / route.length), distance: pulse.distance,
          joules: route.joules, routeId: route.id });
      }
      for (const channel of channels) {
        const conversion = conversionStates.get(channel.id);
        if (!conversion) continue;
        const progress = Math.min(1, conversion.age / conversion.duration);
        packets.push({ id: channel.id + '/input', kind: channel.input.kind,
          form: channel.input.form, device: channel.device, station: channel.station,
          channel: channel.id, stage: 'input', progress,
          joules: channel.input.joules * (1 - progress) });
        channel.outputs.forEach((o, outputIndex) => packets.push({
          id: channel.id + '/output:' + outputIndex, kind: o.kind, form: o.form,
          device: channel.device, from: channel.station, to: o.to, wire: o.wire,
          station: channel.station, channel: channel.id, stage: 'output',
          progress, joules: o.joules * progress, outputIndex,
          store: o.store, routeId: o.routeId
        }));
      }
      return { packets, stocks, channels, routes };
    }
    return Object.freeze({ update, reset });
  }

  const API = Object.freeze({ create, SPEED, INTERVAL, CONVERSION });
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  if (root) root.DynamotEnergyBuffers = API;
})(typeof globalThis !== 'undefined' ? globalThis : this);

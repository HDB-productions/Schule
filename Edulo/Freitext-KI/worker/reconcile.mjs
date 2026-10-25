// Private teacher utility; never include in widget HTML or run automatically.
// ADMIN_TOKEN is read only from the environment, never from command-line arguments.
import { readFile } from 'node:fs/promises';

const [base, filename] = process.argv.slice(2);
const token = process.env.ADMIN_TOKEN;
try {
  const url = new URL(base);
  if (url.protocol !== 'https:' || url.username || url.password || url.pathname !== '/' || url.search || url.hash ||
    !filename || typeof token !== 'string' || token.length < 32) throw Error();
  const content = await readFile(filename, 'utf8');
  if (Buffer.byteLength(content, 'utf8') > 48_000) throw Error();
  const body = JSON.parse(content.replace(/^\uFEFF/, ''));
  // Exactly one administrative request. This utility never generates feedback.
  const response = await fetch(new URL('/admin/reconcile', url), {
    method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(body), signal: AbortSignal.timeout(30_000),
  });
  const result = await response.json();
  console.log(JSON.stringify(result, null, 2));
  if (!response.ok) process.exitCode = 1;
} catch {
  console.error('Private Klärung nicht bestätigt. HTTPS-Basisadresse, private JSON-Datei und ADMIN_TOKEN-Umgebungsvariable prüfen. Bei Timeout dieselbe Klärung unverändert wiederholen.');
  process.exitCode = 1;
}

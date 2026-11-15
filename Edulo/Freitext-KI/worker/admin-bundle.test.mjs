// Regression: Wrangler's default keep_names helper escaped into serialized browser
// code, so source-only browser tests passed while the deployed login crashed.
import test from 'node:test';
import assert from 'node:assert/strict';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {mkdtemp,copyFile,mkdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const exec=promisify(execFile);
const root=fileURLToPath(new URL('../../../',import.meta.url));
test('actual Wrangler deployment bundle supports login and the full class administration workflow',{timeout:90000},async()=>{
  const scratch=path.join(root,'.edulo-tools');await mkdir(scratch,{recursive:true});
  const output=await mkdtemp(path.join(scratch,'admin-bundle-test-'));
  const env={...process.env,WRANGLER_LOG_PATH:path.join(output,'wrangler.log'),WRANGLER_SEND_METRICS:'false'};
  delete env.NODE_TEST_CONTEXT;
  await exec(process.execPath,[path.join(root,'.edulo-tools/cloudflare/node_modules/wrangler/bin/wrangler.js'),'deploy','--dry-run','--config',path.join(root,'Edulo/Freitext-KI/worker/wrangler.jsonc'),'--outdir',output],{cwd:root,env,timeout:30000});
  // Wrangler writes ES modules with a .js extension; .mjs makes Node's import unambiguous.
  const bundle=path.join(output,'worker.mjs');await copyFile(path.join(output,'worker.js'),bundle);
  const result=await exec(process.execPath,['--test',path.join(root,'Edulo/Freitext-KI/worker/admin-browser-integration.test.mjs')],{cwd:root,env:{...env,EDULO_TEST_WORKER_BUNDLE:bundle},timeout:55000});
  assert.match(result.stdout,/pass 1/);
});

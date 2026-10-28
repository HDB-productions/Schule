// Run the current standalone browser contracts of all three apps.
// Each suite uses a local HTTP host; this is not live Edulo verification.
const path=require('node:path');
const {spawnSync}=require('node:child_process');
for(const file of ['reduce.browser.test.cjs','expand.browser.test.cjs','operate.browser.test.cjs']){
  const result=spawnSync(process.execPath,[path.join(__dirname,file)],{stdio:'inherit',env:process.env});
  if(result.error)throw result.error;
  if(result.status!==0)process.exit(result.status||1);
}

// Compatibility entry point for the current shared Aufbau/Ablauf interface.
'use strict';
const { run } = require('./process-ui.test.cjs');
if (require.main === module) run().catch(error => { console.error(error); process.exitCode = 1; });
module.exports = { run };

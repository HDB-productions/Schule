const fs = require('node:fs');
const path = require('node:path');
fs.writeFileSync(path.join(__dirname, 'app.js'), ['domain.js','visuals.js','ui.js'].map(f=>fs.readFileSync(path.join(__dirname,f),'utf8')).join('\n'));
require('../../../tools/edulo/build.cjs').build(path.join(__dirname,'widget.quelle.html'));
require('./review-doc.cjs').buildReview();

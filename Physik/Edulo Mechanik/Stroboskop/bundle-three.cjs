// Offline classic-script closures, using the same approach as the energy widgets.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function bundleThree() {
  const threeDir = path.resolve(__dirname, '../../Energie/dynamot-labor/dynamot-3d-vendor');
  const addonDir = path.join(__dirname, 'vendor');

  function moduleCode(file, name, dependencies = {}) {
    let source = fs.readFileSync(file, 'utf8');
    function dependency(specifier) {
      if (!Object.prototype.hasOwnProperty.call(dependencies, specifier)) throw new Error('Unmapped dependency ' + specifier + ' in ' + file);
      return dependencies[specifier];
    }
    source = source.replace(/^\s*import\s+\*\s+as\s+(\w+)\s+from\s+['"]([^'"]+)['"];?/gm,
      (_, identifier, specifier) => `\nconst ${identifier} = ${dependency(specifier)};`);
    source = source.replace(/^\s*import\s*\{([^}]+)\}\s*from\s*['"]([^'"]+)['"];?/gm,
      (_, list, specifier) => `\nconst {${list.replace(/\bas\b/g, ':')}} = ${dependency(specifier)};`);
    function exportsList(list, origin) {
      return list.split(',').map(item => item.trim()).filter(Boolean).map(item => {
        const [original, alias] = item.split(/\s+as\s+/);
        return `${alias || original}: ${origin ? origin + '.' : ''}${original}`;
      }).join(',');
    }
    source = source.replace(/^\s*export\s*\{([^}]+)\}\s*from\s*['"]([^'"]+)['"];?/gm,
      (_, list, specifier) => `\nObject.assign(exports, {${exportsList(list, dependency(specifier))}});`);
    source = source.replace(/^\s*export\s*\{([^}]+)\}\s*;?/gm,
      (_, list) => `\nObject.assign(exports, {${exportsList(list)}});`);
    if (/^\s*(?:import|export)\b/m.test(source)) throw new Error('Unsupported module declaration in ' + file);
    const closure = `const ${name} = (() => {\nconst exports = {};\n${source}\nreturn exports;\n})();`;
    new vm.Script(closure, { filename: path.basename(file) + '.closure' });
    return closure;
  }

  const notice = fs.readFileSync(path.join(threeDir, 'LICENSE'), 'utf8');
  const bundle = [
    '/* Three.js MIT license\n' + notice + '\n*/',
    moduleCode(path.join(threeDir, 'three.core.js'), 'strobeThreeCore'),
    moduleCode(path.join(threeDir, 'three.module.js'), 'strobeThree', { './three.core.js': 'strobeThreeCore' }),
    moduleCode(path.join(addonDir, 'BufferGeometryUtils.js'), 'strobeGeometryUtils', { three: 'strobeThree' }),
    moduleCode(path.join(addonDir, 'GLTFLoader.js'), 'strobeGLTF', {
      three: 'strobeThree',
      '../utils/BufferGeometryUtils.js': 'strobeGeometryUtils'
    })
  ].join('\n\n').replace(/<\/script/gi, '<\\/script');
  // Compilation deliberately does not evaluate browser-dependent library code.
  new vm.Script(bundle, { filename: 'stroboskop-three-inline.js' });
  return bundle;
}

module.exports = { bundleThree };

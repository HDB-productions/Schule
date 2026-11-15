const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { loadSharp, readGLB, viewBytes, pixels, sha256 } = require('./optimize-mercedes.cjs');
const read = name => fs.readFileSync(path.join(__dirname, 'assets', name));
const sourceBytes = read('Mercedes-W212-original.glb'), outputBytes = read('Mercedes-W212.glb');
const source = readGLB(sourceBytes), output = readGLB(outputBytes);
const report = JSON.parse(read('Mercedes-W212-optimization.json'));

test('original remains intact, asset credit retained, and output is smaller', () => {
  assert.equal(sha256(sourceBytes), report.source.sha256);
  assert.equal(sha256(outputBytes), report.output.sha256);
  assert.equal(outputBytes.length, report.output.bytes);
  assert(outputBytes.length < sourceBytes.length);
  assert.deepEqual(output.json.asset, source.json.asset);
  assert.equal(sourceBytes.length, 37334564);
});

test('all scene hierarchy, wheel groups, materials, primitives and accessors remain unchanged', () => {
  for (const key of ['scene', 'scenes', 'nodes', 'meshes', 'accessors', 'materials', 'samplers', 'animations', 'skins', 'cameras']) {
    assert.deepEqual(output.json[key], source.json[key], key);
  }
  for (const name of ['Body', 'WheelFL', 'WheelFR', 'WheelRL', 'WheelRR']) {
    assert.equal(output.json.nodes.filter(n => n.name === name).length, 1, name);
  }
});

test('every geometry buffer view and every accessor payload is byte-identical and in bounds', () => {
  const imageViews = new Set(source.json.images.map(i => i.bufferView));
  for (let i = 0; i < source.json.bufferViews.length; i++) {
    assert.equal(output.json.bufferViews[i].byteOffset % 4, 0);
    if (!imageViews.has(i)) {
      assert.equal(sha256(viewBytes(output, i)), sha256(viewBytes(source, i)), `geometry view ${i}`);
      const { byteOffset: ignoredSource, ...sourceRest } = source.json.bufferViews[i];
      const { byteOffset: ignoredOutput, ...outputRest } = output.json.bufferViews[i];
      assert.deepEqual(outputRest, sourceRest);
    }
  }
  const components = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4, MAT2: 4, MAT3: 9, MAT4: 16 };
  const widths = { 5120: 1, 5121: 1, 5122: 2, 5123: 2, 5125: 4, 5126: 4 };
  for (const [index, accessor] of source.json.accessors.entries()) {
    assert(!accessor.sparse, 'Source has no sparse accessors.');
    const view = source.json.bufferViews[accessor.bufferView];
    assert(!imageViews.has(accessor.bufferView));
    const elementBytes = components[accessor.type] * widths[accessor.componentType];
    const stride = view.byteStride || elementBytes, start = accessor.byteOffset || 0;
    const end = start + (accessor.count - 1) * stride + elementBytes;
    assert(end <= view.byteLength, `accessor ${index} bounds`);
    assert.equal(sha256(viewBytes(source, accessor.bufferView).subarray(start, end)),
      sha256(viewBytes(output, accessor.bufferView).subarray(start, end)), `accessor ${index}`);
  }
});

test('texture references match MIME and every image retains all decoded RGBA pixels', async () => {
  const sharp = loadSharp();
  assert(output.json.extensionsUsed.includes('EXT_texture_webp'));
  assert(output.json.extensionsRequired.includes('EXT_texture_webp'));
  assert.equal(output.json.textures.length, source.json.textures.length);
  for (const [index, texture] of output.json.textures.entries()) {
    const original = source.json.textures[index];
    const imageIndex = texture.extensions?.EXT_texture_webp?.source ?? texture.source;
    assert.equal(imageIndex, original.source);
    assert.equal(texture.sampler, original.sampler);
    if (texture.extensions?.EXT_texture_webp) {
      assert.equal(texture.source, undefined);
      assert.equal(output.json.images[imageIndex].mimeType, 'image/webp');
    }
  }
  for (let i = 0; i < source.json.images.length; i++) {
    const original = source.json.images[i], image = output.json.images[i];
    assert.equal(image.bufferView, original.bufferView);
    const beforeBytes = viewBytes(source, original.bufferView), afterBytes = viewBytes(output, image.bufferView);
    const metadata = await sharp(afterBytes).metadata();
    assert.equal(image.mimeType, { webp: 'image/webp', png: 'image/png', jpeg: 'image/jpeg' }[metadata.format]);
    const [before, after] = await Promise.all([pixels(sharp, beforeBytes), pixels(sharp, afterBytes)]);
    assert.equal(before.info.width, after.info.width); assert.equal(before.info.height, after.info.height);
    assert(before.data.equals(after.data), `image ${i} full RGBA channels`);
    // A fully opaque alpha channel may be omitted by WebP; RGBA equality above
    // still verifies every alpha value, including any transparent source pixels.
  }
});

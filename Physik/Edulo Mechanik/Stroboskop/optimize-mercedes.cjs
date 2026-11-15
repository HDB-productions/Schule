// Repack only embedded images; geometry, hierarchy and material values stay intact.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const sha256 = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const align4 = n => (n + 3) & ~3;

function loadSharp() {
  const candidates = ['sharp', process.env.SHARP_MODULE,
    path.join(process.env.USERPROFILE || '', '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp')].filter(Boolean);
  for (const candidate of candidates) {
    try { return require(candidate); } catch (error) { if (error.code !== 'MODULE_NOT_FOUND') throw error; }
  }
  throw Error('Install sharp or set SHARP_MODULE to its local module path.');
}

function readGLB(bytes) {
  assert(bytes.length >= 28 && bytes.readUInt32LE(0) === 0x46546c67, 'Expected a GLB.');
  assert.equal(bytes.readUInt32LE(4), 2);
  assert.equal(bytes.readUInt32LE(8), bytes.length);
  const chunks = [];
  for (let offset = 12; offset < bytes.length;) {
    assert(offset + 8 <= bytes.length, 'Truncated chunk header.');
    const size = bytes.readUInt32LE(offset), type = bytes.readUInt32LE(offset + 4);
    assert.equal(size % 4, 0);
    assert(offset + 8 + size <= bytes.length, 'Truncated chunk.');
    chunks.push({ type, data: bytes.subarray(offset + 8, offset + 8 + size) });
    offset += size + 8;
  }
  assert.deepEqual(chunks.map(c => c.type), [0x4e4f534a, 0x004e4942], 'Expected exactly JSON and BIN chunks.');
  const json = JSON.parse(chunks[0].data.toString('utf8').trim()), bin = chunks[1].data;
  assert.equal(json.buffers.length, 1);
  assert.equal(json.buffers[0].uri, undefined);
  assert(json.buffers[0].byteLength <= bin.length && bin.length - json.buffers[0].byteLength < 4);
  for (const view of json.bufferViews) {
    assert.equal(view.buffer, 0);
    assert((view.byteOffset || 0) + view.byteLength <= json.buffers[0].byteLength, 'Buffer view outside BIN.');
  }
  return { json, bin };
}

function viewBytes(glb, index) {
  const view = glb.json.bufferViews[index];
  return glb.bin.subarray(view.byteOffset || 0, (view.byteOffset || 0) + view.byteLength);
}

function writeGLB(json, bin) {
  // Keep signed zero in original transforms too, although +/-0 render equally.
  const text = Buffer.from(JSON.stringify(json, (_key, value) => Object.is(value, -0) ? JSON.rawJSON('-0') : value));
  const paddedJson = Buffer.alloc(align4(text.length), 0x20);
  text.copy(paddedJson);
  const paddedBin = Buffer.alloc(align4(bin.length)); bin.copy(paddedBin);
  const out = Buffer.alloc(12 + 8 + paddedJson.length + 8 + paddedBin.length);
  out.writeUInt32LE(0x46546c67, 0); out.writeUInt32LE(2, 4); out.writeUInt32LE(out.length, 8);
  out.writeUInt32LE(paddedJson.length, 12); out.writeUInt32LE(0x4e4f534a, 16); paddedJson.copy(out, 20);
  const binHeader = 20 + paddedJson.length;
  out.writeUInt32LE(paddedBin.length, binHeader); out.writeUInt32LE(0x004e4942, binHeader + 4); paddedBin.copy(out, binHeader + 8);
  return out;
}

async function pixels(sharp, data) {
  return sharp(data).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
}

async function optimize(source, sharp = loadSharp()) {
  const original = readGLB(source), json = structuredClone(original.json), replacements = new Map(), converted = new Set(), images = [];
  const accessorViews = new Set();
  for (const accessor of json.accessors || []) {
    if (accessor.bufferView !== undefined) accessorViews.add(accessor.bufferView);
    if (accessor.sparse) { accessorViews.add(accessor.sparse.indices.bufferView); accessorViews.add(accessor.sparse.values.bufferView); }
  }
  for (const [index, image] of json.images.entries()) {
    assert(image.bufferView !== undefined && !image.uri, 'Only embedded image buffer views supported.');
    assert(!accessorViews.has(image.bufferView), 'An image buffer view must not contain geometry.');
    const input = viewBytes(original, image.bufferView), metadata = await sharp(input).metadata();
    const candidate = await sharp(input).webp({ lossless: true, effort: 6 }).toBuffer();
    let equalPixels = false;
    if (candidate.length < input.length) {
      const [before, after] = await Promise.all([pixels(sharp, input), pixels(sharp, candidate)]);
      equalPixels = before.info.width === after.info.width && before.info.height === after.info.height && before.data.equals(after.data);
    }
    if (candidate.length < input.length && equalPixels) {
      assert(!replacements.has(image.bufferView), 'Shared image views require explicit handling.');
      replacements.set(image.bufferView, candidate); converted.add(index); image.mimeType = 'image/webp';
    }
    images.push({ index, width: metadata.width, height: metadata.height, hasAlpha: metadata.hasAlpha,
      originalMimeType: original.json.images[index].mimeType, mimeType: image.mimeType,
      originalBytes: input.length, outputBytes: converted.has(index) ? candidate.length : input.length,
      converted: converted.has(index), decodedPixelsIdentical: converted.has(index) ? equalPixels : true });
  }
  if (converted.size) {
    for (const texture of json.textures || []) {
      if (!converted.has(texture.source)) continue;
      texture.extensions = { ...texture.extensions, EXT_texture_webp: { source: texture.source } };
      delete texture.source;
    }
    json.extensionsUsed = [...new Set([...(json.extensionsUsed || []), 'EXT_texture_webp'])];
    json.extensionsRequired = [...new Set([...(json.extensionsRequired || []), 'EXT_texture_webp'])];
  }
  // Original view indices and contents remain stable; replace image payloads only.
  const segments = []; let offset = 0;
  for (const [index, view] of json.bufferViews.entries()) {
    const padding = align4(offset) - offset;
    if (padding) { segments.push(Buffer.alloc(padding)); offset += padding; }
    const data = replacements.get(index) || viewBytes(original, index);
    view.byteOffset = offset; view.byteLength = data.length;
    segments.push(data); offset += data.length;
  }
  json.buffers[0].byteLength = offset;
  const output = writeGLB(json, Buffer.concat(segments)), saved = source.length - output.length;
  const report = {
    source: { file: 'Mercedes-W212-original.glb', bytes: source.length, sha256: sha256(source) },
    output: { file: 'Mercedes-W212.glb', bytes: output.length, sha256: sha256(output) },
    savedBytes: saved, savedPercent: Number((100 * saved / source.length).toFixed(2)),
    method: 'Lossless WebP for smaller images with verified identical decoded RGBA pixels; original geometry bytes copied unchanged.',
    geometryChanged: false, removedNodes: 0, removedMeshes: 0, removedPrimitives: 0,
    requiredExtension: converted.size ? 'EXT_texture_webp' : null,
    convertedImageCount: converted.size, retainedImageCount: images.length - converted.size,
    asset: json.asset, images
  };
  return { output, report };
}

if (require.main === module) {
  (async () => {
    const sourcePath = path.join(__dirname, 'assets/Mercedes-W212-original.glb');
    const source = fs.readFileSync(sourcePath), { output, report } = await optimize(source);
    assert.equal(sha256(fs.readFileSync(sourcePath)), report.source.sha256, 'Source changed during optimization.');
    fs.writeFileSync(path.join(__dirname, 'assets/Mercedes-W212.glb'), output);
    fs.writeFileSync(path.join(__dirname, 'assets/Mercedes-W212-optimization.json'), JSON.stringify(report, null, 2) + '\n');
    console.log(JSON.stringify({ sourceBytes: source.length, outputBytes: output.length, savedPercent: report.savedPercent, convertedImages: report.convertedImageCount }));
  })().catch(error => { console.error(error); process.exitCode = 1; });
}
module.exports = { loadSharp, readGLB, viewBytes, writeGLB, pixels, optimize, sha256 };

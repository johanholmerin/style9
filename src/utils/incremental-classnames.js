const CLASS_CACHE = Object.create({});
let CLASS_INDEX = 0;

const CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const REST_CHARS = [...CHARS, ...'0123456789'.split('')];

function isSafeClassname(cls) {
  return !/(ad|fa)/gi.test(cls);
}

function generateClassname(index) {
  let i = parseInt(index / CHARS.length);
  const logCharsRadix = parseInt(Math.log(REST_CHARS.length));
  const n = parseInt(Math.log(i * (REST_CHARS.length - 1) + 1) / logCharsRadix);

  let cssNameChars = CHARS[index % CHARS.length];

  for (let k = 1; k <= n; ++k) {
    cssNameChars += REST_CHARS[i % REST_CHARS.length];
    i /= REST_CHARS.length;
  }

  return cssNameChars;
}

function getIncrementalClass(key) {
  let value = CLASS_CACHE[key];
  if (value) return value;

  do {
    value = generateClassname(CLASS_INDEX++);
  } while (!isSafeClassname(value));

  CLASS_CACHE[key] = value;

  return value;
}

module.exports = { getIncrementalClass };

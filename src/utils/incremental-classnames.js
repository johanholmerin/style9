function createGenerator() {
  const CLASS_CACHE = Object.create(null);
  let CLASS_INDEX = 0;

  const CHRS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const REST_CHRS = [...CHRS, ...'0123456789'.split('')];

  function isSafeClassname(cls) {
    return !/(ad|fa)/gi.test(cls);
  }

  function generateClassname(index) {
    let i = parseInt(index / CHRS.length);
    const logCharsRadix = parseInt(Math.log(REST_CHRS.length));
    const n = parseInt(
      Math.log(i * (REST_CHRS.length - 1) + 1) / logCharsRadix
    );

    let cssNameChars = CHRS[index % CHRS.length];

    for (let k = 1; k <= n; ++k) {
      cssNameChars += REST_CHRS[i % REST_CHRS.length];
      i = parseInt(i / REST_CHRS.length);
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

  return { getIncrementalClass };
}

module.exports = createGenerator;

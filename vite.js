const crypto = require('crypto');
const babel = require('@babel/core');
const { createFilter } = require('@rollup/pluginutils');
const babelPlugin = require('./babel.js');
const NAME = require('./package.json').name;

const VIRTUAL_MODULE_PREFIX = `\0virtual-style9:`;

function getHash(text) {
  return crypto.createHash('sha256').update(text).digest('hex').slice(0, 8);
}

function getSecond() {
  return Math.floor(Date.now() / 1000);
}

module.exports = function style9Plugin(opts = {}) {
  const {
    include = /\.[jt]sx?$/,
    exclude,
    parserOptions = {
      plugins: ['typescript', 'jsx']
    },
    ...restOptions
  } = opts;

  const cssModules = new Map();

  const filter = createFilter(include, exclude);

  return {
    name: NAME,
    resolveId(id) {
      if (cssModules.has(id)) {
        return VIRTUAL_MODULE_PREFIX + id + '?t=' + getSecond();
      }
      return null;
    },
    load(id) {
      if (id.startsWith(VIRTUAL_MODULE_PREFIX)) {
        const [module] = id.split('?', 1);
        const hashId = module.slice(VIRTUAL_MODULE_PREFIX.length);
        const css = cssModules.get(hashId);
        return css;
      }
      return null;
    },
    async transform(stdin, id) {
      if (!filter(id)) return;
      const res = await babel.transformAsync(stdin, {
        plugins: [[babelPlugin, restOptions]],
        filename: id,
        sourceMaps: true,
        parserOpts: parserOptions,
        babelrc: false
      });
      if (!res) return;
      const { code, map, metadata } = res;
      const cssStr = metadata.style9 || '';
      if (cssStr) {
        const path = `./${getHash(id)}.css`;
        cssModules.set(path, cssStr);
        const output = `import '${path}';\n ${code}`;
        return {
          code: output,
          map
        };
      }
      return { code, map };
    }
  };
};

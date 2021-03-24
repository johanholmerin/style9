const babel = require('@babel/core');
const { createFilter } = require('@rollup/pluginutils');
const babelPlugin = require('./babel.js');
const NAME = require('./package.json').name;
const processCSS = require('./src/process-css.js');

module.exports = function style9Plugin({
  include,
  exclude,
  fileName,
  name,
  parserOptions = {
    plugins: ['typescript', 'jsx']
  }
} = {}) {
  // Default name required to ensure extension
  if (!fileName && !name) name = 'index.css';

  const filter = createFilter(include, exclude);
  const styles = Object.create(null);

  return {
    name: NAME,
    async transform(input, id) {
      if (!filter(id)) return;

      const { code, map, metadata } = await babel.transformAsync(input, {
        plugins: [babelPlugin],
        parserOpts: parserOptions,
        babelrc: false
      });

      styles[id] = metadata.style9 || '';

      return { code, map };
    },
    generateBundle(options, bundles) {
      let css = '';
      // Collect css from files that are included in this build
      for (const bundle in bundles) {
        for (const id in bundles[bundle].modules) {
          if (id in styles) {
            css += styles[id];
          }
        }
      }

      this.emitFile({
        type: 'asset',
        source: processCSS(css).css,
        fileName,
        name
      });
    }
  };
};

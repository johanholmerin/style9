const path = require('path');
const babel = require('@babel/core');
const { createFilter } = require('@rollup/pluginutils');
const processCSS = require('./src/process-css');
const babelPlugin = require('./babel.js');
const NAME = require('./package.json').name;

const VIRTUAL_MODULE_NAME = '@virtual-style9';

module.exports = function style9Plugin(opts = {}) {
  const {
    include = /\.[jt]sx?$/,
    exclude,
    parserOptions = {
      plugins: ['typescript', 'jsx']
    },
    ...restOptions
  } = opts;

  const filter = createFilter(include, exclude);

  const cssModules = new Map();

  let server = null;

  return {
    name: NAME,
    enforce: 'pre',
    resolveId(id) {
      if (id === VIRTUAL_MODULE_NAME) {
        return `\0${id}.css`;
      }
      return null;
    },
    configureServer(viteServer) {
      server = viteServer;
    },
    load(id) {
      if (id.startsWith(`\0${VIRTUAL_MODULE_NAME}`)) {
        const css = [...cssModules.values()].reduce(
          (acc, cur) => (acc += cur),
          ''
        );
        return processCSS(css, { from: undefined }).css;
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
        cssModules.set(id, cssStr);
        if (server) {
          const { moduleGraph, ws } = server;
          const virtualStyle9 = moduleGraph.getModulesByFile(
            `\0${VIRTUAL_MODULE_NAME}.css`
          );
          if (virtualStyle9) {
            const seen = new Set();
            virtualStyle9.forEach(mod =>
              moduleGraph.invalidateModule(mod, seen)
            );
            ws.send({ type: 'full-reload' });
          }
          const output = `import '${VIRTUAL_MODULE_NAME}';\n ${code}`;
          return {
            code: output,
            map
          };
        }
        return {
          code,
          map
        };
      }
      return { code, map };
    },
    generateBundle(_, bundles) {
      let css = '';
      let id = '';
      for (const bundle in bundles) {
        const module = bundles[bundle];
        if (module.type === 'asset') continue;
        const { facadeModuleId } = module;
        if (!id) id = facadeModuleId;
        if (cssModules.has(facadeModuleId)) {
          css += cssModules.get(facadeModuleId);
        }
      }
      this.emitFile({
        name: `${path.parse(id).name}.css`,
        type: 'asset',
        source: processCSS(css, { from: undefined }).css
      });
    }
  };
};

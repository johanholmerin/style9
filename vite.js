const babel = require('@babel/core');
const { createFilter } = require('@rollup/pluginutils');
const processCSS = require('./src/process-css');
const babelPlugin = require('./babel.js');
const NAME = require('./package.json').name;

const VIRTUAL_MODULE_NAME = '\0plugin-style9:virtual-module';
const VIRTUAL_CSS_NAME = VIRTUAL_MODULE_NAME + '.css';

async function transformStyle9(
  code,
  id,
  { parserOptions, restOptions, server, cssModules }
) {
  const res = await babel.transformAsync(code, {
    plugins: [[babelPlugin, restOptions]],
    filename: id,
    sourceMaps: true,
    parserOpts: parserOptions,
    babelrc: false
  });
  if (!res) {
    return;
  }
  const { code: _code, map, metadata } = res;
  const output = [_code];
  const css = metadata.style9;
  if (css) {
    cssModules.set(id, css);
    output.unshift(`import '${VIRTUAL_MODULE_NAME}'`);
    if (server) {
      const { moduleGraph } = server;
      const virtualModule = moduleGraph.getModuleById(VIRTUAL_CSS_NAME);
      if (virtualModule) {
        const { code } = virtualModule.transformResult;
        const output = code.split('\n');
        const finalCoe = output.reduce((acc, cur) => {
          if (cur.startsWith('const __vite__css')) {
            cur = `const __vite__css = '${genCSS(cssModules)}'`;
          }
          return (acc += cur + '\n');
        }, '');
        virtualModule.transformResult.code = finalCoe;
      }
    }
  }
  return {
    map,
    code: output.join('\n')
  };
}
function genCSS(cssModule) {
  const chunk = Array.from(cssModule.values()).reduce(
    (acc, cur) => (acc += cur),
    ''
  );
  return processCSS(chunk, { from: undefined }).css;
}
module.exports = function style9Plugin(opts = {}) {
  const {
    include = /\.[jt]sx?$/,
    exclude,
    fileName = VIRTUAL_CSS_NAME,
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
    async resolveId(id) {
      if (id === VIRTUAL_MODULE_NAME) {
        return `${VIRTUAL_CSS_NAME}?t=${Date.now()}`;
      }
      return null;
    },
    configureServer(viteServer) {
      server = viteServer;
    },
    async load(id) {
      if (id.startsWith(VIRTUAL_CSS_NAME)) {
        return '';
      }
      return null;
    },
    transform(code, id) {
      if (!filter(id)) {
        return;
      }
      return transformStyle9(code, id, {
        parserOptions,
        restOptions,
        cssModules,
        server
      });
    },
    renderChunk(_, chunk) {
      const ids = Object.keys(chunk.modules);
      for (const id of ids) {
        if (id.startsWith(VIRTUAL_CSS_NAME)) {
          delete chunk.modules[id];
        }
      }
      const referenceId = this.emitFile({
        name: fileName,
        type: 'asset',
        source: genCSS(cssModules)
      });
      chunk.viteMetadata.importedCss.add(this.getFileName(referenceId));
    }
  };
};

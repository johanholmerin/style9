const rollupPlugin = require('./rollup');
const processCSS = require('./src/process-css.js');

const LOADER_ID = 'style9/vite-loader';
const STYLES_ID = 'style9/vite-loader-css';

const LOADER_FILE = `
export let invalidate = () => {};

if (import.meta.hot) {
  const getStyleTag = () => {
    let tag = document.head.querySelector('style#style9');
    if (!tag) {
      tag = document.createElement('style');
      tag.id = 'style9';
      document.head.append(tag);
    }
    return tag;
  };

  invalidate = async () => {
    const { styles } = await import(/* @vite-ignore */ '/@id/${STYLES_ID}?' + Date.now());
    const tag = getStyleTag();
    tag.textContent = styles;
  };
}
`;

const HMR_CODE = `
import { invalidate as ___invalidate___ } from ${JSON.stringify(LOADER_ID)};
if (import.meta.hot) {
  ___invalidate___();
}
`;

function generateStyles(styles) {
  let css = '';

  for (const id in styles) {
    css += styles[id];
  }

  return processCSS(css, { from: undefined }).css;
}

module.exports = function style9Plugin(opt) {
  const plugin = rollupPlugin(opt);
  let build = false;

  return {
    ...plugin,
    config(_config, { command }) {
      build = command === 'build';
    },
    async transform(input, filename) {
      if (filename === LOADER_ID) return;
      const result = await plugin.transform(input, filename);
      if (!result) return;

      if (!plugin._getStyles()[filename]) return;
      const code = result.code + (build ? '' : HMR_CODE);

      return {
        code,
        map: result.map
      };
    },
    resolveId(id) {
      if (!build && id === `/${opt.fileName}?direct`) {
        return id;
      }
      if (id === LOADER_ID) {
        return id;
      }
      if (id.startsWith(`${STYLES_ID}?`)) {
        return id;
      }
    },
    load(id) {
      if (!build && id === `/${opt.fileName}?direct`) {
        return '';
      }

      if (id === LOADER_ID) {
        return LOADER_FILE;
      }

      if (id.startsWith(`${STYLES_ID}?`)) {
        const css = generateStyles(plugin._getStyles());
        return `export const styles = ${JSON.stringify(css)};`;
      }
    },
    handleHotUpdate(ctx) {
      console.log('handleHotUpdate', ctx);
    }
  };
};

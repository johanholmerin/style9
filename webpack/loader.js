const path = require('path');
const babel = require('@babel/core');
const loaderUtils = require('loader-utils');
const babelPlugin = require('../babel.js');
const virtualModules = require('./virtualModules.js');

async function style9Loader(input, inputSourceMap) {
  const {
    inlineLoader = '',
    outputCSS = true,
    parserOptions = {
      plugins: ['typescript', 'jsx']
    },
    ...options
  } = loaderUtils.getOptions(this) || {};

  this.async();

  try {
    const { code, map, metadata } = await babel.transformAsync(input, {
      plugins: [[babelPlugin, options]],
      inputSourceMap: inputSourceMap || true,
      sourceFileName: this.resourcePath,
      filename: path.basename(this.resourcePath),
      sourceMaps: true,
      parserOpts: parserOptions,
      babelrc: false
    });

    if (metadata.style9 === undefined) {
      this.callback(null, input, inputSourceMap);
    } else if (!outputCSS) {
      this.callback(null, code, map);
    } else {
      // Webpack Virtual Module plugin doesn't support triggering a rebuild for webpack5,
      // which can cause "module not found" error when webpack5 cache is enabled.
      // Currently the only "non-hacky" workaround is to mark this module as non-cacheable.
      //
      // See also:
      // - https://github.com/sysgears/webpack-virtual-modules/issues/86
      // - https://github.com/sysgears/webpack-virtual-modules/issues/76
      // - https://github.com/windicss/windicss-webpack-plugin/blob/bbb91323a2a0c0f880eecdf49b831be092ccf511/src/loaders/virtual-module.ts
      // - https://github.com/sveltejs/svelte-loader/pull/151
      this.cacheable(false);

      const cssPath = loaderUtils.interpolateName(
        this,
        '[path][name].[hash:base64:7].css',
        {
          content: metadata.style9
        }
      );

      virtualModules.writeModule(cssPath, metadata.style9);

      const postfix = `\nimport '${inlineLoader + cssPath}';`;
      this.callback(null, code + postfix, map);
    }
  } catch (error) {
    this.callback(error);
  }
}

module.exports = style9Loader;

const babel = require('@babel/core');
const babelPlugin = require('../babel.js');
const loaderUtils = require('loader-utils');
const virtualModules = require('./virtualModules.js');
const path = require('path');

async function style9Loader(input, inputSourceMap) {
  const {
    inlineLoader = '',
    outputCSS = true,
    parserOptions = {
      plugins: ['typescript', 'jsx'],
    },
    ...options
  } = loaderUtils.getOptions(this) || {};

  this.async();

  const { code, map, metadata } = await babel.transformAsync(input, {
    plugins: [[babelPlugin, options]],
    inputSourceMap: inputSourceMap || true,
    sourceFileName: this.resourcePath,
    filename: path.basename(this.resourcePath),
    sourceMaps: true,
    parserOpts: parserOptions
  });

  if (metadata.style9 === undefined) {
    this.callback(null, input, inputSourceMap);
  } else if (!outputCSS) {
    this.callback(null, code, map);
  } else {
    const cssPath = loaderUtils.interpolateName(
      this,
      '[path][name].[hash:base64:7].css',
      {
        content: metadata.style9
      }
    );

    virtualModules.writeModule(cssPath, metadata.style9);

    const postfix = `import '${inlineLoader + cssPath}';`;
    this.callback(null, code + postfix, map);
  }
}

module.exports = style9Loader;

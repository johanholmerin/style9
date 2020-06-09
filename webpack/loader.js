const babel = require('@babel/core');
const babelPlugin = require('../babel.js');
const loaderUtils = require('loader-utils');
const virtualModules = require('./virtualModules.js');

async function style9Loader(input, inputSourceMap) {
  const {
    inlineLoader = '',
    outputCSS = true
  } = loaderUtils.getOptions(this) || {};

  this.async();

  const { code, map, metadata } = await babel.transformAsync(input, {
    plugins: [babelPlugin],
    inputSourceMap: inputSourceMap || true,
    sourceFileName: this.resourcePath,
    sourceMaps: true
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

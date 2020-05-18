const babel = require('@babel/core');
const babelPlugin = require('../babel.js');

async function style9Loader(input, inputSourceMap) {
  this.async();

  const { code, map, metadata } = await babel.transformAsync(input, {
    plugins: [babelPlugin],
    inputSourceMap
  });

  style9Loader.styles[this.resourcePath] = metadata.style9 || '';

  this.callback(null, code, map);
}

style9Loader.styles = Object.create(null);

module.exports = style9Loader;

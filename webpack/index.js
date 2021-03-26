const { SourceMapSource, RawSource } = require('webpack-sources');
const NAME = require('../package.json').name;
const processCSS = require('../src/process-css.js');
const virtualModules = require('./virtualModules.js');

class Style9Plugin {
  constructor({ test = /\.css$/ } = {}) {
    this.test = test;
  }

  apply(compiler) {
    virtualModules.apply(compiler);

    compiler.hooks.compilation.tap(NAME, compilation => {
      if (compilation.hooks.processAssets) {
        compilation.hooks.processAssets.tap(
          {
            name: NAME,
            stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE
          },
          assets => {
            const paths = Object.keys(assets);

            this._processFiles(compilation, paths);
          }
        );
      } else {
        compilation.hooks.optimizeChunkAssets.tapPromise(NAME, async chunks => {
          const paths = Array.from(chunks)
            .map(chunk => Array.from(chunk.files))
            .flat();

          this._processFiles(compilation, paths);
        });
      }
    });
  }

  _processFiles(compilation, paths) {
    const filteredPaths = paths.filter(path => path.match(this.test));

    for (const path of filteredPaths) {
      const asset = compilation.assets[path];
      const { source, map } = asset.sourceAndMap();
      const postcssOpts = {
        to: path,
        from: path,
        map: { prev: map || false }
      };
      const result = processCSS(source, postcssOpts);

      if (result.map) {
        compilation.assets[path] = new SourceMapSource(
          result.css,
          path,
          JSON.parse(result.map),
          source,
          map,
          true
        );
      } else {
        compilation.assets[path] = new RawSource(result.css);
      }
    }
  }
}

module.exports = Style9Plugin;

module.exports.loader = require.resolve('./loader.js');

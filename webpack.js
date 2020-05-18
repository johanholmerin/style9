const discardDuplicates = require('postcss-discard-duplicates');
const { styles } = require('./src/webpack-loader.js');

class Style9Plugin {
  constructor({ name = 'index.css', test }) {
    this.options = { name, test };
  }

  apply(compiler) {
    compiler.options.module.rules.splice(0, 0, {
      test: this.options.test,
      use: [
        {
          loader: require.resolve('./src/webpack-loader.js')
        }
      ]
    });

    compiler.hooks.thisCompilation.tap('Style9Plugin', compilation => {
      compilation.hooks.additionalAssets.tap('Style9Plugin', () => {
        let css = '';
        // Collect css from files that are included in this build
        for (const id of compilation.fileDependencies) {
          if (id in styles) {
            css += styles[id];
          }
        }

        css = discardDuplicates.process(css, { from: undefined }).css;

        compilation.assets[this.options.name] = {
          source() {
            return css;
          },
          size() {
            return css.length;
          }
        };
      });
    });
  }
}

module.exports = Style9Plugin;

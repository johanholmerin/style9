const Style9Plugin = require('../webpack/index.js');
const { stringifyCssRequest } = require('../src/plugin-utils.js');

exports.onCreateWebpackConfig = (
  { stage, loaders, actions, getConfig },
  { plugins, ...pluginOptions },
) => {
  if (stage === 'develop-html') return;

  const config = getConfig();

  const outputCSS = !stage.includes('html');
  const inlineLoader = stringifyCssRequest([
    loaders.miniCssExtract(),
    { loader: 'css-loader' }
  ]);

  config.module.rules.unshift({
    test: /\.(tsx|ts|js|mjs|jsx)$/,
    use: [
      {
        loader: Style9Plugin.loader,
        options: { inlineLoader, outputCSS }
      }
    ]
  });

  if (outputCSS) {
    config.plugins.push(new Style9Plugin(pluginOptions));
  }

  actions.replaceWebpackConfig(config);
};

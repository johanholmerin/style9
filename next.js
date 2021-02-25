const {
  getClientStyleLoader
} = require('next/dist/build/webpack/config/blocks/css/loaders/client');
const MiniCssExtractPlugin = require('next/dist/build/webpack/plugins/mini-css-extract-plugin')
  .default;
const { stringifyCssRequest } = require('./src/plugin-utils.js');
const Style9Plugin = require('./webpack/index.js');

function getInlineLoader(options) {
  const outputLoaders = [{ loader: 'css-loader' }];

  if (!options.isServer) {
    outputLoaders.unshift(
      // Logic adopted from https://git.io/JfD9r
      getClientStyleLoader({
        isDevelopment: false,
        assetPrefix: options.config.assetPrefix
      })
    );
  }

  return stringifyCssRequest(outputLoaders);
}

module.exports = (pluginOptions = {}) => (nextConfig = {}) => {
  return {
    ...nextConfig,
    webpack(config, options) {
      const outputCSS = !options.isServer;

      config.module.rules.push({
        test: /\.(tsx|ts|js|mjs|jsx)$/,
        use: [
          {
            loader: Style9Plugin.loader,
            options: {
              inlineLoader: getInlineLoader(options),
              outputCSS,
              ...pluginOptions
            }
          }
        ]
      });

      if (outputCSS) {
        config.plugins.push(
          // Logic adopted from https://git.io/JtdBy
          new MiniCssExtractPlugin({
            filename: 'static/css/[contenthash].css',
            chunkFilename: 'static/css/[contenthash].css',
            ignoreOrder: true
          }),
          new Style9Plugin()
        );
      }

      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, options);
      }

      return config;
    }
  };
};

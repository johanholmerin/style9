const Style9Plugin = require('./webpack/index.js');
const {
  getClientStyleLoader
} = require('next/dist/build/webpack/config/blocks/css/loaders/client');
const { stringifyCssRequest } = require('./src/plugin-utils.js');

function getInlineLoader(options) {
  const outputLoaders = [
    { loader: 'css-loader' }
  ];

  if (!options.isServer) {
    outputLoaders.unshift(
      // Logic adopted from https://git.io/JfD9r
      getClientStyleLoader({
        isDevelopment: options.dev,
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

      config.module.rules.unshift({
        test: /\.(tsx|ts|js|mjs|jsx)$/,
        use: [
          {
            loader: Style9Plugin.loader,
            options: { inlineLoader: getInlineLoader(options), outputCSS }
          }
        ]
      });

      if (outputCSS) {
        config.plugins.push(new Style9Plugin(pluginOptions));
      }

      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, options);
      }

      return config;
    }
  };
};

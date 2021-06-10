const {
  getClientStyleLoader
} = require('next/dist/build/webpack/config/blocks/css/loaders/client');
const gte = require('semver/functions/gte');
const nextVersion = require('next/package.json').version;

const useOwnCssPlugin = gte(nextVersion, '10.2.1');

const MiniCssExtractPlugin = useOwnCssPlugin
  ? require('mini-css-extract-plugin')
  : require('next/dist/build/webpack/plugins/mini-css-extract-plugin').default;

const { stringifyCssRequest } = require('./src/plugin-utils.js');
const Style9Plugin = require('./webpack/index.js');

const cssLoader = (() => {
  try {
    // v10+
    return require.resolve('next/dist/compiled/css-loader');
  } catch (_) {
    return 'css-loader';
  }
})();

function getInlineLoader(options) {
  const outputLoaders = [{ loader: cssLoader }];

  if (!options.isServer) {
    // Logic adopted from https://git.io/JfD9r
    const loader = getClientStyleLoader({
      isDevelopment: false,
      assetPrefix: options.config.assetPrefix
    });

    if (useOwnCssPlugin) {
      loader.loader = MiniCssExtractPlugin.loader;
    }

    outputLoaders.unshift(loader);
  }

  return stringifyCssRequest(outputLoaders);
}

module.exports = (pluginOptions = {}) => (nextConfig = {}) => {
  return {
    ...nextConfig,
    webpack(config, options) {
      const outputCSS = !options.isServer;

      // The style9 compiler must run on source code, which means it must be
      // configured as the last loader in webpack so that it runs before any
      // other transformation.

      if (typeof nextConfig.webpack === 'function') {
        config = nextConfig.webpack(config, options);
      }

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
        config.optimization.splitChunks.cacheGroups.styles = {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true
        };

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

      return config;
    }
  };
};

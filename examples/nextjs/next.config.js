const withTM = require('next-transpile-modules')(['style9']);
const withStyle9 = require('style9/next');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

const minify = (nextConfig = {}) => {
  return {
    ...nextConfig,
    webpack(config, options) {
      if (typeof nextConfig.webpack === 'function') {
        config = nextConfig.webpack(config, options);
      }

      config.optimization.minimizer.push(
        new CssMinimizerPlugin()
      );

      return config;
    }
  }
};

module.exports = {
  ...minify(withStyle9()(withTM())),
  webpack5: false,
};

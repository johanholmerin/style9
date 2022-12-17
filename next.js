const {
  getClientStyleLoader
} = require('next/dist/build/webpack/config/blocks/css/loaders/client');
const NextMiniCssExtractPlugin = require('next/dist/build/webpack/plugins/mini-css-extract-plugin')
  .default;

const { findPagesDir } = require('next/dist/lib/find-pages-dir');

const { browserslist } = require('next/dist/compiled/browserslist');
const { lazyPostCSS } = require('next/dist/build/webpack/config/blocks/css');

const Style9Plugin = require('./webpack/index.js');

// Adopted from https://github.com/vercel/next.js/blob/1f1632979c78b3edfe59fd85d8cce62efcdee688/packages/next/build/webpack-config.ts#L60-L72
function getSupportedBrowsers(dir, isDevelopment) {
  let browsers;
  try {
    browsers = browserslist.loadConfig({
      path: dir,
      env: isDevelopment ? 'development' : 'production'
    });
  } catch (_) {
    /** */
  }
  return browsers;
}

const cssLoader = (() => {
  try {
    // v12+
    return require.resolve('next/dist/build/webpack/loaders/css-loader/src');
  } catch (_) {
    return 'css-loader';
  }
})();

const getNextMiniCssExtractPlugin = isDev => {
  // Use own MiniCssExtractPlugin to ensure HMR works
  // v9 has issues when using own plugin in production
  // v10.2.1 has issues when using built-in plugin in development since it
  // doesn't bundle HMR files
  // v12.1.7 finaly fixes the issue by adding the missing hmr/hotModuleReplacement.js file
  if (isDev) {
    try {
      // Check if hotModuleReplacement exists
      require('next/dist/compiled/mini-css-extract-plugin/hmr/hotModuleReplacement');
      return NextMiniCssExtractPlugin;
    } catch (_) {
      return require('mini-css-extract-plugin');
    }
  }
  // Always use Next.js built-in MiniCssExtractPlugin in production
  return NextMiniCssExtractPlugin;
};

function getStyle9VirtualCssLoader(options, MiniCssExtractPlugin, hasAppDir) {
  const outputLoaders = [
    {
      loader: cssLoader,
      options: {
        // A simplify version of https://github.com/vercel/next.js/blob/88a5f263f11cb55907f0d89a4cd53647ee8e96ac/packages/next/build/webpack/config/blocks/css/index.ts#L142-L147
        postcss: () =>
          lazyPostCSS(
            options.dir,
            getSupportedBrowsers(options.dir, options.dev)
          )
      }
    }
  ];

  if (!options.isServer) {
    outputLoaders.unshift({
      // Logic adopted from https://git.io/JfD9r
      ...getClientStyleLoader({
        hasAppDir,
        // In development model Next.js uses style-loader, which inserts each
        // CSS file as its own style tag, which means the CSS won't be sorted
        // and causes issues with determinism when using media queries and
        // pseudo selectors. Setting isDevelopment means MiniCssExtractPlugin is
        // used instead.
        isDevelopment: false,
        assetPrefix: options.config.assetPrefix
      }),
      loader: MiniCssExtractPlugin.loader
    });
  }

  return outputLoaders;
}

module.exports = (pluginOptions = {}) => (nextConfig = {}) => {
  return {
    ...nextConfig,
    webpack(config, ctx) {
      const findPagesDirResult = findPagesDir(ctx.dir);
      // https://github.com/vercel/next.js/blob/1fb4cad2a8329811b5ccde47217b4a6ae739124e/packages/next/build/index.ts#L336
      // https://github.com/vercel/next.js/blob/1fb4cad2a8329811b5ccde47217b4a6ae739124e/packages/next/build/webpack-config.ts#L626
      // https://github.com/vercel/next.js/pull/43916
      const hasAppDir =
        // on Next.js 12, findPagesDirResult is a string. on Next.js 13, findPagesDirResult is an object
        !!(nextConfig.experimental && nextConfig.experimental.appDir) &&
        !!(findPagesDirResult && findPagesDirResult.appDir);

      const outputCSS = hasAppDir
        ? // When there is appDir, always output css, even on server (React Server Component is also server)
          true
        : // There is no appDir, do not output css on server build
          !ctx.isServer;

      // The style9 compiler must run on source code, which means it must be
      // configured as the last loader in webpack so that it runs before any
      // other transformation.

      if (typeof nextConfig.webpack === 'function') {
        config = nextConfig.webpack(config, ctx);
      }

      // For some reason, Next 11.0.1 has `config.optimization.splitChunks`
      // set to `false` when webpack 5 is enabled.
      config.optimization.splitChunks = config.optimization.splitChunks || {
        cacheGroups: {}
      };

      const MiniCssExtractPlugin = getNextMiniCssExtractPlugin(ctx.dev);

      config.module.rules.push({
        test: /\.(tsx|ts|js|mjs|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: Style9Plugin.loader,
            options: {
              // Here we configure a custom virtual css file name, for later matches
              virtualFileName: '[path][name].[hash:base64:7].style9.css',
              // We will not pass a inline loader, instead we will add a specfic rule for /\.style9.css$/
              inlineLoader: '',
              outputCSS,
              ...pluginOptions
            }
          }
        ]
      });

      // Based on https://github.com/vercel/next.js/blob/88a5f263f11cb55907f0d89a4cd53647ee8e96ac/packages/next/build/webpack/config/helpers.ts#L12-L18
      const cssRules = config.module.rules.find(
        rule =>
          Array.isArray(rule.oneOf) &&
          rule.oneOf.some(
            ({ test }) =>
              typeof test === 'object' &&
              typeof test.test === 'function' &&
              test.test('filename.css')
          )
      ).oneOf;

      // Here we matches virtual css file emitted by Style9Plugin
      cssRules.unshift({
        test: /\.style9.css$/,
        use: getStyle9VirtualCssLoader(ctx, MiniCssExtractPlugin, hasAppDir)
      });

      if (outputCSS) {
        config.optimization.splitChunks.cacheGroups.style9 = {
          name: 'style9',
          // We apply cacheGroups to style9 virtual css only
          test: /\.style9.css$/,
          chunks: 'all',
          enforce: true
        };

        // Style9 need to emit the css file on both server and client, both during the
        // development and production.
        // However, Next.js only add MiniCssExtractPlugin on client + production.
        //
        // To simplify the logic at our side, we will add MiniCssExtractPlugin based on
        // the "instanceof" check (We will only add our required MiniCssExtractPlugin if
        // Next.js hasn't added it yet).
        // This also prevent multiple MiniCssExtractPlugin being added (which will cause
        // RealContentHashPlugin to panic)
        if (
          !config.plugins.some(plugin => plugin instanceof MiniCssExtractPlugin)
        ) {
          // HMR reloads the CSS file when the content changes but does not use
          // the new file name, which means it can't contain a hash.
          const filename = ctx.dev
            ? 'static/css/[name].css'
            : 'static/css/[contenthash].css';

          // Logic adopted from https://git.io/JtdBy
          config.plugins.push(
            new MiniCssExtractPlugin({
              filename,
              chunkFilename: filename
            })
          );
        }

        config.plugins.push(new Style9Plugin());
      }

      return config;
    }
  };
};

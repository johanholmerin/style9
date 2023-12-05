# style9

CSS-in-JS compiler inspired by Meta's [StyleX][stylex], with near-zero runtime, atomic CSS extraction and TypeScript support. Framework agnostic.

> [!NOTE]
> [StyleX][stylex] was open-sourced on 2023-12-5. Consider using that instead

## Basic usage

*For a complete walkthrough of the API, see [Usage guide](docs/Usage-guide.md).*

```javascript
import style9 from 'style9';

const styles = style9.create({
  blue: {
    color: 'blue',
  },
  red: {
    color: 'red'
  }
});

document.body.className = styles('blue', isRed && 'red');
```

For the above input, the compiler will generate the following output:

```javascript
/* JavaScript */
document.body.className = isRed ? 'cRCRUH ' : 'hxxstI ';

/* CSS */
.hxxstI { color: blue }
.cRCRUH { color: red }
```

## Installation

```sh
# Yarn
yarn add style9

# npm
npm install style9
```

## Compiler setup - required

The following is the minimally required Webpack setup for extracting styles to a CSS file. For Webpack options and Rollup, Next.js, Gatsby,Vite, and Babel plugins, see [Bundler plugins](docs/Bundler-plugins.md).

```javascript
const Style9Plugin = require('style9/webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  // Collect all styles in a single file - required
  optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'styles',
          type: 'css/mini-extract',
          // For webpack@4 remove type and uncomment the line below
          // test: /\.css$/,
          chunks: 'all',
          enforce: true,
        }
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.(tsx|ts|js|mjs|jsx)$/,
        use: Style9Plugin.loader,
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      }
    ]
  },
  plugins: [
    new Style9Plugin(),
    new MiniCssExtractPlugin()
  ]
};
```

## Documentation

1. [Background](docs/Background.md)
1. [Usage guide](docs/Usage-guide.md)
1. [Bundler plugins](docs/Bundler-plugins.md)
1. [TypeScript](docs/TypeScript.md)
1. [Ecosystem](docs/Ecosystem.md)
1. [How it works](docs/How-it-works.md)
1. [FAQ](docs/FAQ.md)
1. [Example apps](examples)

## Have a question?

Look at the [FAQ](docs/FAQ.md), [search][search] the repo, or ask in [discussions][discussions].

[stylex]: https://github.com/facebook/stylex
[search]: https://github.com/johanholmerin/style9/search
[discussions]: https://github.com/johanholmerin/style9/discussions

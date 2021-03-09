# style9

CSS-in-JS compiler inspired by Facebook's [stylex][stylex], with near-zero runtime, atomic CSS extraction and TypeScript support. Framework agnostic.

## Basic usage

*For a complete walkthrough of the API, see [Styling](docs/Styling.md).*

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
document.body.className = isRed ? 'cyyg6ey ' : 'c1r9f2e5 ';

/* CSS */
.c1r9f2e5 { color: blue }
.cyyg6ey { color: red }
```

## Installation

```sh
# Yarn
yarn add style9

# npm
npm install style9
```

## Compiler setup - required

The following is the minimally required Webpack setup for extracting styles to a CSS file. For Webpack options and Rollup, Next.js, Gatsby, and Babel plugins, see [Bundler plugins](docs/Bundler-plugins.md).

```javascript
const Style9Plugin = require('style9/webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
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
1. [How it works](docs/How-it-works.md)
1. [Styling](docs/Styling.md)
1. [Bundler plugins](docs/Bundler-plugins.md)
1. [TypeScript](docs/TypeScript.md)
1. [Ecosystem](docs/Ecosystem.md)
1. [FAQ](docs/FAQ.md)
1. [Example apps](examples)

## Have a question?

Look at the [FAQ](docs/FAQ.md), [search][search] the repo, or ask in [discussions][discussions].

[stylex]: https://www.youtube.com/watch?v=9JZHodNR184
[search]: https://github.com/johanholmerin/style9/search
[discussions]: https://github.com/johanholmerin/style9/discussions

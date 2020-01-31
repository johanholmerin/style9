# style9

CSS-in-JS compiler based on the ideas of
[Facebook's stylex](https://www.youtube.com/watch?v=9JZHodNR184)

## Features

* Compiles to atomic CSS
* Typed styles using TypeScript
* Converts font-size to REM[¹](https://betterwebtype.com/articles/2019/06/16/5-keys-to-accessible-web-typography/)
* No selectors

## Install

```sh
yarn add git+https://github.com/johanholmerin/style9#semver:^0.1.0
```

## Usage

```javascript
import style9 from 'style9';

// Styles are created by calling style9.create
const styles = style9.create({
  blue: {
    color: 'blue',
  },
  red: {
    color: 'red'
  }
});

// `styles` is now a function which can be called with the keys of the style
// object, and returns a string of class names.
// Ternary operator and logical AND is supported
document.body.className = styles('blue', isRed && 'red');

// `styles` can also be called with an object of booleans
styles({
  blue: isBlue,
  red: isRed
});

// To combine with external styles, style9 can be called with the style objects
style9(styles.blue, otherStyles.yellow);

// Styles have to be statically defined, but constants are supported
const RED = 'red';

const styles = style9.create({
  red: {
    color: RED
  },
  margin: {
    // All properties are written in camelcase
    // Integers are converted to pixels where appropriate
    marginTop: 8
  },
  padding: {
    // Longhands take precedent over shorthands
    // Will resolve to '12px 12px 12px 18px'
    paddingLeft: 18,
    // Shorthand values will be copied to longhands which means
    // `padding: '12px 18px'` etc. is not supported
    padding: 12
  },
  text: {
    // Font size is converted to REMs to follow users settings
    fontSize: 14
  }
});

```

## Babel

```javascript
const babel = require('@babel/core');
const style9 = require('style9/babel');

const output = babel.transformFile('./file.js', {
  plugins: [style9]
});
// Generated CSS
console.log(output.metadata.style9);
```

## Rollup

```javascript
import style9 from 'style9/rollup';

export default {
  // ...
  plugins: [
    style9({
      // include & exclude are supported according to rollup conventions
      // Optional options
      // fileName: unique name to for output file
      // name: name to use for output.assetFileNames pattern
    })
  ]
};
```

# Styling

## Basic

Styles are defined by calling `style9.create` with objects of style definitions. The return value is then a function which can be called with the names of the created style objects, and returns string of class names.

```javascript
import style9 from 'style9';

const styles = style9.create({
  blue: {
    color: 'blue',
  }
});

document.body.className = styles('blue');
```

## Conditional

Multiple styles can be applied by passing the names to the `styles` function. Style objects will be merged like with `Object.assign`, with styles to the right taking precedence. To conditionally apply styles, use logical AND or ternary operator. Alternatively, an object containing the keys of the style object can be used. Later keys take precedence.

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

document.body.className = styles('blue', 'red');
document.body.className = styles('blue', isRed && 'red');
document.body.className = styles(isRed ? 'red' : 'blue');
document.body.className = styles({
  blue: true,
  red: isRed
});
```

## Composition

To compose styles from multiple declarations, `style9` can be called as a function with the properties of the generated style object. This is not subject to the same restrictions as using the `styles` function, and can be fully dynamic.

```javascript
import style9 from 'style9';

const someStyles = style9.create({
  blue: {
    color: 'blue',
  }
});

const someOtherStyles = style9.create({
  tilt: {
    transform: 'rotate(45deg)'
  }
});

document.body.className = style9(someStyles.blue, someOtherStyles.tilt);
document.body.className = style9(someStyles.blue, someOtherStyles[dynamicKey]);
```

## Pseudo selectors

Both pseudo-classes and pseudo-elements are supported and can be nested.

```javascript
import style9 from 'style9';

const styles = style9.create({
  blue: {
    color: 'blue',
    ':hover': {
      color: 'purple'
    },
    '::before': {
      content: '"some content"'
    }
  }
});

document.body.className = styles('blue');
```

## Media queries

Media queries are supported, and will be sorted mobile-first in the generated CSS. They can be nested and can contain pseudo selectors.

**Note:** TypeScript users, see [Media queries with TypeScript](TypeScript.md#media-queries)

```javascript
import style9 from 'style9';

const styles = style9.create({
  blue: {
    color: 'blue',
    '@media (min-width: 80em)': {
      color: 'purple'
    }
  }
});

document.body.className = styles('blue');
```

## Keyframes

CSS animations are created by calling `style9.keyframes` with the desired keyframe definitions, which returns a string that can be used as `animationName`.

```javascript
import style9 from 'style9';

const styles = style9.create({
  blue: {
    animationName: style9.keyframes({
      from: { color: 'blue' },
      to: { color: 'red' }
    })
  }
});

document.body.className = styles('blue');
```

## Shorthands

To be able to confidently apply class names [shorthand CSS properties][mdn shorthands], like `background`, are not supported. Instead longhand properties, like `background-color` and `background-image` should be used. For some simple shorthands, [inline-style-expand-shorthand][inline-style-expand-shorthand] is used to automatically expand them into their longhand equivalents.

```javascript
import style9 from 'style9';

const styles = style9.create({
  rounded: {
    borderTopLeftRadius: '50%',
    borderTopRightRadius: '50%',
    borderBottomLeftRadius: '50%',
    borderBottomRightRadius: '50%',
  }
});

document.body.className = styles('blue');
```

## FontSize in REM

[For accessibility][accessible-typography], `font-size` should be declared in `REMs`, to allow users to change their base text size. style9 handles this automatically when defining `font-size` as a number.

```javascript
import style9 from 'style9';

const styles = style9.create({
  large: {
    fontSize: 32
  }
});
```

Generated CSS:

```css
.c188tmoq { font-size: 2rem }
```

## Shared styles

It can be useful to define some styles in another file to be able to reuse them. To export a single property, it can be simply accessed from the returned object. If you wish to export all styles as an object you have use spread to show that you won't use the returned function.

```javascript
import style9 from 'style9';

export const { specific } = style9.create({
  // ...
});

export const { ...all } = style9.create({
  // ...
});
```

## Autoprefixing

style9 has no built-in autoprefixing, instead leaving that up to the user. Do it like you normally would, with your bundler of choice, for example with [Webpack][webpack-autoprefixing].

## Theming

Theming is most easily done with CSS Custom Properties. Declaration can be done either in separately or with style9. They can then be applied globally or for a specific part of your site. TypeScript users, see [CSS Custom Properties with TypeScript](TypeScript.md#css-custom-properties).

```javascript
style9.create({
  declaration: {
    '--bg-color': 'blue'
  },
  use: {
    backgroundColor: 'var(--bg-color)'
  }
});
```

[mdn shorthands]: https://developer.mozilla.org/en-US/docs/Web/CSS/Shorthand_properties
[inline-style-expand-shorthand]: https://github.com/robinweser/inline-style-expand-shorthand
[accessible-typography]: https://betterwebtype.com/articles/2019/06/16/5-keys-to-accessible-web-typography/
[webpack-autoprefixing]: https://webpack.js.org/loaders/postcss-loader/#autoprefixer

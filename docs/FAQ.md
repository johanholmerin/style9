# FAQ

## Why can't I use shorthand CSS properties?

See [Tradeoffs - No shorthands](Background.md#no-shorthands)

## Why can't I export the value from `style9.create`?

The value returned from `style9.create` can be used as a function or as an object with properties. However, the generated code is just a plain object: the function call is transformed by the compiler to a ternary expression. To avoid issues when using the value as a function in places where babel can't track the reference, you have to explicitly make it into a plain object using the spread operator:

```javascript
export const { ...styles } = style9.create({
  // ...
});
```

## Errors

### `Could not evaluate value`

Babel failed to evaluate a value used in a style definition. Try moving the value directly to the create call.

#### Unsupported uses

```javascript
import style9 from 'style9';
import importedColor from './color';

const OBJECT = {
  BLUE: 'blue'
};

const styles = style9.create({
  imported: {
    color: importedColor
  },
  object: {
    color: OBJECT.BLUE
  }
});
```

#### Supported use

```javascript
import style9 from 'style9';

const COLOR = 'blue';

const styles = style9.create({
  constant: {
    color: COLOR
  }
});
```

### `Unsupported type`

You're using an operator or value type that isn't supported. See [Usage guide](Usage guide.md) for supported uses.

## Have another question?

Look at the [FAQ](docs/FAQ.md), [search][search] the repo, or ask in [discussions][discussions].

[search]: https://github.com/johanholmerin/style9/search
[discussions]: https://github.com/johanholmerin/style9/discussions

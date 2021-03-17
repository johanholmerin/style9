# Background

style9 was created to be an open-source implementation of the CSS-in-JS library used to develop the new version of Facebook, [stylex][stylex]. For that reason, the design principles are heavily influenced by stylex.

## Principles

### Optimized output

Large JavaScript and CSS files are bad for performance, and embedding CSS in JavaScript is even worse. By only allowing values that can be inferred at compile time, combined with a carefully designed API, the CSS can be extracted to it's own file at compile time. Additionally, any styles that aren't used can be pruned from the output. And because most values are used many times the classes are outputted as atomic CSS, which avoids the issue of ever-growing files.

### No global styles, no cascade, no selectors

No issues with specificity, no searching for definitions. Styles can be co-located with the code and referenced directly.

### Type safety

Full type safety, courtesy of TypeScript. Values, properties and variables can be autocompleted and errors caught, all using toolchains already used.

### Low-level, framework agnostic, small API

style9 deals with defining styles and generating class names, nothing else. This makes the API small and makes style9 easy to learn. It also makes it framework agnostic. It also makes it possible to build solutions on top, see [Ecosystem](Ecosystem.md).

## Tradeoffs

### No dynamic values

There are two types of values that can be considered dynamic: the first is about choosing among pre-defined styles based on a runtime value. These are fully supported, for example:

```typescript
import style9 from 'style9';

const styles = style9.create({
  blue: {
    color: 'blue'
  },
  red: {
    color: 'red'
  }
});

export const getClass(color: keyof typeof styles) => style9(styles[color]);
```

The other is using a value that's only available at the runtime, a common example being setting a user-defined image as a background. These are not available while compiling, and are therefor not supported. However, these values are one-off and limited in use, and does not suffer from being set inline. Or, if reuse is required, they can be set as CSS Custom Properties:

```typescript
import style9 from 'style9';

const styles = style9.create({
  avatar: {
    backgroundColor: 'var(--my-personal-color)'
  }
});

document.body.style = `--my-personal-color: blue;`;
```

### No shorthands

Because the generated CSS uses atomic classes, there is no single class name that can be toggled for each style. Instead, multiple classes are toggled, with the ones that are overridden removed. This means that it must be possible to know which properties set the same styles. Shorthand CSS properties, such as `background`, make this impossible since they set multiple values.

[stylex]: https://engineering.fb.com/2020/05/08/web/facebook-redesign/

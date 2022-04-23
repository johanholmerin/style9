# How it works

None of this is needed to use the library, it's purely for understanding how it works.

## Static value evaluation

To be able to generate a static CSS file, the compiler needs to resolve the values defined in a call to `style9.create`. This is achieved using the `evaluate`-function from [@babel/traverse][babel-traverse]. Each property is then used to create a css class.

## Function call to string concatenation

There are two ways of using the value returned from `style9.create`. The first is using as a function, passing the keys you want to apply. In this case, the compiler tracks all references and replaces them with simple string concatenation. For styles that are applied conditionally, the properties that would be overriden by a particular styles object are figured out and applied using ternary operators. In this case the entire create call can be removed, and the runtime is not needed.

### Input

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

### Output

```javascript
/* JavaScript */
document.body.className = isRed ? 'RCRUH ' : 'hxxstI ';

/* CSS */
.hxxstI { color: blue }
.RCRUH { color: red }
```

## Merging composed styles

For composing styles from different definitions, the properties object is needed to be able to resolve which properties should be applied. In this case the runtime is needed.

### Input

```javascript
import style9 from 'style9';

const styles = style9.create({
  blue: {
    color: 'blue',
  }
});

const otherStyles = style9.create({
  red: {
    color: 'red'
  }
});

document.body.className = style9(styles.blue, otherStyles.red);
```

### Output

```javascript
/* JavaScript */
import style9 from 'style9';

const styles = {
  blue: {
    color: 'hxxstI',
  }
};

const otherStyles = {
  red: {
    color: 'RCRUH'
  }
};
document.body.className = style9(styles.blue, otherStyles.red);

/* CSS */
.hxxstI { color: blue }
.RCRUH { color: red }
```

### CSS post-processing

The application of normal properties are handled by the library and have no specificity. However, when using pseudo classes and at-rules, like media queries, the order of the classes in the style sheet can make a difference. To avoid issues, the generated classes are sorted in a deterministic order.

[babel-traverse]: https://babeljs.io/docs/en/babel-traverse

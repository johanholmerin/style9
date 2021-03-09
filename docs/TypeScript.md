# TypeScript

Style9 has first-class TypeScript support, powered by [csstype](https://github.com/frenic/csstype).

## CSS Custom Properties

Custom properties can be added to the type definition by augmenting the `CustomProperties` interface. This makes them available as properties and as values.

```typescript
declare module 'style9/Style' {
  interface CustomProperties {
    '--bg-color'?: string;
  }
}

style9.create({
  declaration: {
    '--bg-color': 'blue'
  },
  use: {
    backgroundColor: 'var(--bg-color)'
  }
});
```

## Media queries

For TypeScript < 4.3 the following syntax is required for media queries and @supports

```javascript
style9.create({
  mobile: {
    '@media': {
      '(min-width: 800px)': {
        display: 'none'
      }
    },
    '@supports': {
      'not (display: grid)': {
        float: 'right'
      }
    }
  },
});
```

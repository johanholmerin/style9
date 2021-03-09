# Ecosystem

## [style9-components.macro](https://github.com/johanholmerin/style9-components.macro)

styled-components API for React with support for prop-based styling

```javascript
import styled from 'style9-components.macro';

// Create new component
const Component = styled.div({
  color: props => props.color,
  backgroundColor: 'red'
});

// Extend existing component
const WrappedComponent = styled(Component)({
  backgroundColor: 'blue'
});

// Support for overriding the element
<Component as="a" />
```

## [style9-jsx-prop](https://github.com/johanholmerin/style9-jsx-prop)

JSX CSS-prop API with support for prop-based styling

```javascript
<div
  css={{
    color: props.color,
    animationName: {
      from: { opacity: 0 }
    }
  }}
/>
```

## [css-to-js.macro](https://github.com/johanholmerin/css-to-js.macro)

CSS macro for converting tagged template literal to object. Can be combined with any other library

```javascript
import { css, keyframes } from 'css-to-js.macro';

css`
  color: red;
  font-size: ${props.fontSize};
  ${props.isBlue && css`
    color: blue;
  `}
  animation-name: ${keyframes`
    from { opacity: 1; }
  `};
`
```

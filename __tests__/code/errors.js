/* eslint-env jest */
const compile = require('../compile.js');

it('only supports Member- and CallExpression on styles', () => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  default: {
    color: 'blue'
  }
});
foo(styles);
  `;
  expect(() => compile(input)).toThrowErrorMatchingInlineSnapshot(`
    "unknown: SyntaxError: Return value from style9.create has to be called as a function or accessed as an object
      6 |   }
      7 | });
    > 8 | foo(styles);
        |     ^^^^^^
      9 |   "
  `);
});

it('throws on non-existing property import', () => {
  const input = `
import style9 from 'style9';
style9.foo;
  `;
  expect(() => compile(input)).toThrowErrorMatchingInlineSnapshot(`
    "unknown: Unsupported use. Supported uses are: style9(), style9.create(), and style9.keyframes()
      1 |
      2 | import style9 from 'style9';
    > 3 | style9.foo;
        | ^^^^^^
      4 |   "
  `);
});

it('styles throws on non-existing style key', () => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  default: {
    color: 'blue'
  }
});
styles('blue');
  `;
  expect(() => compile(input)).toThrowErrorMatchingInlineSnapshot(`
    "unknown: Property blue does not exist in style object
      6 |   }
      7 | });
    > 8 | styles('blue');
        |        ^^^^^^
      9 |   "
  `);
});

it('styles throws on unsupported operator', () => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  default: {
    color: 'blue'
  }
});
styles(foo & 'blue');
  `;
  expect(() => compile(input)).toThrowErrorMatchingInlineSnapshot(`
    "unknown: Unsupported type BinaryExpression
      6 |   }
      7 | });
    > 8 | styles(foo & 'blue');
        |        ^^^^^^^^^^^^
      9 |   "
  `);
});

it('styles throws on failure to evaluate values', () => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  default: {
    color: BLUE
  }
});
styles('blue');
  `;
  expect(() => compile(input)).toThrowErrorMatchingInlineSnapshot(`
    "unknown: Could not evaluate value
      3 | const styles = style9.create({
      4 |   default: {
    > 5 |     color: BLUE
        |            ^^^^
      6 |   }
      7 | });
      8 | styles('blue');"
  `);
});

it('styles throws on spread', () => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  default: {
    color: 'red'
  }
});
styles({ ...foo })
  `;
  expect(() => compile(input)).toThrowErrorMatchingInlineSnapshot(`
    "unknown: Unsupported type SpreadElement
      6 |   }
      7 | });
    > 8 | styles({ ...foo })
        |          ^^^^^^
      9 |   "
  `);
});

it('styles throws non-string logical right hand', () => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  red: {
    color: 'red'
  }
});
styles(foo && red)
  `;
  expect(() => compile(input)).toThrowErrorMatchingInlineSnapshot(`
    "unknown: Unsupported type Identifier
      6 |   }
      7 | });
    > 8 | styles(foo && red)
        |               ^^^
      9 |   "
  `);
});

it('styles throws non-string ternary left hand', () => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  red: {
    color: 'red'
  }
});
styles(foo ? red : 'red')
  `;
  expect(() => compile(input)).toThrowErrorMatchingInlineSnapshot(`
    "unknown: Unsupported type Identifier
      6 |   }
      7 | });
    > 8 | styles(foo ? red : 'red')
        |              ^^^
      9 |   "
  `);
});

it('styles throws non-string ternary right hand', () => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  red: {
    color: 'red'
  }
});
styles(foo ? 'red' : red)
  `;
  expect(() => compile(input)).toThrowErrorMatchingInlineSnapshot(`
    "unknown: Unsupported type Identifier
      6 |   }
      7 | });
    > 8 | styles(foo ? 'red' : red)
        |                      ^^^
      9 |   "
  `);
});

it('styles throws on identifier', () => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  default: {
    color: 'red'
  }
});
styles(foo)
  `;
  expect(() => compile(input)).toThrowErrorMatchingInlineSnapshot(`
    "unknown: Unsupported type Identifier
      6 |   }
      7 | });
    > 8 | styles(foo)
        |        ^^^
      9 |   "
  `);
});

it('styles throws on dynamic key', () => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  red: {
    color: 'red'
  }
});
styles({ [red]: foo })
  `;
  expect(() => compile(input)).toThrowErrorMatchingInlineSnapshot(`
    "unknown: Unsupported type ObjectProperty
      6 |   }
      7 | });
    > 8 | styles({ [red]: foo })
        |          ^^^^^^^^^^
      9 |   "
  `);
});

/* eslint-env jest */
const compile = require('../compile.js');

it('throws on invalid nesting', () => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  default: {
    foo: {
      opacity: 1
    }
  }
});
  `;
  expect(() => compile(input)).toThrowErrorMatchingInlineSnapshot(`
    "unknown: Invalid key foo. Object keys must be at-rules or pseudo selectors
      3 | const styles = style9.create({
      4 |   default: {
    > 5 |     foo: {
        |     ^^^
      6 |       opacity: 1
      7 |     }
      8 |   }"
  `);
});

it('throws on invalid nesting with dynamic key', () => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  default: {
    [foo]: {
      opacity: 1
    }
  }
});
  `;
  expect(() => compile(input)).toThrowErrorMatchingInlineSnapshot(`
    "unknown: Could not evaluate value
      3 | const styles = style9.create({
      4 |   default: {
    > 5 |     [foo]: {
        |      ^^^
      6 |       opacity: 1
      7 |     }
      8 |   }"
  `);
});

it('throws on spread object', () => {
  const input = `
import style9 from 'style9';
const foo = {};
const styles = style9.create({
  ...foo
});
  `;
  expect(() => compile(input)).toThrowErrorMatchingInlineSnapshot(`
    "unknown: Could not evaluate value
      3 | const foo = {};
      4 | const styles = style9.create({
    > 5 |   ...foo
        |   ^^^^^^
      6 | });
      7 |   "
  `);
});

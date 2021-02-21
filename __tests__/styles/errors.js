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
  expect(() => compile(input)).toThrow();
});

it('throws on non-existing property', () => {
  const input = `
import style9 from 'style9';
style9.foo;
  `;
  expect(() => compile(input)).toThrow();
});

it('throws on non-existing style key', () => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  default: {
    color: 'blue'
  }
});
styles('blue');
  `;
  expect(() => compile(input)).toThrow();
});

it('throws on unsupported operator', () => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  default: {
    color: 'blue'
  }
});
styles(foo & 'blue');
  `;
  expect(() => compile(input)).toThrow();
});

it('throws on failure to evaluate values', () => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  default: {
    color: BLUE
  }
});
styles('blue');
  `;
  expect(() => compile(input)).toThrow();
});

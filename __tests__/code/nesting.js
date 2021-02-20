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
  expect(() => compile(input)).toThrow();
});

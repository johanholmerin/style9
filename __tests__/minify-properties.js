/* eslint-env jest */
const compile = require('./compile.js');

it('does not minify by default', () => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  default: {
    opacity: 1
  }
});
  `;
  const { code } = compile(input);

  expect(code).toMatchSnapshot();
});

it('does not minify styles', () => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  default: {
    opacity: 1
  }
});
  `;
  const { styles } = compile(input);

  expect(styles).toMatchSnapshot();
});

it('minifies known properties', () => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  default: {
    opacity: 1
  }
});
  `;
  const { code } = compile(input, { minifyProperties: true });

  expect(code).toMatchSnapshot();
});

it('hashes unknown properties', () => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  default: {
    foo: 'bar'
  }
});
  `;
  const { code } = compile(input, { minifyProperties: true });

  expect(code).toMatchSnapshot();
});

it('minifies nested properties', () => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  default: {
    '@media (max-width: 1000px)': {
      '::before': {
        opacity: 1
      }
    }
  }
});
  `;
  const { code } = compile(input, { minifyProperties: true });

  expect(code).toMatchSnapshot();
});

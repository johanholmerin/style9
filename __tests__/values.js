/* eslint-env jest */
const compile = require('./compile.js');

it('compiles', () => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  default: {
    color: 'blue'
  }
});
styles('default');
  `;
  const { code } = compile(input);
  expect(code).not.toBe(input);
});

it('converts to pixels', () => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  default: {
    paddingLeft: 2
  }
});
styles('default');
  `;
  const { styles } = compile(input);

  expect(styles).toMatchSnapshot();
});

it('does not converts to pixels', () => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  default: {
    opacity: 1
  }
});
styles('default');
  `;
  const { styles } = compile(input);

  expect(styles).toMatchSnapshot();
});

it('expands shorthand', () => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  default: {
    padding: '1rem'
  }
});
styles('default');
  `;
  const { code, styles } = compile(input);

  expect(code).toMatchSnapshot();
  expect(styles).toMatchSnapshot();
});

it('does not override longhand', () => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  default: {
    padding: '1rem',
    paddingLeft: '2rem'
  }
});
styles('default');
  `;
  const { code, styles } = compile(input);

  expect(code).toMatchSnapshot();
  expect(styles).toMatchSnapshot();
});

it('converts fontSize pixels', () => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  default: {
    fontSize: 14
  }
});
styles('default');
  `;
  const { styles } = compile(input);

  expect(styles).toMatchSnapshot();
});

it('accepts an array', () => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  default: {
    textDecorationLine: ['underline', 'overline']
  }
});
styles('default');
  `;
  const { styles } = compile(input);

  expect(styles).toMatchSnapshot();
});

it('supports constants', () => {
  const input = `
import style9 from 'style9';
const BLUE = 'blue';
const styles = style9.create({
  default: {
    color: BLUE
  }
});
styles('default');
  `;
  const { styles } = compile(input);

  expect(styles).toMatchSnapshot();
});

it('removes unused styles', () => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  default: {
    color: 'blue'
  }
});
  `;
  const { code, styles } = compile(input);

  expect(code).toMatchSnapshot();
  expect(styles).toMatchSnapshot();
});

it('supports static bracket access', () => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  default: {
    color: 'blue'
  },
  red: {
    color: 'red'
  }
});
styles['default']
  `;
  const { code, styles } = compile(input);

  expect(code).toMatchSnapshot();
  expect(styles).toMatchSnapshot();
});

it('supports dynamic bracket access', () => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  blue: {
    color: 'blue'
  },
  red: {
    color: 'red'
  }
});
styles[blue]
  `;
  const { code, styles } = compile(input);

  expect(code).toMatchSnapshot();
  expect(styles).toMatchSnapshot();
});

it('supports arrow function', () => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  default: {
    color: 'blue'
  }
});
const get = state => styles(state && 'default');
  `;
  const { code, styles } = compile(input);

  expect(code).toMatchSnapshot();
  expect(styles).toMatchSnapshot();
});

it('does not work without declaration', () => {
  const input = `
import style9 from 'style9';
style9.create({
  default: {
    color: 'blue'
  }
});
  `;
  expect(() => compile(input)).toThrow();
});

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

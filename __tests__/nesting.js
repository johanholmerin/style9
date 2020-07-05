/* eslint-env jest */
const compile = require('./compile.js');

it('supports nesting', () => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  default: {
    '::before': {
      opacity: 1
    }
  }
});
styles('default');
  `;
  const { code, styles } = compile(input);

  expect(code).toMatchSnapshot();
  expect(styles).toMatchSnapshot();
});

it('supports at rules', () => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  default: {
    '@media (max-width: 1000px)': {
      opacity: 1
    }
  }
});
styles('default');
  `;
  const { code, styles } = compile(input);

  expect(code).toMatchSnapshot();
  expect(styles).toMatchSnapshot();
});

it('supports deep nesting', () => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  default: {
    '@media (max-width: 1000px)': {
      ':hover': {
        '::before': {
          opacity: 1
        }
      }
    }
  }
});
styles('default');
  `;
  const { code, styles } = compile(input);

  expect(code).toMatchSnapshot();
  expect(styles).toMatchSnapshot();
});

it('generates correct class names', () => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  default: {
    '::before': {
      opacity: 1
    }
  },
  hidden: {
    '::before': {
      opacity: 0
    }
  }
});
styles('default', 'hidden');
  `;
  const { code, styles } = compile(input);

  expect(code).toMatchSnapshot();
  expect(styles).toMatchSnapshot();
});

it('translates old pseudo element', () => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  default: {
    ':before': { opacity: 1 },
    ':after': { opacity: 1 },
    ':first-letter': { opacity: 1 },
    ':first-line': { opacity: 1 }
  }
});
styles.default
  `;
  const { code, styles } = compile(input);

  expect(code).toMatchSnapshot();
  expect(styles).toMatchSnapshot();
});

it('throws in invalid nesting', () => {
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

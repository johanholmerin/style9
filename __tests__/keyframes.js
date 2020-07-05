/* eslint-env jest */
const compile = require('./compile.js');

it('supports keyframes', () => {
  const input = `
import style9 from 'style9';
style9.keyframes({
  '0%': {
    color: 'blue'
  },
  '100%': {
  }
});
  `;
  const { code, styles } = compile(input);

  expect(code).toMatchSnapshot();
  expect(styles).toMatchSnapshot();
});

it('converts from', () => {
  const input = `
import style9 from 'style9';
style9.keyframes({
  from: {
    color: 'blue'
  }
});
  `;
  const { code, styles } = compile(input);

  expect(code).toMatchSnapshot();
  expect(styles).toMatchSnapshot();
});

it('converts to', () => {
  const input = `
import style9 from 'style9';
style9.keyframes({
  to: {
    color: 'blue'
  }
});
  `;
  const { code, styles } = compile(input);

  expect(code).toMatchSnapshot();
  expect(styles).toMatchSnapshot();
});

it('supports settings animationName directly', () => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  default: {
    animationName: style9.keyframes({
      '0%': {
        opacity: 0
      }
    })
  }
});
styles.default
  `;
  const { code, styles } = compile(input);

  expect(code).toMatchSnapshot();
  expect(styles).toMatchSnapshot();
});

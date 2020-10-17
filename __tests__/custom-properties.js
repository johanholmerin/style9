/* eslint-env jest */
const compile = require('./compile.js');

it('does not convert number', () => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  default: {
    '--opacity': 1
  }
});
styles('default');
  `;
  const { styles, code } = compile(input);

  expect(styles).toMatchSnapshot();
  expect(code).toMatchSnapshot();
});

it('does not change capitalization', () => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  default: {
    '--backgroundColor': 'red'
  }
});
styles('default');
  `;
  const { styles, code } = compile(input);

  expect(styles).toMatchSnapshot();
  expect(code).toMatchSnapshot();
});

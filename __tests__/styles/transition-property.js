/* eslint-env jest */
const compile = require('../compile.js');

it('converts transitionProperty to kebab-case', () => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  default: {
    transitionProperty: 'backgroundColor',
  }
});
styles('default');
  `;
  const { styles } = compile(input);

  expect(styles).toBe('.diErbW{transition-property:background-color}');
});

it('converts transitionProperty list to kebab-case', () => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  default: {
    transitionProperty: ['backgroundColor', 'borderColor', 'boxShadow'],
  }
});
styles('default');
  `;
  const { styles } = compile(input);

  expect(styles).toBe(
    '.gKERdg{transition-property:background-color,border-color,box-shadow}'
  );
});

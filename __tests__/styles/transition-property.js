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

  expect(styles).toBe('.c7mpi08{transition-property:background-color}');
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
    '.c1d809k5{transition-property:background-color,border-color,box-shadow}'
  );
});

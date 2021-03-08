/* eslint-env jest */
const compile = require('../compile.js');

it('handles multiple transition properties correctly', () => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  default: {
    transitionProperty: ["backgroundColor", "borderColor", "boxShadow"],
    strokeDasharray: [10, 100, 200]
  }
});
styles('default');
  `;
  const { styles } = compile(input);

  expect(styles).toBe(
    '.c1d809k5{transition-property:background-color,border-color,box-shadow}.cjcw4qf{stroke-dasharray:10 100 200}'
  );
});

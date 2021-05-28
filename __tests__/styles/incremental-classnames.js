/* eslint-env jest */
const compile = require('../compile.js');

it('uses incremental classname for styles', () => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  default: {
    paddingLeft: 2,
    paddingTop: 1
  },
  other: {
    paddingRight: 3
  }
});
styles('default', 'other');
  `;
  const { styles } = compile(input, {
    incrementalClassnames: true
  });

  expect(styles).toBe(
    '.a{padding-left:2px}.b{padding-top:1px}.c{padding-right:3px}'
  );
});

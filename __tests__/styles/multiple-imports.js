/* eslint-env jest */
const compile = require('../compile.js');

it('supports multiple imports', () => {
  const input = `
import style0 from 'style9';
import style1 from 'style9';
const styles0 = style0.create({
  first: {
    color: 'blue'
  }
});
styles0('first');
const styles1 = style1.create({
  second: {
    color: 'red'
  }
});
styles1('second');
  `;
  const { styles } = compile(input);

  expect(styles).toBe(`.c1r9f2e5{color:blue}.cyyg6ey{color:red}`);
});

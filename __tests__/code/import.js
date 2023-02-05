/* eslint-env jest */
const compile = require('../compile.js');

it('ignores other imports', () => {
  const input = `import style9 from 'other';`;
  const { code } = compile(input);
  expect(code).toBe(input);
});

it("support require('style9')", () => {
  const input = `
const style9 = require('style9');
const styles = style9.create({
  default: {
    paddingLeft: 2
  }
});
styles('default');
  `;
  const { styles, code } = compile(input);

  expect(styles).toBe(`.hhTkCv{padding-left:2px}`);
  expect(code).toMatchInlineSnapshot(`
    "const style9 = require('style9');

    const styles = {};
    \\"hhTkCv \\";"
  `);
});

/* eslint-env jest */
const compile = require('../compile.js');

it('ignores other imports', () => {
  const input = `import style9 from 'other';`;
  const { code } = compile(input);
  expect(code).toBe(input);
});

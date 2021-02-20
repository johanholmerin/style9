/* eslint-env jest */
const processCSS = require('../src/process-css.js');

const CASES = [
  {
    name: 'basic',
    input: '.a:hover{opacity:1}' + '.b{opacity:1}',
    expected: '.b{opacity:1}' + '.a:hover{opacity:1}',
  },
  {
    name: 'pseudo order',
    input:
      '.i:active{opacity:1}' +
      '.k:disabled{opacity:1}' +
      '.f:even-child{opacity:1}' +
      '.c:first-child{opacity:1}' +
      '.b:focus-within{opacity:1}' +
      '.h:focus{opacity:1}' +
      '.g:hover{opacity:1}' +
      '.d:last-child{opacity:1}' +
      '.a:link{opacity:1}' +
      '.e:odd-child{opacity:1}' +
      '.j:visited{opacity:1}',
    expected:
      '.a:link{opacity:1}' +
      '.b:focus-within{opacity:1}' +
      '.c:first-child{opacity:1}' +
      '.d:last-child{opacity:1}' +
      '.e:odd-child{opacity:1}' +
      '.f:even-child{opacity:1}' +
      '.g:hover{opacity:1}' +
      '.h:focus{opacity:1}' +
      '.i:active{opacity:1}' +
      '.j:visited{opacity:1}' +
      '.k:disabled{opacity:1}',
  },
  {
    name: 'first pseudo',
    input: '.b:active:hover{opacity:1}' + '.a:hover{opacity:1}',
    expected: '.a:hover{opacity:1}' + '.b:active:hover{opacity:1}',
  },
  {
    name: 'mobile first',
    input:
      '@media (min-width: 200px){.b{opacity:1}}' +
      '@media (min-width: 100px){.a{opacity:1}}' +
      '.c{opacity:1}',
    expected:
      '.c{opacity:1}' +
      '@media (min-width: 100px){.a{opacity:1}}' +
      '@media (min-width: 200px){.b{opacity:1}}',
  },
  {
    name: 'pseudo order before media query',
    input:
      '@media (max-width: 200px){.b:active{opacity:1}}' +
      '@media (max-width: 100px){.a:hover{opacity:1}}',
    expected:
      '@media (max-width: 100px){.a:hover{opacity:1}}' +
      '@media (max-width: 200px){.b:active{opacity:1}}',
  },
  {
    name: 'nested media query',
    input:
      '@media (max-width: 100px){@media (min-height: 100px){.a{opacity:1}}}' +
      '@media (max-width: 200px){@media (min-height: 200px){.b{opacity:1}}}',
    expected:
      '@media (max-width: 200px){@media (min-height: 200px){.b{opacity:1}}}' +
      '@media (max-width: 100px){@media (min-height: 100px){.a{opacity:1}}}',
  },
  {
    name: 'ignore @supports',
    input: '@supports (display: block){.b{opacity:1}}' + '.a{opacity:1}',
    expected: '@supports (display: block){.b{opacity:1}}' + '.a{opacity:1}',
  },
];

for (const { name, input, expected } of CASES) {
  it(name, () => {
    expect(processCSS(input).css).toEqual(expected);
  });
}

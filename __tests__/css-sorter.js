/* eslint-env jest */
const processCSS = require('../src/process-css.js');

const CASES = [
  {
    name: 'basic',
    input: '.a:hover{opacity:1}' + '.b{opacity:1}',
    expected: '.b{opacity:1}' + '.a:hover{opacity:1}'
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
      '.k:disabled{opacity:1}'
  },
  {
    name: 'first pseudo',
    input: '.b:active:hover{opacity:1}' + '.a:hover{opacity:1}',
    expected: '.a:hover{opacity:1}' + '.b:active:hover{opacity:1}'
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
      '@media (min-width: 200px){.b{opacity:1}}'
  },
  {
    name: 'pseudo order before media query',
    input:
      '@media (max-width: 200px){.b:active{opacity:1}}' +
      '@media (max-width: 100px){.a:hover{opacity:1}}',
    expected:
      '@media (max-width: 100px){.a:hover{opacity:1}}' +
      '@media (max-width: 200px){.b:active{opacity:1}}'
  },
  {
    name: 'nested media query',
    input:
      '@media (max-width: 100px){@media (min-height: 100px){.a{opacity:1}}}' +
      '@media (max-width: 200px){@media (min-height: 200px){.b{opacity:1}}}',
    expected:
      '@media (max-width: 200px){@media (min-height: 200px){.b{opacity:1}}}' +
      '@media (max-width: 100px){@media (min-height: 100px){.a{opacity:1}}}'
  },
  {
    name: 'ignore @supports',
    input: '@supports (display: block){.b{opacity:1}}' + '.a{opacity:1}',
    expected: '@supports (display: block){.b{opacity:1}}' + '.a{opacity:1}'
  },
  {
    name: 'splits multiple properties',
    input: '.a{color:red;opacity:1}',
    expected: '.a{color:red}' + '.a{opacity:1}'
  },
  {
    name: 'preseveres same pseudo order',
    input: '.a:hover{opacity:1}' + '.b:hover{opacity:0}',
    expected: '.a:hover{opacity:1}' + '.b:hover{opacity:0}'
  },
  {
    name: 'sorts longhands after shorthands',
    input:
      '.a{padding-top:2px}' +
      '.b{padding:1px}' +
      '.c{border-top-width:2px}' +
      '.d{border-top:1px}' +
      '.e{border:2px solid red}',
    expected:
      '.b{padding:1px}' +
      '.e{border:2px solid red}' +
      '.a{padding-top:2px}' +
      '.d{border-top:1px}' +
      '.c{border-top-width:2px}'
  },
  {
    name: 'ignore atrule',
    input: '@-ms-viewport {width:device-width}' + '.a{opacity:1}',
    expected: '@-ms-viewport {width:device-width}' + '.a{opacity:1}'
  },
];

const IGNORE = [
  {
    name: 'selector list',
    input: '.foo, .bar{color:red}'
  },
  {
    name: 'non-class selectors',
    input: '[disabled]{color:red}'
  },
  {
    name: 'multiple selectors',
    input: '.foo.bar{color:red}'
  }
];

for (const { name, input, expected } of CASES) {
  it(name, () => {
    expect(processCSS(input).css).toEqual(expected);
  });
}

for (const { name, input } of IGNORE) {
  it(name, () => {
    expect(processCSS(input).css).toEqual(input);
  });
}

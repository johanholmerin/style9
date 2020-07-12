/* eslint-env jest */
const compile = require('./compile.js');

it('string literals', () => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  default: {
    color: 'blue',
    opacity: 1
  },
  red: {
    color: 'red'
  }
});
styles('default', 'red');
  `;
  const { code } = compile(input);
  expect(code).toMatchSnapshot();
});

it('moves test', () => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  default: {
    color: 'blue'
  }
});
styles(foo() && 'default');
  `;
  const { code } = compile(input);
  expect(code).toMatchSnapshot();
});

it('ternary', () => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  default: {
    color: 'blue',
    opacity: 1
  },
  red: {
    color: 'red'
  }
});
styles(foo ? 'default' : 'red');
  `;
  const { code } = compile(input);
  expect(code).toMatchSnapshot();
});

it('object', () => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  default: {
    color: 'blue',
    opacity: 1
  },
  red: {
    color: 'red'
  }
});
styles({
  default: foo,
  red: bar
});
  `;
  const { code } = compile(input);
  expect(code).toMatchSnapshot();
});

it('mixed', () => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  default: {
    color: 'blue',
    opacity: 1
  },
  red: {
    color: 'red'
  }
});
styles({
  default: foo
}, 'red');
  `;
  const { code } = compile(input);
  expect(code).toMatchSnapshot();
});

it('property access', () => {
  const input = `
import style9 from 'style9';
const styles1 = style9.create({
  default: {
    color: 'blue'
  }
});
const styles2 = style9.create({
  red: {
    color: 'red'
  }
});
style9(styles1.default, styles2.red)
  `;
  const { code } = compile(input);
  expect(code).toMatchSnapshot();
});

it('hoists function call', () => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  default: {
    color: 'blue'
  }
});
styles({
  default: foo()
})
  `;
  const { code } = compile(input);
  expect(code).toMatchSnapshot();
});

it('supports destructuring assignment', () => {
  const input = `
import style9 from 'style9';
const { blue } = style9.create({
  blue: {
    color: 'blue'
  }
});
console.log(blue)
  `;
  const { code } = compile(input);
  expect(code).toMatchSnapshot();
});

it('supports member expression access', () => {
  const input = `
import style9 from 'style9';
const blue = style9.create({
  blue: {
    color: 'blue'
  },
  red: {
    color: 'red'
  }
}).blue;
console.log(blue)
  `;
  const { code, styles } = compile(input);

  expect(code).toMatchSnapshot();
  expect(styles).toMatchSnapshot();
});

it('supports static bracket access', () => {
  const input = `
import style9 from 'style9';
const blue = style9.create({
  blue: {
    color: 'blue'
  },
  red: {
    color: 'red'
  }
})['blue'];
  `;
  const { code, styles } = compile(input);

  expect(code).toMatchSnapshot();
  expect(styles).toMatchSnapshot();
});

it('supports dynamic bracket access', () => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  blue: {
    color: 'blue'
  },
  red: {
    color: 'red'
  }
})[blue];
  `;
  const { code, styles } = compile(input);

  expect(code).toMatchSnapshot();
  expect(styles).toMatchSnapshot();
});

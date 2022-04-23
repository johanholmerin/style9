/* eslint-env jest */
const compile = require('../compile.js');

it('converts paddingLeft to pixels', () => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  default: {
    paddingLeft: 2
  }
});
styles('default');
  `;
  const { styles } = compile(input);

  expect(styles).toBe(`.hhTkCv{padding-left:2px}`);
});

it('does not convert opacity to pixels', () => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  default: {
    opacity: 1
  }
});
styles('default');
  `;
  const { styles } = compile(input);

  expect(styles).toBe(`.gOeSjL{opacity:1}`);
});

it('expands shorthand', () => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  default: {
    padding: '1rem'
  }
});
styles('default');
  `;
  const { styles } = compile(input);

  expect(styles).toBe(
    '.jWWtke{padding-top:1rem}' +
      '.ftIldC{padding-right:1rem}' +
      '.bnHxUw{padding-bottom:1rem}' +
      '.iDuqPI{padding-left:1rem}'
  );
});

it('does not override longhand', () => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  default: {
    paddingTop: '.5rem',
    padding: '1rem',
    paddingLeft: '2rem'
  }
});
styles('default');
  `;
  const { styles } = compile(input);

  expect(styles).toBe(
    '.lcGuBB{padding-top:.5rem}' +
      '.ftIldC{padding-right:1rem}' +
      '.bnHxUw{padding-bottom:1rem}' +
      '.iigETV{padding-left:2rem}'
  );
});

it('converts fontSize pixels', () => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  default: {
    fontSize: 14
  }
});
styles('default');
  `;
  const { styles } = compile(input);

  expect(styles).toBe(`.kKRHCo{font-size:0.875rem}`);
});

it('accepts an array', () => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  default: {
    textDecorationLine: ['underline', 'overline']
  }
});
styles('default');
  `;
  const { styles } = compile(input);

  expect(styles).toBe(`.jMUvdQ{text-decoration-line:underline overline}`);
});

it('supports constants', () => {
  const input = `
import style9 from 'style9';
const BLUE = 'blue';
const styles = style9.create({
  default: {
    color: BLUE
  }
});
styles('default');
  `;
  const { styles } = compile(input);

  expect(styles).toBe(`.hxxstI{color:blue}`);
});

it('removes unused styles', () => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  default: {
    color: 'blue'
  }
});
  `;
  const { styles } = compile(input);

  expect(styles).toBe(``);
});

it('keeps styles used in styles()', () => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  default: {
    color: 'blue'
  },
  red: {
    color: 'red'
  }
});
styles('default');
  `;
  const { styles } = compile(input);

  expect(styles).toBe(`.hxxstI{color:blue}`);
});

it('keeps styles used as object', () => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  default: {
    color: 'blue'
  },
  red: {
    color: 'red'
  }
});
styles.default;
  `;
  const { styles } = compile(input);

  expect(styles).toBe(`.hxxstI{color:blue}`);
});

it('supports static bracket access', () => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  default: {
    color: 'blue'
  },
  red: {
    color: 'red'
  }
});
styles['default']
  `;
  const { styles } = compile(input);

  expect(styles).toBe(`.hxxstI{color:blue}`);
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
});
styles[blue]
  `;
  const { styles } = compile(input);

  expect(styles).toBe(`.hxxstI{color:blue}.RCRUH{color:red}`);
});

it('supports arrow function', () => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  default: {
    color: 'blue'
  }
});
const get = state => styles(state && 'default');
  `;
  const { styles } = compile(input);

  expect(styles).toBe(`.hxxstI{color:blue}`);
});

it('outputs no styles without declaration', () => {
  const input = `
import style9 from 'style9';
style9.create({
  default: {
    color: 'blue'
  }
});
  `;
  const { styles } = compile(input);

  expect(styles).toBe('');
});

it('supports spread assignment', () => {
  const input = `
import style9 from 'style9';
const { ...styles } = style9.create({
  blue: {
    color: 'blue'
  }
});
  `;
  const { styles } = compile(input);

  expect(styles).toBe(`.hxxstI{color:blue}`);
});

it('removes unused destructured keys', () => {
  const input = `
import style9 from 'style9';
const { blue } = style9.create({
  blue: {
    color: 'blue'
  },
  red: {
    color: 'red'
  }
});
  `;
  const { styles } = compile(input);
  expect(styles).toBe('.hxxstI{color:blue}');
});

it('supports spread use', () => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  blue: {
    color: 'blue'
  }
});
console.log({ ...styles });
  `;
  const { styles } = compile(input);

  expect(styles).toBe(`.hxxstI{color:blue}`);
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
  const { styles } = compile(input);

  expect(styles).toBe(`.hxxstI{color:blue}`);
});

it('does not output CSS when style9() is called', () => {
  const input = `
import style9 from 'style9';
style9();
  `;
  const { styles } = compile(input);

  expect(styles).toBe('');
});

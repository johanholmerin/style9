/* eslint-env jest */
const compile = require('../compile.js');

describe("support require('style9')", () => {
  it('#1', () => {
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

  it('#2', () => {
    const input = `
let style9 = require('style9');
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
          "let style9 = require('style9');

          const styles = {};
          \\"hhTkCv \\";"
      `);
  });

  it('#2', () => {
    const input = `
var style9 = require('style9');
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
          "var style9 = require('style9');

          const styles = {};
          \\"hhTkCv \\";"
      `);
  });

  it('should ignore invalid require #1', () => {
    const input = `
const style9 = foo.require('style9');
const style8 = require(style9);
const styles = style9.create({
  default: {
    paddingLeft: 2
  }
});
styles('default');`;
    const { code } = compile(input);
    expect(code).toMatchInlineSnapshot(`
      "const style9 = foo.require('style9');

      const style8 = require(style9);

      const styles = style9.create({
        default: {
          paddingLeft: 2
        }
      });
      styles('default');"
    `);
  });

  it('should ignore invalid require #2', () => {
    const input = `
const style9 = foo.require('style9');
const style8 = foo(require('style9'));
const style7 = require(style9);
const style6 = require(style9)();
const stylesA = style9.create({
  default: {
    paddingLeft: 2
  }
});
const stylesB = style8.create({
  default: {
    paddingLeft: 2
  }
});
const stylesC = style7.create({
  default: {
    paddingLeft: 2
  }
});
const stylesD = style6.create({
  default: {
    paddingLeft: 2
  }
});
stylesA('default');
stylesB('default');
stylesC('default');
stylesD('default');`;
    const { code } = compile(input);
    expect(code).toMatchInlineSnapshot(`
      "const style9 = foo.require('style9');

      const style8 = foo(require('style9'));

      const style7 = require(style9);

      const style6 = require(style9)();

      const stylesA = style9.create({
        default: {
          paddingLeft: 2
        }
      });
      const stylesB = style8.create({
        default: {
          paddingLeft: 2
        }
      });
      const stylesC = style7.create({
        default: {
          paddingLeft: 2
        }
      });
      const stylesD = style6.create({
        default: {
          paddingLeft: 2
        }
      });
      stylesA('default');
      stylesB('default');
      stylesC('default');
      stylesD('default');"
    `);
  });
});

/* eslint-env jest */
const compile = require('../compile.js');

it('supports nesting', () => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  default: {
    '::before': {
      opacity: 1
    }
  }
});
styles('default');
  `;
  const { styles } = compile(input);

  expect(styles).toBe('.dLppjJ::before{opacity:1}');
});

it('supports at rules', () => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  default: {
    '@media (max-width: 1000px)': {
      opacity: 1
    },
    '@supports (color: blue)': {
      opacity: 'blue'
    }
  }
});
styles('default');
  `;
  const { styles } = compile(input);

  expect(styles).toBe(
    '@media (max-width: 1000px){.Bbwnu{opacity:1}}' +
      '@supports (color: blue){.ilahpL{opacity:blue}}'
  );
});

it('supports deep nesting', () => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  default: {
    '@media (max-width: 1000px)': {
      '@media (max-width: 200px)': {
        ':hover': {
          '::before': {
            opacity: 1
          }
        }
      }
    }
  }
});
styles('default');
  `;
  const { styles } = compile(input);

  expect(styles).toBe(
    '@media (max-width: 1000px){@media (max-width: 200px){.ClOOj:hover::before{opacity:1}}}'
  );
});

it('generates correct class names', () => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  default: {
    '::before': {
      opacity: 1
    }
  },
  hidden: {
    '::before': {
      opacity: 0
    }
  }
});
styles('default', 'hidden');
  `;
  const { styles } = compile(input);

  expect(styles).toBe('.dLppjJ::before{opacity:1}.diXuqL::before{opacity:0}');
});

it('translates old pseudo element', () => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  default: {
    ':before': { opacity: 1 },
    ':after': { opacity: 1 },
    ':first-letter': { opacity: 1 },
    ':first-line': { opacity: 1 }
  }
});
styles.default
  `;
  const { styles } = compile(input);

  expect(styles).toBe(
    '.dLppjJ::before{opacity:1}' +
      '.kMNmYO::after{opacity:1}' +
      '.ezsObI::first-letter{opacity:1}' +
      '.iaGYxt::first-line{opacity:1}'
  );
});

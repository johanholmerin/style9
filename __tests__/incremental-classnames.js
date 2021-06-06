/* eslint-env jest */
const createGenerator = require('../src/utils/incremental-classnames');

it('generates unique classnames', () => {
  const { getIncrementalClass } = createGenerator();
  const input = new Array(5000).fill().map((_, index) => String(index));
  const output = input.map(getIncrementalClass);
  const duplicates = output.filter((cls, i) => output.indexOf(cls) !== i);
  expect(duplicates).toEqual([]);
  expect(output.join('')).toEqual(expect.not.stringContaining('undefined'));
  const startsWithNumber = output.filter(cls => /^[0-9]/.test(cls));
  expect(startsWithNumber).toEqual([]);
  expect(output).toMatchSnapshot();
  const ALL_CHARS = (
    'abcdefghijklmnopqrstuvwxyz' +
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
    '0123456789'
  ).split('');
  const notIncluded = ALL_CHARS.filter(c => !output.join('').includes(c));
  expect(notIncluded).toEqual([]);
});

/* eslint-env jest */
const compile = require('../compile.js');

it('handles properties wich can be defined as lists correctly', () => {
  const input = `
import style9 from 'style9';
const styles = style9.create({
  default: {
    transitionProperty: ['opacity', 'transform'],
    transitionDuration: ['200ms', '300ms', '400ms'],
    transitionDelay: ['100ms', '200ms', '300ms'],
    transitionTimingFunction: ['ease-in', 'ease-out', 'ease-in-out'],
    strokeDasharray: [10, 100, 200],
    scrollSnapType: ['none', 'mandatory'],
    scrollSnapAlign: ['start', 'end']
  }
});
styles('default');
  `;
  const { styles } = compile(input);

  expect(styles).toBe(
    '.ivPgPH{transition-property:opacity,transform}' +
      '.cfCwqg{transition-duration:200ms,300ms,400ms}' +
      '.dEsdmn{transition-delay:100ms,200ms,300ms}' +
      '.genghA{transition-timing-function:ease-in,ease-out,ease-in-out}' +
      '.kViNob{stroke-dasharray:10 100 200}' +
      '.cwFPDc{scroll-snap-type:none mandatory}' +
      '.hboCrl{scroll-snap-align:start end}'
  );
});

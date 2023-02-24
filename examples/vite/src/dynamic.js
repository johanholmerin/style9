/* eslint-env browser */
import style9 from 'style9';

const styles = style9.create({
  size: {
    fontSize: '20px'
  },
  color: {
    color: 'blue'
  }
});

document
  .querySelectorAll('p')
  .forEach(node => (node.className = styles('color', 'size')));

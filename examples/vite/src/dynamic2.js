/* eslint-env browser */
import style9 from 'style9';

const styles = style9.create({
  size: {
    fontSize: '30px'
  },
  color: {
    color: 'red'
  }
});

document
  .querySelectorAll('p')
  .forEach(node => (node.className = styles('color', 'size')));

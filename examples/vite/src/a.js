/* eslint-env browser */
import style9 from 'style9';

const styles = style9.create({
  blue: {
    ':hover': {
      color: 'blue'
    },
    ':focus': {
      color: 'green'
    }
  }
});

a.className = styles('blue');

a.focus();

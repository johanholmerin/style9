/* eslint-env browser */
import style9 from 'style9';

const styles = style9.create({
  blue: {
    ':hover': {
      color: 'blue'
    }
  }
});

console.log({ ...styles });

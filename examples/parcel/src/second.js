/* eslint-env browser */
import style9 from 'style9';

const styles = style9.create({
  body: {
    color: 'blue',
  }
});

document.body.className = styles('body');

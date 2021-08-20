/* eslint-env browser */
import style9 from 'style9';

const styles = style9.create({
  html: {
    color: 'blue',
    fontWeight: 'bold'
  }
});

document.documentElement.className = styles('html');

import('./second.js');

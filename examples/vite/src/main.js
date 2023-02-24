/* eslint-env browser */
import style9 from 'style9';

const styles = style9.create({
  blue: {
    color: 'blue'
  }
});

document.body.className = styles('blue');

if (Math.random() > 0.5) {
  import('./dynamic').then(() => import('./dynamic2'));
} else {
  import('./dynamic2').then(() => import('./dynamic'));
}

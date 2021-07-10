import style9 from 'style9';

const styles = style9.create({
  blue: {
    color: 'blue',
  }
});

document.body.className = styles('blue');

document.body.addEventListener('click', () => import('./test'));

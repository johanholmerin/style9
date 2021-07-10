import style9 from 'style9';

const styles = style9.create({
  red: {
    color: 'red',
  }
});

document.body.className = styles('red');

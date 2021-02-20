import style9 from 'style9';

const styles = style9.create({
  default: {
    color: 'blue',
    opacity: 1
  },
  red: {
    color: 'red'
  }
});

styles('default', 'red');

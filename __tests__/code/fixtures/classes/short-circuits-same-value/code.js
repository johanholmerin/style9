import style9 from 'style9';
const styles = style9.create({
  default: {
    color: 'blue'
  },
  blue: {
    color: 'blue'
  },
  red: {
    color: 'red'
  }
});
styles('blue', foo && 'default', bar && 'red');

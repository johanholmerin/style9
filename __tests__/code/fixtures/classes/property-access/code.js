import style9 from 'style9';
const styles1 = style9.create({
  default: {
    color: 'blue'
  }
});
const styles2 = style9.create({
  red: {
    color: 'red'
  }
});
style9(styles1.default, styles2.red);

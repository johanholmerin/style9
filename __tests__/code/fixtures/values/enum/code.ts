import style9 from 'style9';
enum Color {
  somecolor = 'blue'
}
const styles = style9.create({
  default: {
    color: Color.somecolor
  }
});
styles('default');

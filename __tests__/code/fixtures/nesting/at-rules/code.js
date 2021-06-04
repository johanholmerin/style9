import style9 from 'style9';
const styles = style9.create({
  default: {
    '@media (max-width: 1000px)': {
      opacity: 1
    },
    '@supports (color: blue)': {
      color: 'blue'
    }
  }
});
styles('default');

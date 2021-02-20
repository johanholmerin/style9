import style9 from 'style9';
const styles = style9.create({
  default: {
    '@media (max-width: 1000px)': {
      '::before': {
        opacity: 1
      }
    }
  }
});
styles.default;

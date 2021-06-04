import style9 from 'style9';
const styles = style9.create({
  default: {
    '@supports': {
      '(opacity: 1)': {
        opacity: 1,
        '@media': {
          '(max-width: 1000px)': {
            opacity: 1
          }
        }
      }
    }
  }
});
styles.default;

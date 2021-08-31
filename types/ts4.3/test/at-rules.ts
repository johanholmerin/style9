import style9 from 'style9';

style9.create({
  nesting: {
    '@media': {
      '(min-width: 80em)': {
        opacity: 0,
        '@supports': {
          '(opacity: 1)': {
            opacity: 1
          }
        }
      }
    }
  }
});

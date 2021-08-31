import style9 from 'style9';

style9.create({
  declaration: {
    // $ExpectError
    '--undefined': 'value'
  },
  use: {
    // $ExpectError
    flexDirection: 'var(--undefined)'
  }
});

declare module 'style9' {
  interface CustomProperties {
    '--bg-color'?: string;
  }
}

style9.create({
  declaration: {
    '--bg-color': 'blue'
  },
  use: {
    backgroundColor: 'var(--bg-color)'
  }
});

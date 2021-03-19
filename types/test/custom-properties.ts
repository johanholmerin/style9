// Minimum TypeScript Version: 4.1
import style9 from '../..';

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

declare module '../..' {
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

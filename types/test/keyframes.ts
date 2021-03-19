// Minimum TypeScript Version: 4.1
import style9 from '../..';

// $ExpectType string
style9.keyframes({
  from: { color: 'blue' },
  '50%': { color: 'yellow' },
  to: { color: 'red' }
});

style9.keyframes({
  from: {
    // $ExpectError
    ':hover': {
      color: 'blue'
    }
  }
});

import style9 from 'style9';

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

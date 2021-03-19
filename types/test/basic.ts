// Minimum TypeScript Version: 4.1
import style9 from '../..';

const styles = style9.create({
  blue: { color: 'blue' },
  red: { color: 'red' }
});

// $ExpectType string
styles('blue');
// $ExpectError
styles('not-defined');
// $ExpectType string
styles(true && 'blue');
// $ExpectType string
styles(Math.random() < 0.5 ? 'blue' : 'red');
// $ExpectType string
styles({
  blue: true
});
// $ExpectType string
style9(styles.blue);
// $ExpectType string
styles(true, false, undefined, null);

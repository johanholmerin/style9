// Minimum TypeScript Version: 4.1
import style9 from '../..';

const styles = style9.create({
  blue: { color: 'blue' },
  red: { color: 'red' },
  green: { color: 'green' }
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
styles(false, undefined, null);
// $ExpectType string
styles({ blue: undefined, red: null, green: false });
styles({ blue: undefined, red: null, green: true });
// $ExpectType string
style9(styles.blue);
// $ExpectType string
style9(false, undefined, null);
// $ExpectError
style9(true);

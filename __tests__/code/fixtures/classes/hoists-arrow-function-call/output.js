import style9 from 'style9';
const styles = {
  default: {
    color: 'c1r9f2e5'
  }
};

const get = state => {
  const _state = state();

  return _state ? 'c1r9f2e5 ' : '';
};

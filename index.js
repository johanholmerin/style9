const isObject = val => typeof val === 'object';

const merge = (target, source) => {
  Object.keys(source).map(key => {
    if (isObject(source[key])) {
      target[key] = merge({ ...target[key] }, source[key]);
    } else {
      target[key] = source[key];
    }
  });

  return target;
};

const getValues = obj => {
  return Object.keys(obj).flatMap(key => {
    if (isObject(obj[key])) {
      return getValues(obj[key]);
    } else {
      return obj[key];
    }
  });
};

const style9 = (...styles) => {
  return getValues(styles.reduce(merge, {})).join(' ');
};

export default style9;

style9.create = () => {
  throw new Error('style9.create calls should be compiled away');
};

style9.keyframes = () => {
  throw new Error('style9.keyframes calls should be compiled away');
};

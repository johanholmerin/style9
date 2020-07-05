function merge(target = {}, source) {
  for (const key in source) {
    if (typeof source[key] === 'object') {
      target[key] = merge({ ...target[key] }, source[key]);
    } else {
      target[key] = source[key];
    }
  }

  return target;
}

function getValues(obj) {
  const values = [];

  for (const key in obj) {
    const val = obj[key];
    if (typeof val === 'object') {
      values.push(...getValues(val));
    } else {
      values.push(val);
    }
  }

  return values;
}

export default function style9(...styles) {
  const merged = styles.reduce((acc, val) => merge(acc, val), {});
  return getValues(merged).join(' ');
}

style9.create = () => {
  throw new Error('style9.create calls should be compiled away');
};

style9.keyframes = () => {
  throw new Error('style9.keyframes calls should be compiled away');
};

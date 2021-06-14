const style9 = (...styles) => {
  const merged = {};

  const flatten = prefix => style => {
    for (const key in style) {
      if (typeof style[key] === 'object') {
        flatten(prefix + '.' + key)(style[key]);
      } else {
        merged[prefix + key] = style[key];
      }
    }
  };

  styles.map(flatten());

  return Object.values(merged).join(' ');
};

export default style9;

style9.create = () => {
  throw new Error('style9.create calls should be compiled away');
};

style9.keyframes = () => {
  throw new Error('style9.keyframes calls should be compiled away');
};

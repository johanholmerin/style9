const style9 = (...styles) => {
  const obj = {};
  const flatten = (style, prefix) => {
    for (const key in style) {
      if (typeof style[key] === 'object') {
        flatten(style[key], `${prefix}.${key}`);
      } else {
        obj[prefix + key] = style[key];
      }
    }
  };
  for (const style of styles) flatten(style);
  return Object.values(obj).join(' ');
};

export default style9;

style9.create = () => {
  throw new Error('style9.create calls should be compiled away');
};

style9.keyframes = () => {
  throw new Error('style9.keyframes calls should be compiled away');
};

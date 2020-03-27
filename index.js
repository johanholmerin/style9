export default function style9(...styles) {
  return Object.values(Object.assign({}, ...styles)).join(' ');
}

style9.create = () => {
  throw new Error('style9.create calls should be compiled away');
};

style9.keyframes = () => {
  throw new Error('style9.keyframes calls should be compiled away');
};

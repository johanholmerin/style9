export default function style9(...styles) {
  return Object.values(Object.assign({}, ...styles)).join(' ');
}

style9.create = () => {
  throw new Error('style9.create calls should be compiled away');
};

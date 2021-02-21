function mapObject(object, cb) {
  return Object.fromEntries(Object.entries(object).map(cb));
}

function mapObjectValues(object, cb) {
  return mapObject(object, ([key, value]) => [key, cb(value)]);
}

function removeDuplicates(list) {
  return list.filter((prop, index, array) => array.indexOf(prop) === index);
}

function filterObjectKeys(obj, keys) {
  const newObj = {};

  // Iterate in existing order
  for (const key in obj) {
    if (keys.includes(key)) {
      newObj[key] = obj[key];
    }
  }

  return newObj;
}

module.exports = {
  mapObject,
  mapObjectValues,
  removeDuplicates,
  filterObjectKeys
};

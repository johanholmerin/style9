const { mapObject, mapObjectValues } = require('../utils/helpers');
const { isNestedStyles, isAtRuleObject } = require('../utils/styles');

function flatten(type, object) {
  return mapObject(object, ([key, value]) => {
    return [`${type} ${key}`, flattenObjectAtRules(value)];
  });
}

function flattenObjectAtRules(styles) {
  const entries = Object.entries(styles).flatMap(([name, value]) => {
    if (!isNestedStyles(value)) {
      return [[name, value]];
    }

    if (isAtRuleObject(name)) {
      return Object.entries(flatten(name, value));
    }

    return [[name, flattenObjectAtRules(value)]];
  });

  return Object.fromEntries(entries);
}

function flattenAtRules(obj) {
  return mapObjectValues(obj, flattenObjectAtRules);
}

module.exports = flattenAtRules;

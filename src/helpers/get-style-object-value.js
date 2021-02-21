const { evaluateNodePath } = require('../utils/ast');
const { mapObjectValues } = require('../utils/helpers');
const {
  expandProperty,
  isNestedStyles,
  normalizeValue
} = require('../utils/styles');

function mapObject(object, cb) {
  const expanded = {};

  for (const key in object) {
    const value = object[key];
    Object.assign(expanded, cb([key, value]));
  }

  return expanded;
}

function expandStyleProperties(styles) {
  return mapObject(styles, ([key, value]) => {
    if (isNestedStyles(value)) {
      return expandProperties({ [key]: value });
    }

    const expandedProps = expandProperty(key)
      .filter(prop => !(prop in styles && prop !== key))
      .map(prop => [prop, normalizeValue(prop, value)]);

    return Object.fromEntries(expandedProps);
  });
}

// Recursively expands shorthand properties
// Alternating levels of objects are treated as having CSS properties
function expandProperties(styleContainer) {
  return mapObjectValues(styleContainer, expandStyleProperties);
}

function getStyleObjectValue(nodePath) {
  return expandProperties(evaluateNodePath(nodePath));
}

module.exports = getStyleObjectValue;

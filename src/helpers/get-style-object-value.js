const { expandProperty } = require('inline-style-expand-shorthand');
const evaluateNodePath = require('../helpers/eval-node-path');
const { mapObjectValues } = require('../utils/helpers');
const { isNestedStyles, normalizeValue } = require('../utils/styles');

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
    const current = { [key]: value };

    if (isNestedStyles(value)) {
      return expandProperties(current);
    }

    const expandedProps = Object.entries(expandProperty(key, value) || current)
      .filter(([prop]) => !(prop in styles && prop !== key))
      .map(([prop, propValue]) => [prop, normalizeValue(prop, propValue)]);

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

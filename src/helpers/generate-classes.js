const { mapObject, mapObjectValues } = require('../utils/helpers');
const {
  getClass,
  normalizePseudoElements,
  isNestedStyles,
  isAtRule,
  isPseudoSelector
} = require('../utils/styles');

function getClassValues(styles, { atRules = [], pseudoSelectors = [] } = {}) {
  return mapObject(styles, ([name, value]) => {
    if (!isNestedStyles(value)) {
      const newValue = getClass({ name, value, atRules, pseudoSelectors });
      return [name, newValue];
    }

    if (isAtRule(name)) {
      const newValue = getClassValues(value, {
        atRules: [...atRules, name],
        pseudoSelectors
      });
      return [name, newValue];
    }

    if (isPseudoSelector(name)) {
      const normalizedName = normalizePseudoElements(name);
      const newValue = getClassValues(value, {
        pseudoSelectors: [...pseudoSelectors, normalizedName],
        atRules
      });
      return [normalizedName, newValue];
    }

    throw new Error(
      `Invalid key ${name}. Object keys must be at-rules or pseudo selectors`
    );
  });
}

function generateClasses(obj) {
  return mapObjectValues(obj, value => getClassValues(value));
}

module.exports = generateClasses;

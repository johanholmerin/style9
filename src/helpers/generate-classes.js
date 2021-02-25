const { mapObject, mapObjectValues } = require('../utils/helpers');
const {
  getClass,
  normalizePseudoElements,
  isAtRule,
  isPseudoSelector
} = require('../utils/styles');

function getClassValues(styles, { atRules = [], pseudoSelectors = [] } = {}) {
  return mapObject(styles, ([name, value]) => {
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

    const newValue = getClass({ name, value, atRules, pseudoSelectors });
    return [name, newValue];
  });
}

function generateClasses(obj) {
  return mapObjectValues(obj, value => getClassValues(value));
}

module.exports = generateClasses;

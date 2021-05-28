const { mapObject, mapObjectValues } = require('../utils/helpers');
const {
  getClass,
  normalizePseudoElements,
  isAtRule,
  isPseudoSelector
} = require('../utils/styles');

function getClassValues(
  styles,
  incremental,
  { atRules = [], pseudoSelectors = [] } = {}
) {
  return mapObject(styles, ([name, value]) => {
    if (isAtRule(name)) {
      const newValue = getClassValues(value, incremental, {
        atRules: [...atRules, name],
        pseudoSelectors
      });
      return [name, newValue];
    }

    if (isPseudoSelector(name)) {
      const normalizedName = normalizePseudoElements(name);
      const newValue = getClassValues(value, incremental, {
        pseudoSelectors: [...pseudoSelectors, normalizedName],
        atRules
      });
      return [normalizedName, newValue];
    }

    const newValue = getClass(
      { name, value, atRules, pseudoSelectors },
      incremental
    );
    return [name, newValue];
  });
}

function generateClasses(obj, incremental = false) {
  return mapObjectValues(obj, value => getClassValues(value, incremental));
}

module.exports = generateClasses;

const {
  normalizePseudoElements,
  isAtRule,
  isPseudoSelector
} = require('../utils/styles');

function flattenStyle({ name, value, atRules, pseudoSelectors }) {
  if (isAtRule(name)) {
    return flattenStyles(value, {
      atRules: [...atRules, name],
      pseudoSelectors
    });
  }

  if (isPseudoSelector(name)) {
    const normalizedName = normalizePseudoElements(name);
    return flattenStyles(value, {
      pseudoSelectors: [...pseudoSelectors, normalizedName],
      atRules
    });
  }

  return { name, value, atRules, pseudoSelectors };
}

function flattenStyles(styles, { atRules = [], pseudoSelectors = [] } = {}) {
  return Object.entries(styles).flatMap(([name, value]) =>
    flattenStyle({ name, value, atRules, pseudoSelectors })
  );
}

module.exports = flattenStyles;

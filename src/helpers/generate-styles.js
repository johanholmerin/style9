const { getDeclaration } = require('../utils/styles');
const flattenStyles = require('./flatten-styles');

function generateStyles(styles) {
  return Object.values(styles).flatMap(props =>
    flattenStyles(props).map(getDeclaration)
  );
}

module.exports = generateStyles;

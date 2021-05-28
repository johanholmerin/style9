const { getDeclaration } = require('../utils/styles');
const flattenStyles = require('./flatten-styles');

function generateStyles(styles, incremental) {
  return Object.values(styles).flatMap(props =>
    flattenStyles(props).map(obj => getDeclaration(obj, incremental))
  );
}

module.exports = generateStyles;

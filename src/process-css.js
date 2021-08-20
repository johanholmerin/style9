const postcss = require('postcss');
const discardDuplicates = require('postcss-discard-duplicates');
const sortPseudo = require('../css');

module.exports = function processCSS(css, options) {
  return postcss([discardDuplicates, sortPseudo()]).process(css, options);
};

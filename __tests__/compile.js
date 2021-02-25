const babel = require('@babel/core');
const plugin = require('../babel.js');

function compile(input, opts = {}) {
  const {
    code,
    ast,
    metadata: { style9: styles }
  } = babel.transformSync(input, {
    plugins: [[plugin, opts]],
    highlightCode: false
  });

  return { code, ast, styles };
}

module.exports = compile;

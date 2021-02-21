const t = require('@babel/types');
const getStyleObjectValue = require('../helpers/get-style-object-value');
const { getKeyframes } = require('../utils/styles');

function transpileKeyframes(identifier) {
  const callExpr = identifier.parentPath.parentPath;
  const objExpr = callExpr.get('arguments.0');

  const rules = getStyleObjectValue(objExpr);
  const { name, declaration } = getKeyframes(rules);

  callExpr.replaceWith(t.stringLiteral(name));

  return declaration;
}

module.exports = { transpileKeyframes };

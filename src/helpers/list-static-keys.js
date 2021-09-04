const { isDynamicKey, getStaticKey } = require('../utils/ast');

function listStaticKeys(callExpr, allKeys) {
  const { parentPath } = callExpr;

  if (parentPath.isMemberExpression()) {
    return isDynamicKey(parentPath) ? allKeys : [getStaticKey(parentPath)];
  }

  if (parentPath.get('id').isObjectPattern()) {
    const properties = parentPath.get('id.properties');
    const hasRestElement = properties.some(prop => prop.isRestElement());
    if (hasRestElement) return allKeys;

    return properties.map(prop => prop.node.key.name);
  }

  // Stryker disable next-line ArrayDeclaration: only actual keys are checked
  return [];
}

module.exports = listStaticKeys;

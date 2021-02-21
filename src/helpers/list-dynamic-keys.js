const { isDynamicKey, getStaticKey } = require('../utils/ast');

function listDynamicKeys(references, allKeys) {
  const dynamicKeys = [];

  for (const ref of references) {
    if (ref.parentPath.isSpreadElement()) return allKeys;

    if (ref.parentPath.isMemberExpression()) {
      if (isDynamicKey(ref.parentPath)) return allKeys;

      dynamicKeys.push(getStaticKey(ref.parentPath));
    }
  }

  return dynamicKeys;
}

module.exports = listDynamicKeys;

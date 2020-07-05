const t = require('@babel/types');
const { extractNode } = require('./utils.js');

/**
 * Map arguments to strings and logical ANDs
 * Move nodes to constants
 */
function normalizeArguments(use) {
  return use.parentPath.get('arguments').flatMap(argPath => {
    const arg = argPath.node;
    if (t.isObjectExpression(arg)) {
      return arg.properties.map(prop => {
        t.assertIdentifier(prop.key);

        return {
          test: extractNode(use, prop.value),
          value: prop.key.name
        };
      });
    } else if (t.isStringLiteral(arg)) {
      return arg.value;
    } else if (t.isLogicalExpression(arg, { operator: '&&' })) {
      t.assertStringLiteral(arg.right);

      return {
        test: extractNode(use, arg.left),
        value: arg.right.value
      };
    } else if (t.isConditionalExpression(arg)) {
      t.assertStringLiteral(arg.consequent);
      t.assertStringLiteral(arg.alternate);

      return [
        arg.alternate.value,
        {
          test: extractNode(use, arg.test),
          value: arg.consequent.value
        }
      ];
    } else {
      throw argPath.buildCodeFrameError(`Unsupported type ${arg.type}`);
    }
  });
}

module.exports = normalizeArguments;

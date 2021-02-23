const t = require('@babel/types');

function normalizeObjectExpression(objectExpr) {
  return objectExpr.properties.map(prop => {
    t.assertObjectProperty(prop, { computed: false });
    t.assertIdentifier(prop.key);

    return {
      test: prop.value,
      value: prop.key.name
    };
  });
}

function normalizeLogicalExpression(logicalExpr) {
  t.assertStringLiteral(logicalExpr.right);

  return {
    test: logicalExpr.left,
    value: logicalExpr.right.value
  };
}

function normalizeConditionalExpression(conditionalExpr) {
  t.assertStringLiteral(conditionalExpr.consequent);
  t.assertStringLiteral(conditionalExpr.alternate);

  return [
    conditionalExpr.alternate.value,
    {
      test: conditionalExpr.test,
      value: conditionalExpr.consequent.value
    }
  ];
}

// Map resolver arguments to strings and logical ANDs
function normalizeArguments(callExpr) {
  return callExpr.get('arguments').flatMap(arg => {
    if (t.isObjectExpression(arg.node)) {
      return normalizeObjectExpression(arg.node);
    }

    if (t.isStringLiteral(arg.node)) {
      return arg.node.value;
    }

    if (t.isLogicalExpression(arg.node, { operator: '&&' })) {
      return normalizeLogicalExpression(arg.node);
    }

    if (t.isConditionalExpression(arg.node)) {
      return normalizeConditionalExpression(arg.node);
    }

    throw arg.buildCodeFrameError(`Unsupported type ${arg.node.type}`);
  });
}

module.exports = normalizeArguments;

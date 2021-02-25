const t = require('@babel/types');

function assertType(nodePath, type, opts) {
  if (!t[`is${type}`](nodePath.node, opts)) {
    throw nodePath.buildCodeFrameError(`Unsupported type ${nodePath.type}`);
  }
}

function assertInStyles(stringOrIdentifier, styleNames) {
  const value = t.isStringLiteral(stringOrIdentifier)
    ? stringOrIdentifier.node.value
    : stringOrIdentifier.node.name;

  if (!styleNames.includes(value)) {
    throw stringOrIdentifier.buildCodeFrameError(
      `Property ${value} does not exist in style object`
    );
  }
}

function normalizeObjectExpression(objectExpr, styleNames) {
  return objectExpr.get('properties').map(prop => {
    assertType(prop, 'ObjectProperty', { computed: false });
    assertInStyles(prop.get('key'), styleNames);

    return {
      test: prop.node.value,
      value: prop.node.key.name
    };
  });
}

function normalizeLogicalExpression(logicalExpr, styleNames) {
  assertType(logicalExpr.get('right'), 'StringLiteral');
  assertInStyles(logicalExpr.get('right'), styleNames);

  return {
    test: logicalExpr.node.left,
    value: logicalExpr.node.right.value
  };
}

function normalizeConditionalExpression(conditionalExpr, styleNames) {
  assertType(conditionalExpr.get('consequent'), 'StringLiteral');
  assertType(conditionalExpr.get('alternate'), 'StringLiteral');
  assertInStyles(conditionalExpr.get('alternate'), styleNames);
  assertInStyles(conditionalExpr.get('consequent'), styleNames);

  return [
    conditionalExpr.node.alternate.value,
    {
      test: conditionalExpr.node.test,
      value: conditionalExpr.node.consequent.value
    }
  ];
}

function normalizeStringLiteral(stringLiteral, styleNames) {
  assertInStyles(stringLiteral, styleNames);
  return stringLiteral.node.value;
}

// Map resolver arguments to strings and logical ANDs
function normalizeArguments(callExpr, styleNames) {
  return callExpr.get('arguments').flatMap(arg => {
    if (t.isObjectExpression(arg.node)) {
      return normalizeObjectExpression(arg, styleNames);
    }

    if (t.isStringLiteral(arg.node)) {
      return normalizeStringLiteral(arg, styleNames);
    }

    if (t.isLogicalExpression(arg.node, { operator: '&&' })) {
      return normalizeLogicalExpression(arg, styleNames);
    }

    if (t.isConditionalExpression(arg.node)) {
      return normalizeConditionalExpression(arg, styleNames);
    }

    throw arg.buildCodeFrameError(`Unsupported type ${arg.node.type}`);
  });
}

module.exports = normalizeArguments;

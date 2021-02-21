function evaluateNodePath(path) {
  const { value, confident, deopt } = path.evaluate();
  if (confident) return value;
  throw deopt.buildCodeFrameError('Could not evaluate value');
}

function isDynamicKey(memberExpr) {
  const property = memberExpr.get('property');

  return memberExpr.node.computed && !property.isLiteral();
}

function getStaticKey(memberExpr) {
  return memberExpr.node.property.name || memberExpr.node.property.value;
}

module.exports = { isDynamicKey, getStaticKey, evaluateNodePath };

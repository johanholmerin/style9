function isDynamicKey(memberExpr) {
  const property = memberExpr.get('property');

  return memberExpr.node.computed && !property.isLiteral();
}

function getStaticKey(memberExpr) {
  return memberExpr.node.property.name || memberExpr.node.property.value;
}

module.exports = { isDynamicKey, getStaticKey };

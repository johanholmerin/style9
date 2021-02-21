function listFunctionCalls(references) {
  return references.filter(ref => {
    return ref.parentPath.isCallExpression() && ref.parent.callee === ref.node;
  });
}

module.exports = listFunctionCalls;

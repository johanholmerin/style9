function listReferences(declarator) {
  if (declarator.get('id').isIdentifier()) {
    return declarator.scope.bindings[declarator.node.id.name].referencePaths;
  }

  return [];
}

module.exports = listReferences;

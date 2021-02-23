function stripTypeAssertions(nodePath) {
  nodePath.traverse({
    TSAsExpression(path) {
      path.replaceWith(path.get('expression'));
    }
  });
}

module.exports = stripTypeAssertions;

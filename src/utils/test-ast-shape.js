function getAst(ast, path) {
  if (Array.isArray(ast)) return ast[path];
  if (path === 'parent') return ast.parentPath;
  return ast.get(path);
}

function getValue(ast, path) {
  if (Array.isArray(ast)) return ast[path];
  return ast && ast.node[path];
}

function testASTShape(ast, shape) {
  for (const key in shape) {
    if (typeof shape[key] === 'object') {
      if (!testASTShape(getAst(ast, key), shape[key])) return false;
    } else {
      if (shape[key] !== getValue(ast, key)) return false;
    }
  }

  return true;
}

module.exports = testASTShape;

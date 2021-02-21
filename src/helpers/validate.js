const assert = require('assert');
const testASTShape = require('../utils/test-ast-shape');

function isHMR(identifier) {
  return testASTShape(identifier.parentPath, {
    type: 'CallExpression',
    callee: {
      type: 'MemberExpression',
      object: {
        name: 'reactHotLoader'
      },
      property: {
        name: 'register'
      }
    }
  });
}

function validateReferences(references) {
  references.forEach(ref => {
    const { parentPath, parent, node } = ref;
    if (parentPath.isCallExpression() && parent.callee === node) return;
    if (parentPath.isSpreadElement()) return;
    if (parentPath.isMemberExpression()) return;

    // The return value from `style9.create` should be a function, but the
    // compiler turns it into an object. Therefore only access to properties
    // is allowed. React Hot Loader accesses all bindings, so a temporary
    // workaround is required. React Fast Refresh does not have this problem.
    assert(
      isHMR(ref),
      ref.buildCodeFrameError(
        'Return value from style9.create has to be called as a function or accessed as an object'
      )
    );
  });
}

module.exports = { validateReferences };

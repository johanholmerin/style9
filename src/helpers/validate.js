const assert = require('assert');
const testASTShape = require('../utils/test-ast-shape');
const {
  isAtRuleObject,
  isAtRule,
  isPseudoSelector
} = require('../utils/styles');

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

function evalKey(objProp) {
  const keyPath = objProp.get('key');
  if (objProp.node.computed) {
    return keyPath.evaluate();
  }

  if (keyPath.isStringLiteral()) {
    return { value: keyPath.node.value, confident: true };
  }

  return { value: keyPath.node.name, confident: true };
}

function validateStyleObjectInner(objExpr) {
  objExpr.traverse({
    ObjectProperty(path) {
      const { value, confident } = evalKey(path);
      if (!confident) return;

      if (!path.get('value').isObjectExpression()) return;

      if (isAtRuleObject(value)) {
        // Skip direct props
        validateStyleObject(path.get('value'));
        path.skip();
      } else if (!isAtRule(value) && !isPseudoSelector(value)) {
        throw path
          .get('key')
          .buildCodeFrameError(
            `Invalid key ${value}. Object keys must be at-rules or pseudo selectors`
          );
      }
    }
  });
}

// Does not validate spread elements
function validateStyleObject(objExpr) {
  objExpr.get('properties').forEach(prop => {
    if (!prop.isObjectProperty()) return;
    validateStyleObjectInner(prop.get('value'));
  });
}

module.exports = { validateReferences, validateStyleObject };

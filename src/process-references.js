const { transpileCreate } = require('./transpilers/create');
const { transpileKeyframes } = require('./transpilers/keyframes');
const testASTShape = require('./utils/test-ast-shape');

function isPropertyCall(node, name) {
  return testASTShape(node, {
    parent: {
      type: 'MemberExpression',
      parent: {
        type: 'CallExpression',
        callee: {
          property: { name }
        },
        arguments: {
          length: 1,
          0: {
            type: 'ObjectExpression'
          }
        }
      }
    }
  });
}

function processReference(node, options) {
  // style9() calls are left as-is
  if (node.parentPath.isCallExpression()) return [];

  if (isPropertyCall(node, 'create')) return transpileCreate(node, options);
  if (isPropertyCall(node, 'keyframes')) return transpileKeyframes(node);

  throw node.buildCodeFrameError(
    'Unsupported use. Supported uses are: style9(), style9.create(), and style9.keyframes()'
  );
}

// Keyframes needs to be processed first because the result is used in create.
// The correct solution would be to process the references in the order they
// would be executed, but it's easier to just sort keyframes first
function sortReferences(references) {
  return references.sort(reference =>
    isPropertyCall(reference, 'keyframes') ? -1 : 1
  );
}

function processReferences(references, options) {
  return sortReferences(references).flatMap(node => {
    return processReference(node, options);
  });
}

module.exports = processReferences;

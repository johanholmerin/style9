const { getTypeBinding } = require('babel-type-scopes');
const translateEnumValues = require('./translate-enum-values');

function getTypeDec(path) {
  const name = path.node.object.name;
  const maybeTS = !path.scope.hasBinding(name);
  if (maybeTS) {
    return getTypeBinding(path, name);
  }
}

function evalDeopt(deopt) {
  if (!deopt.isMemberExpression()) return;
  if (!deopt.get('object').isIdentifier()) return;
  if (!deopt.get('property').isIdentifier()) return;
  const dec = getTypeDec(deopt);
  if (!dec) return;
  if (dec.kind !== 'declaration') return;
  // TODO mutation
  const enumValue = Object.fromEntries(
    translateEnumValues(dec.path.parentPath)
  );
  const key = deopt.node.property.name;
  if (!(key in enumValue)) return;
  deopt.replaceWith(enumValue[key]);
}

function evaluateNodePath(path, prevDeopt) {
  const { value, confident, deopt } = path.evaluate();
  if (confident) return value;
  if (deopt !== prevDeopt) {
    evalDeopt(deopt);
    return evaluateNodePath(path, deopt);
  }
  throw deopt.buildCodeFrameError('Could not evaluate value');
}

module.exports = evaluateNodePath;

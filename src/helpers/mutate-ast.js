const t = require('@babel/types');
const { mapObjectValues } = require('../utils/helpers');
const flattenStyles = require('./flatten-styles');
const generateExpression = require('./generate-expression');

function objectToAST(object) {
  const properties = Object.entries(object).map(([name, value]) => {
    const isObject = typeof value === 'object';
    const isIdentifier = t.isValidIdentifier(name, false);

    const astValue = isObject ? objectToAST(value) : t.stringLiteral(value);
    const key = isIdentifier ? t.identifier(name) : t.stringLiteral(name);

    return t.objectProperty(key, astValue);
  });

  return t.objectExpression(properties);
}

function replaceCreateCall(callExpr, minifiedDefinitions) {
  callExpr.replaceWith(objectToAST(minifiedDefinitions));
}

function flattenClasses(classes) {
  return mapObjectValues(classes, value => {
    return Object.fromEntries(
      flattenStyles(value).map(({ value, ...rest }) => [
        JSON.stringify(rest),
        value
      ])
    );
  });
}

function extractNode(path, node) {
  if (t.isIdentifier(node)) return node;

  const name = path.scope.generateUidBasedOnNode(node);

  if (!Array.isArray(path.scope.path.get('body'))) {
    path.scope.path.ensureBlock();
  }

  path
    .getStatementParent()
    .insertBefore(
      t.variableDeclaration('const', [
        t.variableDeclarator(t.identifier(name), node)
      ])
    );

  return t.identifier(name);
}

function extractArgumentIdentifiers(parentPath, args) {
  return args.map(arg => {
    if (typeof arg === 'string') return arg;

    return {
      value: arg.value,
      test: extractNode(parentPath, arg.test)
    };
  });
}

function replaceFunctionCalls(normalizedFuncCalls, styleClasses) {
  for (const [callExpr, args] of normalizedFuncCalls) {
    const flatClasses = flattenClasses(styleClasses);
    const replacedArguments = extractArgumentIdentifiers(callExpr, args);

    callExpr.replaceWith(generateExpression(replacedArguments, flatClasses));
  }
}

module.exports = { replaceCreateCall, replaceFunctionCalls };

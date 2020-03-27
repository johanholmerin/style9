const {
  expandProperty,
  resolvePathValue,
  getClass,
  getDeclaration
} = require('./utils.js');
const testASTShape = require('./test-ast-shape.js');
const t = require('@babel/types');
const generateExpression = require('./generate-expression.js');

function getStyles(binding) {
  const value = resolvePathValue(binding);
  const styles = {};

  for (const name in value) {
    styles[name] = {};

    for (const key in value[name]) {
      for (const prop of expandProperty(key)) {
        // Longhand takes precedent
        if (prop in value[name] && prop !== key) continue;

        styles[name][prop] = value[name][key];
      }
    }
  }

  return styles;
}

function getClasses(styles) {
  const classes = {};

  for (const name in styles) {
    classes[name] = {};

    for (const key in styles[name]) {
      classes[name][key] = getClass(key, styles[name][key]);
    }
  }

  return classes;
}

function replaceUseCalls(uses, classes) {
  for (const use of uses) {
    if (!use.parentPath.isCallExpression()) continue;

    const expr = generateExpression(use, classes);
    use.parentPath.replaceWith(expr);
  }
}

function replaceDeclaration(node, classes) {
  const styles = [];

  for (const name in classes) {
    const style = [];

    for (const key in classes[name]) {
      style.push(t.objectProperty(
        t.identifier(key),
        t.stringLiteral(classes[name][key])
      ));
    }

    styles.push(t.objectProperty(
      t.identifier(name),
      t.objectExpression(style)
    ));
  }

  node.replaceWith(t.objectExpression(styles));
}

function generateStyles(styles) {
  return Object.values(styles)
    .flatMap(props =>
      Object.entries(props).map(([prop, value]) => getDeclaration(prop, value))
    );
}

function handleCreate(identifier) {
  const callExpr = identifier.parentPath.parentPath;
  const objExpr = callExpr.get('arguments.0');
  const varDec = callExpr.parentPath;
  const uses = varDec.scope.bindings[varDec.node.id.name].referencePaths;

  const styles = getStyles(objExpr);
  const classes = getClasses(styles);

  replaceDeclaration(callExpr, classes);
  if (varDec.isVariableDeclarator()) replaceUseCalls(uses, classes);

  return generateStyles(styles);
}

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

function handleBinding(node) {
  if (node.parentPath.isCallExpression()) return [];
  if (isPropertyCall(node, 'create')) return handleCreate(node);

  throw node.buildCodeFrameError('Invalid use');
}

module.exports = handleBinding;

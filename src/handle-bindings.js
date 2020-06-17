const {
  expandProperty,
  resolvePathValue,
  getClass,
  getDeclaration,
  getKeyframes
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
    if (use.parentPath.isCallExpression() && use.parent.callee === use.node) {
      const expr = generateExpression(use, classes);
      use.parentPath.replaceWith(expr);
    } else if (!use.parentPath.isMemberExpression()) {
      // The return value from `style9.create` should be a function, but the
      // compiler turns it into an object. Therefore only access to properties
      // is allowed. React Hot Loader accesses all bindings, so a temporary
      // workaround is required. React Fast Refresh does not have this problem.

      const isHMR = testASTShape(use.parentPath, {
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

      if (!isHMR) {
        throw use.buildCodeFrameError('Invalid use');
      }
    }
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
  if (!varDec.isVariableDeclarator()) {
    throw varDec.buildCodeFrameError('Style has to be assigned to variable');
  }
  const uses = varDec.get('id').isIdentifier() ?
    varDec.scope.bindings[varDec.node.id.name].referencePaths :
    [];

  const styles = getStyles(objExpr);
  const classes = getClasses(styles);

  replaceDeclaration(callExpr, classes);
  replaceUseCalls(uses, classes);

  return generateStyles(styles);
}

function handleKeyframes(identifier) {
  const callExpr = identifier.parentPath.parentPath;
  const objExpr = callExpr.get('arguments.0');

  const rules = getStyles(objExpr);
  const { name, declaration } = getKeyframes(rules);

  callExpr.replaceWith(t.stringLiteral(name));

  return declaration;
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
  if (isPropertyCall(node, 'keyframes')) return handleKeyframes(node);

  throw node.buildCodeFrameError('Invalid use');
}

function handleBindings(bindings) {
  return bindings
    // Process keyframes first
    .sort(binding => (isPropertyCall(binding, 'keyframes') ? -1 : 1))
    .flatMap(handleBinding);
}

module.exports = handleBindings;

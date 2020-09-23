const {
  expandProperties,
  resolvePathValue,
  getClass,
  getDeclaration,
  getKeyframes,
  isNestedStyles,
  normalizePseudoElements,
  minifyProperty
} = require('./utils.js');
const testASTShape = require('./test-ast-shape.js');
const t = require('@babel/types');
const generateExpression = require('./generate-expression.js');
const normalizeArguments = require('./normalize-arguments.js');

function getStyles(binding) {
  return expandProperties(resolvePathValue(binding));
}

function reduceStyles(styles, combineFunc, leafFunc,
		{ atRules = [], pseudoSelectors = [] } = {}) {
  return combineFunc(
    Object.entries(styles).map(([name, value]) => {
      if (!isNestedStyles(value)) {
        return [name, leafFunc({ name, value, atRules, pseudoSelectors })];
      } else if (name.startsWith('@')) {
        return [
          name,
          reduceStyles(value, combineFunc, leafFunc, {
            atRules: [...atRules, name],
            pseudoSelectors
          }),
        ];
      } else if (name.startsWith(':')) {
        const normalizedName = normalizePseudoElements(name);
        return [
          normalizedName,
          reduceStyles(value, combineFunc, leafFunc, {
            pseudoSelectors: [...pseudoSelectors, normalizedName],
            atRules
          })
        ];
      }
      throw new Error(`Invalid key ${name}`);
    })
  );
}

function getClassValues(styles) {
  return reduceStyles(styles, Object.fromEntries, getClass);
}

function flattenStyles(styles) {
  return reduceStyles(
    styles,
    entries => entries.flatMap(([, val]) => val),
    x => x
  );
}

function getClasses(obj) {
  const newObj = {};

  for (const key in obj) {
    newObj[key] = getClassValues(obj[key]);
  }

  return newObj;
}

function flattenClasses(classes) {
  return Object.fromEntries(
    Object.entries(classes)
      .map(([key, value]) => [
        key,
        Object.fromEntries(
          flattenStyles(value)
            .map(({ value, ...rest }) => [JSON.stringify(rest), value])
        ),
      ])
  );
}

function isDynamicKey(memberExpr) {
  const property = memberExpr.get('property');

  return memberExpr.node.computed && !property.isLiteral();
}

function getDynamicOrStaticKeys(memberExpr, allKeys) {
  // Don't remove any key when using dynamic access
  if (isDynamicKey(memberExpr)) return allKeys;

  return [memberExpr.node.property.name || memberExpr.node.property.value];
}

function replaceUseCalls(varDec, classes) {
  if (varDec.isMemberExpression()) {
    return getDynamicOrStaticKeys(varDec, Object.keys(classes));
  }

  if (varDec.get('id').isObjectPattern()) {
    const names = [];

    for (const prop of varDec.get('id.properties')) {
      if (prop.isRestElement()) {
        return Object.keys(classes);
      }
      names.push(prop.node.key.name);
    }

    return names;
  }

  const uses = getUses(varDec);
  const names = new Set();
  const flatClasses = flattenClasses(classes);

  for (const use of uses) {
    if (use.parentPath.isCallExpression() && use.parent.callee === use.node) {
      const args = normalizeArguments(use);
      args.forEach(arg => {
        if (typeof arg === 'string') names.add(arg);
        else names.add(arg.value);
      });
      const expr = generateExpression(args, flatClasses);
      use.parentPath.replaceWith(expr);
    } else if (use.parentPath.isMemberExpression()) {
      getDynamicOrStaticKeys(use.parentPath, Object.keys(classes))
        .forEach(key => names.add(key))
    } else if (use.parentPath.isSpreadElement()) {
      return Object.keys(classes);
    } else {
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
        throw use.buildCodeFrameError(
          'Return value from style9.create has to be called as a function or ' +
          'accessed as an object'
        );
      }
    }
  }

  return Array.from(names);
}

function astFromObject(obj) {
  const ast = [];

  for (const name in obj) {
    const astValue = typeof obj[name] === 'object' ?
      astFromObject(obj[name]) :
      t.stringLiteral(obj[name]);
    const key = t.isValidIdentifier(name, false) ?
      t.identifier(name) :
      t.stringLiteral(name);

    ast.push(t.objectProperty(key, astValue));
  }

  return t.objectExpression(ast);
}

function replaceDeclaration(node, classes) {
  node.replaceWith(astFromObject(classes));
}

function generateStyles(styles) {
  return Object.values(styles)
    .flatMap(props => flattenStyles(props).map(getDeclaration));
}

function minifyProperties(classes) {
  const minified = {};

  for (const key in classes) {
    const minifiedName = minifyProperty(key);
    const value = classes[key];

    minified[minifiedName] = typeof value === 'object' ?
      minifyProperties(value) :
      value;
  }

  return minified;
}

function getUses(varDec) {
  if (!varDec.isVariableDeclarator()) {
    throw varDec.buildCodeFrameError('Style has to be assigned to variable');
  }

  return varDec.scope.bindings[varDec.node.id.name].referencePaths;
}

function filterObject(obj, keys) {
  const newObj = {};

  // Iterate in existing order
  for (const key in obj) {
    if (keys.includes(key)) {
      newObj[key] = obj[key];
    }
  }

  return newObj;
}

function handleCreate(identifier, opts) {
  const callExpr = identifier.parentPath.parentPath;
  const objExpr = callExpr.get('arguments.0');

  let styles = getStyles(objExpr);
  let classes = getClasses(styles);

  const usedProperties = replaceUseCalls(callExpr.parentPath, classes);
  styles = filterObject(styles, usedProperties);
  classes = filterObject(classes, usedProperties);

  if (opts.minifyProperties) {
    const minifiedClasses = Object.fromEntries(
      Object.entries(classes)
        .map(([key, value]) => [key, minifyProperties(value)])
    );
    replaceDeclaration(callExpr, minifiedClasses);
  } else {
    replaceDeclaration(callExpr, classes);
  }

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

function handleBinding(node, opts) {
  if (node.parentPath.isCallExpression()) return [];
  if (isPropertyCall(node, 'create')) return handleCreate(node, opts);
  if (isPropertyCall(node, 'keyframes')) return handleKeyframes(node);

  throw node.buildCodeFrameError('Invalid use');
}

function handleBindings(bindings, opts) {
  return bindings
    // Process keyframes first
    .sort(binding => (isPropertyCall(binding, 'keyframes') ? -1 : 1))
    .flatMap(node => handleBinding(node, opts));
}

module.exports = handleBindings;

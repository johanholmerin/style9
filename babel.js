const NAME = require('./package.json').name;
const {
  expandProperty,
  resolvePathValue,
  getNodeValue,
  getClass,
  getDeclaration,
  extractNode
} = require('./utils.js');
const t = require('@babel/types');
const generateExpression = require('./generate-expression.js');
const assert = require('assert');

/**
 * Verify the shape of the call to style9.create
 */
function assertCallShape(binding) {
  t.assertMemberExpression(binding.parentPath);
  t.assertIdentifier(binding.parent.property, { name: 'create' });

  const createPath = binding.parentPath.parentPath;
  t.assertCallExpression(createPath);

  // Top-level declaration only
  const declaration = createPath.parentPath;
  t.assertVariableDeclarator(declaration);
  t.assertProgram(declaration.parentPath.parentPath);

  const styles = createPath.get('arguments.0');
  t.assertObjectExpression(styles);
}

/**
 * Replace values with classes in object. Returns array of CSS declarations
 */
function replaceStyles(styles) {
  const css = [];

  for (const styleObj of styles.get('properties')) {
    t.assertObjectProperty(styleObj);
    t.assertIdentifier(styleObj.get('key'));
    t.assertObjectExpression(styleObj.get('value'));

    const keys = styleObj.node.value.properties.map(prop => prop.key.name);

    for (const styleProp of styleObj.get('value.properties')) {
      t.assertIdentifier(styleProp.get('key'));

      const value = resolvePathValue(styleProp.get('value'));
      const newProps = [];

      for (const prop of expandProperty(styleProp.node.key.name)) {
        // Longhand takes precedent
        if (prop !== styleProp.node.key.name && keys.includes(prop)) continue;

        css.push(getDeclaration(prop, value));

        newProps.push(t.objectProperty(
          t.identifier(prop),
          t.stringLiteral(getClass(prop, value))
        ));
      }

      styleProp.replaceWithMultiple(newProps);
    }
  }

  return css;
}

/**
 * Map arguments to strings and logical ANDs
 * Move nodes to constants
 */
function normalizeArguments(use) {
  return use.parent.arguments.flatMap(arg => {
    if (t.isObjectExpression(arg)) {
      return arg.properties.map(prop => {
        t.assertIdentifier(prop.key);

        return {
          test: extractNode(use, prop.value),
          value: prop.key.name
        };
      });
    } else if (t.isStringLiteral(arg)) {
      return arg.value;
    } else if (t.isLogicalExpression(arg, { operator: '&&' })) {
      t.assertStringLiteral(arg.right);

      return {
        test: extractNode(use, arg.left),
        value: arg.right.value
      };
    } else if (t.isConditionalExpression(arg)) {
      t.assertStringLiteral(arg.consequent);
      t.assertStringLiteral(arg.alternate);

      return [
        arg.alternate.value,
        {
          test: extractNode(use, arg.test),
          value: arg.consequent.value
        }
      ];
    } else {
      throw new Error(`Unsupported type ${arg.type}`);
    }
  });
}


/**
 * Rewrite style9.create calls and the uses of the returned function.
 * Returns array of CSS declarations
 */
function handleBinding(binding) {
  if (t.isCallExpression(binding.parentPath)) return [];
  assertCallShape(binding);

  const createPath = binding.parentPath.parentPath;

  const declarationName = createPath.parentPath.node.id.name;
  const uses = binding.scope.bindings[declarationName].referencePaths;

  const stylesPath = createPath.get('arguments.0');
  const styleNames = stylesPath.node.properties.map(prop => prop.key.name);

  const literals = new Set();
  const calls = new Map();

  // Get list of used styles
  for (const use of uses) {
    if (t.isMemberExpression(use.parent)) {
      t.assertIdentifier(use.parent.property);

      const { name } = use.parent.property;
      assert(
        styleNames.includes(name),
        `Property ${name} does not exist in style object`
      );
      literals.add(name);
    } else {
      t.assertCallExpression(use.parentPath);

      const args = normalizeArguments(use);
      args.forEach(arg => {
        literals.add(typeof arg === 'string' ? arg : arg.value);
      });
      calls.set(use, args);
    }
  }

  // Remove unused styles
  stylesPath.get('properties').forEach(prop => {
    if (!literals.has(prop.node.key.name)) {
      prop.remove();
    }
  });

  const css = replaceStyles(stylesPath);
  const classObj = getNodeValue(stylesPath.node);

  // Replace function call with expression
  for (const [use, args] of calls) {
    const expr = generateExpression(args, classObj);
    use.parentPath.replaceWith(expr);
  }

  // Remove style9.create call, keep object
  createPath.replaceWith(stylesPath.node);

  return css;
}

module.exports = function style9BabelPlugin() {
  return {
    name: NAME,
    visitor: {
      ImportDefaultSpecifier(path, state) {
        if (path.parent.source.value !== NAME) return;

        const importName = path.node.local.name;
        const bindings = path.scope.bindings[importName].referencePaths;

        state.file.metadata.style9 = bindings.flatMap(handleBinding)
          // Remove duplicates
          .filter((e, i, a) => a.indexOf(e) === i)
          .sort()
          .join('');
      }
    }
  };
}

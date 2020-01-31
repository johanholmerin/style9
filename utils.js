const t = require('@babel/types');
const { UNITLESS_NUMBERS, SHORTHAND_EXPANSIONS } = require('./constants.js');

function expandProperty(prop) {
  return SHORTHAND_EXPANSIONS[prop] || [prop];
}

const BASE_FONT_SIZE_PX = 16;

function normalizeValue(prop, value) {
  if (typeof value === 'number' ) {
    if (prop === 'fontSize') return `${value / BASE_FONT_SIZE_PX}rem`;
    if (!UNITLESS_NUMBERS.includes(prop)) return `${value}px`;
  }

  if (Array.isArray(value)) return value.slice().sort().join(' ');

  return value;
}

// Class can't start with number
const CLASS_PREFIX = 'c';

// CSS values cache
const VALUES = [];

function getClass(prop, value) {
  const key = JSON.stringify([prop, value]);
  if (!VALUES.includes(key)) VALUES.push(key);
  return CLASS_PREFIX + VALUES.indexOf(key).toString(36);
}

function camelToHyphen(string) {
  return string.replace(/[A-Z]/g, c => `-${c.toLowerCase()}`);
}

/**
 * Resolve the value of a node path
 */
function resolvePathValue(path) {
  if (t.isArrayExpression(path)) {
    return path.get('elements').map(resolvePathValue);
  }

  if (t.isStringLiteral(path) || t.isNumericLiteral(path)) {
    return path.node.value;
  }

  if (t.isIdentifier(path)) {
    const declaration = path.scope.bindings[path.node.name].path;
    t.assertVariableDeclaration(declaration.parent, { kind: 'const' });
    return resolvePathValue(declaration.get('init'));
  }

  throw new Error(`Invalid value type ${path.node.type}`);
}

function getDeclaration(prop, value) {
  const cls = getClass(prop, value);
  return `.${cls}{${camelToHyphen(prop)}:${normalizeValue(prop, value)}}`;
}

/**
 * Get JS value from AST node
 * Support object expressions and string literals
 */
function getNodeValue(node) {
  if (t.isObjectExpression(node)) {
    return Object.fromEntries(
      node.properties.map(prop => [prop.key.name, getNodeValue(prop.value)])
    );
  }

  t.assertStringLiteral(node);

  return node.value;
}

/**
 * Move node to a constant and return an identifier
 */
function extractNode(path, node) {
  const name = path.scope.generateUidBasedOnNode(node);

  path.getStatementParent().insertBefore(
    t.variableDeclaration('const', [
      t.variableDeclarator(t.identifier(name), node)
    ])
  );

  return t.identifier(name);
}

module.exports = {
  expandProperty,
  resolvePathValue,
  getNodeValue,
  getClass,
  getDeclaration,
  extractNode
};

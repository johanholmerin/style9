const t = require('@babel/types');
const { UNITLESS_NUMBERS, SHORTHAND_EXPANSIONS } = require('./constants.js');
const hash = require('murmurhash-js');

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

function getClass(...args) {
  return CLASS_PREFIX + hash(JSON.stringify(args)).toString(36);
}

function camelToHyphen(string) {
  return string.replace(/[A-Z]/g, c => `-${c.toLowerCase()}`);
}

/**
 * Resolve the value of a node path
 */
function resolvePathValue(path) {
  const { value, confident, deopt } = path.evaluate();
  if (confident) return value;
  throw deopt.buildCodeFrameError('Could not evaluate value');
}

function getDeclaration(prop, value) {
  const cls = getClass(prop, value);
  return `.${cls}{${camelToHyphen(prop)}:${normalizeValue(prop, value)}}`;
}

function normalizeTime(time) {
  if (time === 'from') return '0%';
  if (time === 'to') return '100%';
  return time;
}

function stringifyKeyframes(rules) {
  let str = '';

  for (const time in rules) {
    str += `${normalizeTime(time)}{`;

    for (const key in rules[time]) {
      const value = rules[time][key];

      for (const prop of expandProperty(key)) {
        // Longhand takes precedent
        if (prop in rules[time] && prop !== key) continue;

        str += `${camelToHyphen(prop)}:${normalizeValue(prop, value)};`;
      }
    }

    // Remove last semicolon
    str = str.slice(0, -1) + '}';
  }

  return str;
}

function getKeyframes(rules) {
  const rulesString = stringifyKeyframes(rules);
  const name = getClass(rulesString);
  const declaration = `@keyframes ${name}{${rulesString}}`;
  return { name, declaration };
}

/**
 * Move node to a constant and return an identifier
 */
function extractNode(path, node) {
  if (t.isIdentifier(node)) return node;

  const name = path.scope.generateUidBasedOnNode(node);

  if (path.scope.path.type !== 'Program') {
    path.scope.path.ensureBlock();
  }

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
  getClass,
  getDeclaration,
  extractNode,
  getKeyframes
};

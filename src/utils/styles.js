const cssProperties = require('known-css-properties').all;
const hash = require('murmurhash-js');
const { getIncrementalClass } = require('./incremental-classnames')();

const {
  UNITLESS_NUMBERS,
  COMMA_SEPARATED_LIST_PROPERTIES
} = require('./constants');

const BASE_FONT_SIZE_PX = 16;

function isCustomProperty(name) {
  return name.startsWith('--');
}

function mapValue(prop, value) {
  if (typeof value === 'number') {
    if (prop === 'fontSize') return `${value / BASE_FONT_SIZE_PX}rem`;
    if (!UNITLESS_NUMBERS.includes(prop)) return `${value}px`;
  }

  if (prop === 'transitionProperty') {
    return camelToHyphen(value);
  }

  return value;
}

function joinValues(prop, list) {
  const separator = COMMA_SEPARATED_LIST_PROPERTIES.includes(prop) ? ',' : ' ';

  return list.join(separator);
}

function normalizeValue(prop, value) {
  if (isCustomProperty(prop)) return value;

  if (Array.isArray(value)) {
    const mappedValues = value.map(val => mapValue(prop, val));
    return joinValues(prop, mappedValues);
  }

  return mapValue(prop, value);
}

// Class can't start with number
const CLASS_PREFIX = 'c';

function getHashClass(...args) {
  return hash(JSON.stringify(args)).toString(36);
}

function getClass(args, incremental) {
  const cls = getHashClass(args);
  if (!incremental) return CLASS_PREFIX + cls;
  return getIncrementalClass(cls);
}

function camelToHyphen(string) {
  if (isCustomProperty(string)) return string;
  return string.replace(/[A-Z]/g, c => `-${c.toLowerCase()}`);
}

function getDeclaration(
  { name, value, atRules, pseudoSelectors },
  incremental
) {
  const cls = getClass({ name, value, atRules, pseudoSelectors }, incremental);

  return (
    atRules.map(rule => rule + '{').join('') +
    '.' +
    cls +
    pseudoSelectors.join('') +
    '{' +
    camelToHyphen(name) +
    ':' +
    normalizeValue(name, value) +
    '}' +
    atRules.map(() => '}').join('')
  );
}

function normalizeTime(time) {
  if (time === 'from') return '0%';
  if (time === 'to') return '100%';
  return time;
}

function stringifyKeyframe(time, frame) {
  if (!Object.keys(frame).length) return '';

  const props = Object.entries(frame).map(([key, value]) => {
    return `${camelToHyphen(key)}:${normalizeValue(key, value)}`;
  });

  return `${normalizeTime(time)}{${props.join(';')}}`;
}

function stringifyKeyframes(rules) {
  return Object.entries(rules)
    .map(([time, frame]) => stringifyKeyframe(time, frame))
    .join('');
}

function getKeyframes(rules) {
  const rulesString = stringifyKeyframes(rules);
  const name = getClass(rulesString);
  const declaration = `@keyframes ${name}{${rulesString}}`;
  return { name, declaration };
}

const LEGACY_PSEUDO_ELEMENTS = [
  ':before',
  ':after',
  ':first-letter',
  ':first-line'
];

function normalizePseudoElements(string) {
  if (LEGACY_PSEUDO_ELEMENTS.includes(string)) {
    return ':' + string;
  }

  return string;
}

function minifyProperty(name) {
  const hyphenName = camelToHyphen(name);
  if (cssProperties.includes(hyphenName)) {
    return cssProperties.indexOf(hyphenName).toString(36);
  }

  return hash(hyphenName).toString(36);
}

// Values can be primitives or arrays, nested styles are plain objects
function isNestedStyles(item) {
  return typeof item === 'object' && !Array.isArray(item);
}

function isAtRule(string) {
  return string.startsWith('@');
}

function isPseudoSelector(string) {
  return string.startsWith(':');
}

function isAtRuleObject(name) {
  return name === '@media' || name === '@supports';
}

module.exports = {
  getClass,
  getDeclaration,
  getKeyframes,
  normalizePseudoElements,
  minifyProperty,
  isNestedStyles,
  normalizeValue,
  isAtRule,
  isPseudoSelector,
  isAtRuleObject
};

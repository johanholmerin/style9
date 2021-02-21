const {
  mapObject,
  mapObjectValues,
  filterObjectKeys
} = require('../utils/helpers');
const { minifyProperty } = require('../utils/styles');
const getStyleObjectValue = require('../helpers/get-style-object-value');
const generateClasses = require('../helpers/generate-classes');
const listStaticKeys = require('../helpers/list-static-keys');
const listReferences = require('../helpers/list-references');
const listDynamicKeys = require('../helpers/list-dynamic-keys');
const listFunctionCalls = require('../helpers/list-function-calls');
const normalizeArguments = require('../helpers/normalize-arguments');
const listFunctionCallKeys = require('../helpers/list-function-call-keys');
const generateStyles = require('../helpers/generate-styles');
const {
  replaceCreateCall,
  replaceFunctionCalls
} = require('../helpers/mutate-ast');
const { validateReferences } = require('../helpers/validate');

function normalizeFunctionCalls(callExpressions) {
  const entries = callExpressions.map(id => {
    return [id.parentPath, normalizeArguments(id.parentPath)];
  });
  return new Map(entries);
}

function minifyProperties(classes) {
  return mapObject(classes, ([key, value]) => {
    const minifiedName = minifyProperty(key);
    const isObject = typeof value === 'object';
    const minifiedValue = isObject ? minifyProperties(value) : value;

    return [minifiedName, minifiedValue];
  });
}

function transpileCreate(identifier, options) {
  const callExpr = identifier.parentPath.parentPath;
  const objExpr = callExpr.get('arguments.0');

  const styleDefinitions = getStyleObjectValue(objExpr);
  const styleClasses = generateClasses(styleDefinitions);
  const references = listReferences(callExpr.parentPath);

  validateReferences(references);

  const funcCalls = listFunctionCalls(references);
  const normalizedFuncCalls = normalizeFunctionCalls(funcCalls);

  const styleNames = Object.keys(styleDefinitions);
  const staticKeys = listStaticKeys(callExpr, styleNames);
  const dynamicKeys = listDynamicKeys(references, styleNames);
  const funcCallKeys = listFunctionCallKeys([...normalizedFuncCalls.values()]);
  const allKeys = [...staticKeys, ...dynamicKeys, ...funcCallKeys];

  const filteredDefinitions = filterObjectKeys(styleDefinitions, allKeys);
  const filteredStyleValues = filterObjectKeys(styleClasses, allKeys);

  const minifiedStyleValues = options.minifyProperties
    ? mapObjectValues(filteredStyleValues, minifyProperties)
    : filteredStyleValues;

  replaceCreateCall(callExpr, minifiedStyleValues);
  replaceFunctionCalls(normalizedFuncCalls, styleClasses);

  return generateStyles(filteredDefinitions);
}

module.exports = { transpileCreate };

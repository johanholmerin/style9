const t = require('@babel/types');
const { mapObject, removeDuplicates } = require('../utils/helpers');

function getConditionalArgs(args, classes) {
  const newArgs = [];
  let prevValue;

  // Iterate over args backwards. If a string literal is found, it means the
  // property is applied unconditionally, and the rest can be skipped
  for (let n = args.length - 1; n >= 0; n--) {
    const arg = args[n];
    const name = typeof arg === 'string' ? arg : arg.value;
    const cls = classes[name];

    if (cls === undefined) continue;

    if (typeof arg === 'string') {
      if (prevValue === cls) {
        // If the last last value is the same as the static value, the last
        // conditional can be skipped since both sides would be the same
        const last = newArgs.pop();
        newArgs.push(last.value);
      } else {
        newArgs.push(t.stringLiteral(cls + ' '));
      }

      return newArgs;
    }

    newArgs.push({
      test: arg.test,
      value: t.stringLiteral(cls + ' ')
    });
    prevValue = cls;
  }

  if (newArgs.length) {
    newArgs.push(t.stringLiteral(''));
  }

  return newArgs;
}

function listObjectsProperties(classObj) {
  return removeDuplicates(
    Object.values(classObj).flatMap(obj => Object.keys(obj))
  );
}

function getObjectsProp(object, prop) {
  return mapObject(object, ([key, val]) => [key, val[prop]]);
}

function generateExpression(args, classObject) {
  const conditionals = listObjectsProperties(classObject)
    .map(prop => getObjectsProp(classObject, prop))
    .map(classes => getConditionalArgs(args, classes))
    .filter(conditionalArgs => conditionalArgs.length)
    .map(conditionalArgs =>
      conditionalArgs.reduceRight((acc, prop) =>
        t.conditionalExpression(prop.test, prop.value, acc)
      )
    );

  if (!conditionals.length) {
    return t.stringLiteral('');
  }

  const binaryExpression = conditionals.reduceRight((acc, expr) =>
    t.binaryExpression('+', expr, acc)
  );

  return t.expressionStatement(binaryExpression);
}

module.exports = generateExpression;

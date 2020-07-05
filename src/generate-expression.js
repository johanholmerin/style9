const t = require('@babel/types');
const assert = require('assert');

function getConditionalArgs(args, classes) {
  const newArgs = [];
  let prevValue;

  // Iterate over args backwards until the end or a string literal is found
  for (let n = args.length - 1; n >= 0; n--) {
    const arg = args[n];
    const name = typeof arg === 'string' ? arg : arg.value;
    const cls = classes[name];

    assert(name in classes, `Property ${name} does not exist in style object`);
    // Style doesn't have this property
    if (!cls) continue;

    if (typeof arg === 'string') {
      if (prevValue === cls) {
        // If the last two values are the same, the test can be skipped
        const last = newArgs.pop();
        newArgs.push(last.value);
      } else {
        newArgs.push(t.stringLiteral(cls + ' '));
      }

      return newArgs;
    }

    if (prevValue !== cls) {
      newArgs.push({
        test: arg.test,
        value: t.stringLiteral(cls + ' ')
      });
    }
    prevValue = cls;
  }

  if (newArgs.length) {
    newArgs.push(t.stringLiteral(''));
  }

  return newArgs;
}

function generateExpression(args, classObj) {
  const usedProps = Object.values(classObj)
    .flatMap(obj => Object.keys(obj))
    // Remove duplicates
    .filter((prop, index, array) => array.indexOf(prop) === index);

  const conditionals = usedProps.map(prop => {
    const classes = Object.fromEntries(
      Object.entries(classObj).map(([key, val]) => [key, val[prop]])
    );

    const conditionalArgs = getConditionalArgs(args, classes);
    if (!conditionalArgs.length) return;

    return conditionalArgs.reduceRight((acc, prop) => {
      return t.conditionalExpression(prop.test, prop.value, acc);
    });
  }).filter(Boolean);

  const additions = conditionals.reduceRight((acc, expr) => {
    return t.binaryExpression('+', expr, acc)
  });

  return t.expressionStatement(additions);
}

module.exports = generateExpression;

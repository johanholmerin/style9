/*
MIT License

Copyright (c) 2014-present Sebastian McKenzie and other contributors

https://git.io/JtdzW
*/

const assert = require('assert');
const t = require('@babel/types');

module.exports = function translateEnumValues(path) {
  const seen = Object.create(null);
  // Start at -1 so the first enum member is its increment, 0.
  let prev = -1;
  return path.node.members.map(member => {
    const name = t.isIdentifier(member.id) ? member.id.name : member.id.value;
    const initializer = member.initializer;
    let value;
    if (initializer) {
      const constValue = evaluate(initializer, seen);
      if (constValue !== undefined) {
        seen[name] = constValue;
        if (typeof constValue === 'number') {
          value = t.numericLiteral(constValue);
          prev = constValue;
        } else {
          assert(typeof constValue === 'string');
          value = t.stringLiteral(constValue);
          prev = undefined;
        }
      } else {
        value = initializer;
        prev = undefined;
      }
    } else {
      if (prev !== undefined) {
        prev++;
        value = t.numericLiteral(prev);
        seen[name] = prev;
      } else {
        throw path.buildCodeFrameError('Enum member must have initializer.');
      }
    }

    return [name, value];
  });
};

// Based on the TypeScript repository's `evalConstant` in `checker.ts`.
function evaluate(expr, seen) {
  return evalConstant(expr);

  function evalConstant(expr) {
    switch (expr.type) {
      case 'StringLiteral':
        return expr.value;
      case 'UnaryExpression':
        return evalUnaryExpression(expr);
      case 'BinaryExpression':
        return evalBinaryExpression(expr);
      case 'NumericLiteral':
        return expr.value;
      case 'ParenthesizedExpression':
        return evalConstant(expr.expression);
      case 'Identifier':
        return seen[expr.name];
      case 'TemplateLiteral':
        if (expr.quasis.length === 1) {
          return expr.quasis[0].value.cooked;
        }
      /* falls through */
      default:
        return undefined;
    }
  }

  function evalUnaryExpression({ argument, operator }) {
    const value = evalConstant(argument);
    if (value === undefined) {
      return undefined;
    }

    switch (operator) {
      case '+':
        return value;
      case '-':
        return -value;
      case '~':
        return ~value;
      default:
        return undefined;
    }
  }

  function evalBinaryExpression(expr) {
    const left = evalConstant(expr.left);
    if (left === undefined) {
      return undefined;
    }
    const right = evalConstant(expr.right);
    if (right === undefined) {
      return undefined;
    }

    switch (expr.operator) {
      case '|':
        return left | right;
      case '&':
        return left & right;
      case '>>':
        return left >> right;
      case '>>>':
        return left >>> right;
      case '<<':
        return left << right;
      case '^':
        return left ^ right;
      case '*':
        return left * right;
      case '/':
        return left / right;
      case '+':
        return left + right;
      case '-':
        return left - right;
      case '%':
        return left % right;
      default:
        return undefined;
    }
  }
}

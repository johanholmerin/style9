function listFunctionCallKeys(functionCallArgs) {
  return functionCallArgs.flatMap(args => {
    return args.map(arg => {
      const isString = typeof arg === 'string';
      return isString ? arg : arg.value;
    });
  });
}

module.exports = listFunctionCallKeys;

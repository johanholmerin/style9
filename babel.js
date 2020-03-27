const NAME = require('./package.json').name;
const handleBindings = require('./src/handle-bindings.js');

module.exports = function style9BabelPlugin() {
  return {
    name: NAME,
    visitor: {
      ImportDefaultSpecifier(path, state) {
        if (path.parent.source.value !== NAME) return;

        const importName = path.node.local.name;
        const bindings = path.scope.bindings[importName].referencePaths;

        state.file.metadata.style9 = handleBindings(bindings)
          // Remove duplicates
          .filter((e, i, a) => a.indexOf(e) === i)
          .sort()
          .join('');
      }
    }
  };
}

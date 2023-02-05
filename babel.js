const NAME = require('./package.json').name;
const processReferences = require('./src/process-references.js');

/**
 * @returns {import('@babel/core').PluginObj}
 */
module.exports = function style9BabelPlugin() {
  return {
    name: NAME,
    visitor: {
      ImportDefaultSpecifier(path, state) {
        if (path.parent.source.value !== NAME) return;

        const importName = path.node.local.name;
        const bindings = path.scope.bindings[importName].referencePaths;

        const css = processReferences(bindings, state.opts).join('');
        if (!state.file.metadata.style9) {
          state.file.metadata.style9 = '';
        }
        state.file.metadata.style9 += css;
      },
      VariableDeclaration(path, state) {
        for (const { node } of path.get('declarations')) {
          // process require('style9')
          if (
            node.init?.type === 'CallExpression' &&
            node.init?.callee.type === 'Identifier' &&
            node.init?.callee.name === 'require' &&
            node.init?.arguments.length === 1 &&
            node.init?.arguments[0].type === 'StringLiteral' &&
            node.init?.arguments[0].value === NAME &&
            node.id.type === 'Identifier'
          ) {
            const importName = node.id.name;
            const bindings = path.scope.bindings[importName].referencePaths;

            const css = processReferences(bindings, state.opts).join('');
            if (!state.file.metadata.style9) {
              state.file.metadata.style9 = '';
            }
            state.file.metadata.style9 += css;
          }
        }
      }
    }
  };
};

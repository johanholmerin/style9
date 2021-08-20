const { Transformer } = require('@parcel/plugin');
const { transformFromAstAsync } = require('@babel/core');
const { generate, parse } = require('@parcel/babel-ast-utils');

module.exports = new Transformer({
  canReuseAST() {
    return false;
  },

  async parse({ asset, options }) {
    if (!asset.isSource) {
      return undefined;
    }

    const code = await asset.getCode();
    if (code.indexOf('style9') === -1) {
      return undefined;
    }

    return parse({
      asset,
      code,
      options
    });
  },

  async transform({ asset, config }) {
    const ast = await asset.getAST();
    if (!asset.isSource || !ast) {
      return [asset];
    }

    const code = asset.isASTDirty() ? undefined : await asset.getCode();

    const result = await transformFromAstAsync(ast.program, code, {
      code: false,
      ast: true,
      filename: asset.filePath,
      babelrc: false,
      configFile: false,
      sourceMaps: true,
      plugins: [
        [
          'style9/babel',
          {
            ...config
          }
        ]
      ]
    });

    const assets = [asset];

    if (result.ast) {
      asset.setAST({
        type: 'style9',
        program: result.ast
      });
    }

    if (result.metadata.style9) {
      const uniqueKey = `${asset.id}-css`;
      assets.push({
        type: 'css',
        content: result.metadata.style9,
        uniqueKey
      });
      asset.addDependency({
        specifier: uniqueKey,
        specifierType: 'esm'
      });
    }

    return assets;
  },

  generate({ asset, ast, options }) {
    return generate({ asset, ast, options });
  }
});

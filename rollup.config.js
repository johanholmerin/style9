/** @type {import('rollup').RollupOptions} */
const config = {
  input: 'src/index.js',
  output: [
    ...['dist/index.js', 'dist/index.cjs'].map(file => ({
      file,
      format: 'commonjs',
      exports: 'auto'
    })),
    ...['dist/index.mjs', 'dist/index.m.js'].map(file => ({
      file,
      format: 'es'
    }))
  ]
};

export default config;

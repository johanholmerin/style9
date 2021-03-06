import resolve from '@rollup/plugin-node-resolve';
import style9 from 'style9/rollup';

export default {
  input: 'src/main.js',
  output: {
    file: 'build/main.js',
    format: 'es'
  },
  plugins: [
    resolve(),
    style9({
      fileName: 'index.css'
    })
  ]
};

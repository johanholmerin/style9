import style9 from 'style9/vite';

export default {
  plugins: [
    style9({
      exclude: '*.html',
      fileName: 'index.css'
    })
  ]
}

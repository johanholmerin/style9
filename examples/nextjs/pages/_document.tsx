import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document'
import style9 from 'style9';

const styles = style9.create({
  test: {
    backgroundColor: 'coral'
  }
})

class MyDocument extends Document {
  static async getInitialProps(ctx:DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx)
    const styles = style9.flush()
    return {
      ...initialProps,
      styles: (
        <>
          {initialProps.styles}
          <style>{styles}</style>
        </>
      )
    }
  }

  render() {
    return (
      <Html>
        <Head />
        <body className={styles('test')}>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
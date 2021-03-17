import Head from 'next/head'
import style9 from 'style9';
import { layout } from '../shared/styles';

const styles = style9.create({
  container: {
    minHeight: '100vh',
    paddingLeft: '.5rem',
    paddingRight: '.5rem',
  },
  title: {
    margin: 0,
    lineHeight: 1.15,
    fontSize: '4rem',
    textAlign: 'center'
  }
});

export default function Home() {
  return (
    <div className={style9(styles.container, layout.center)}>
      <Head>
        <title>Create Next App</title>
      </Head>

      <main>
        <h1 className={styles('title')}>
          Hello world!
        </h1>
      </main>
    </div>
  )
}

export const shared = { ...styles };

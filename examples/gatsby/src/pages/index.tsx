import * as React from 'react';
import style9 from 'style9';

const styles = style9.create({
  container: {
    minHeight: '100vh',
    paddingLeft: '.5rem',
    paddingRight: '.5rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    margin: 0,
    lineHeight: 1.15,
    fontSize: '4rem',
    textAlign: 'center'
  }
});

export default function IndexPage() {
  return (
    <div className={styles('container')}>
      <main>
        <h1 className={styles('title')}>
          Hello world!
        </h1>
      </main>
    </div>
  )
}

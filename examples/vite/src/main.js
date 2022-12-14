if (Math.random() > 0.5) {
  import('./a').then(() => import('./b'));
} else {
  import('./b').then(() => import('./a'));
}

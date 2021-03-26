#!/bin/sh

set -e

for file in `ls -1 examples`;
do
  (cd "examples/$file" && yarn --frozen-lockfile && yarn build);
done;

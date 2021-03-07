#!/bin/sh

set -e

for file in `ls -1 examples`;
do
  (cd "examples/$file" && yarn && yarn build);
done;

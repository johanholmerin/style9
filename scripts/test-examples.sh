#!/bin/sh

set -e

(cd parcel && yarn --frozen-lockfile);

for file in `ls -1 examples`;
do
  (cd "examples/$file" && yarn --frozen-lockfile && yarn build);
done;

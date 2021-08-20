# parcel-transformer-style9

**Experimental**

Parcel 2 plugin for [style9](https://github.com/johanholmerin/style9)

## Install

```sh
# Yarn
yarn add parcel-transformer-style9 style9

# npm
npm install parcel-transformer-style9 style9
```

## Parcel config

```json
// .parcelrc
{
  "extends": "@parcel/config-default",
  "transformers": {
    "*.js": ["parcel-transformer-style9", "@parcel/transformer-js"]
  }
}
```

```json
// .cssnanorc
{
  "plugins": ["style9/css"]
}
```

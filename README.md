# bos-loader
=======

[![NPM version](https://img.shields.io/npm/v/bos-loader.svg?style=flat)](https://npmjs.com/package/bos-loader)
[![NPM downloads](https://img.shields.io/npm/dm/bos-loader.svg?style=flat)](https://npmjs.com/package/bos-loader)

webpack loader for bos cdn

## Install

``` bash
# use npm
npm install bos-loader

# use yarn
yarn add bos-loader
```

## Usage

``` javascript
// webpack.config.js

// develop mode
{
    module: {
        loaders: [{
            // base64 : size < 8192 byte
            // img/   : 8192 byte < size < 50000 byte
            // bos    : size > 50000 byte
            test: /\.(png|jpg|gif)$/,
            loader: 'bos?limit=10000&name=img/[name]_[hash:8].[ext]' + (DEBUG ? '' : '&upload=50000')
        }]
    }
}

// production mode should append
{
    bos: {
        bucket: '$bucket',
        endpoint: '$endpoint',
        ak: '$ak',
        sk: '$sk',
        prefix: '$prefix'
    }
}
```


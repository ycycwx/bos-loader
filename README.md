# bos-loader
webpack loader for baidu bos cdn

# install
``` bash
npm install bos-loader
```

# usage
``` javascript
// webpack.config.js

// develop mode
{
    module: {
        loaders: [{
            // 小于8192byte的图片转成base64码
            test: /\.(png|jpg|gif)$/,
            loader: 'bos-loader?limit=8192' + (isProduction ? '&upload' : '')
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
        prefix: '$prefix' // 替换时候的前缀
    }
}
```

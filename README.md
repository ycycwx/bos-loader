# bos-loader
webpack loader for baidu bos

# usage
```javascript
// webpack.config.js

{
    resolveLoader: {
        alias: {
            'bos-loader': `_dir_your_path_`
        }
    },
    module: {
        loaders: [{
            // 小于8192byte的图片转成base64码
            test: /\.(png|jpg|gif)$/,
            loader: 'bos-loader?limit=8192' + (isProduction ? '&upload' : '')
        }]
    }
}

if (isProduction) {
{
    bos: {
        bucket: '$bucket',
        endpoint: '$endpoint',
        ak: '$ak',
        sk: '$sk',
        prefix: '$prefix' // 替换时候的前缀
    }
}
)
```

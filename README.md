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
            // 8192byte - 50000byte之间的会重命名并打包进img文件夹内
            // 大于50000byte的图片会重命名并打包进img文件夹内
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
        prefix: '$prefix' // 替换时候的前缀
    }
}
```

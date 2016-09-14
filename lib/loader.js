/**
 * @file bos-loader for webpack devServer & build
 * @author ycy
 */

var path = require('path');
var loaderUtils = require('loader-utils');
var mime = require('mime');
var bce = require('baidubce-sdk');

/**
 * 缓存访问过的元素
 *
 * @type {Object}
 */
var cache = {};

module.exports = function (content) {
    this.cacheable && this.cacheable();

    var query = loaderUtils.parseQuery(this.query);
    var limit = (this.options && this.options.url && this.options.url.dataUrlLimit) || 0;
    if (query.limit) {
        limit = parseInt(query.limit, 10);
    }

    var mimetype = query.mimetype || query.minetype || mime.lookup(this.resourcePath);
    // 如果小于`limit`，打包成`base64`
    if (limit <= 0 || content.length < limit) {
        return 'module.exports = '
            + JSON.stringify('data:' + (mimetype ? mimetype + ';' : '') + 'base64,' + content.toString('base64'));
    }

    var url = loaderUtils.interpolateName(this, query.name, {
        context: query.context || this.options.context,
        content: content,
        regExp: query.regExp
    });

    // `production`模式才开启上传
    if (query.upload) {
        var uploadLimit = parseInt(query.upload || 0, 10);
        // 如果`upload`参数存在并且大于等于`limit`且小于`upload`，走`file-uploader`
        if (uploadLimit && limit <= content.length && content.length < uploadLimit) {
            var fileLoader = require('file-loader');
            return fileLoader.call(this, content);
        }

        // 如果`upload`参数存在且`content`大于`upload`
        // 或者没有设置`upload`的值
        // 则上传`baidu-bos`
        var callback = this.async();
        var prefix = this.options.bos.prefix;
        var result = 'module.exports = "' + prefix + url + '";';

        // 如果不在cache中
        if (!cache[url]) {
            var config = this.options.bos || {};
            var bosClientConfig = {
                credentials: {
                    ak: config.ak,
                    sk: config.sk
                },
                endpoint: config.endpoint
            };
            var client = new bce.BosClient(bosClientConfig);
            var bucket = config.bucket;
            var options = {
                'Content-Type': bce.MimeType.guess(path.extname(url))
            };

            client.putObject(bucket, url, content, options).then(function (response) {
                // `cache`
                cache[url] = true;
                callback(null, result);
            }).catch(function (error) {
                /* eslint-disable no-console */
                console.log(error);
                /* eslint-enable no-console */
                callback(error);
            });
        }
        // 如果在`cache`中证明已经上传完成
        else {
            callback(null, result);
        }
    }

    // `development`模式不需要上传
    // for devServer
    else {
        // `devServer`模式仍需要`emitFile`
        // 否则体积超过`limit`的文件无法显示
        this.emitFile(url, content);
        return 'module.exports = __webpack_public_path__ + ' + JSON.stringify(url) + ';';
    }
};

module.exports.raw = true;


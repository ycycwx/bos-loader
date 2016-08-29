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
    if (limit <= 0 || content.length < limit) {
        return 'module.exports = ' + JSON.stringify('data:' + (mimetype ? mimetype + ';' : '') + 'base64,' + content.toString('base64'));
    }

    var url = loaderUtils.interpolateName(this, query.name, {
        context: query.context || this.options.context,
        content: content,
        regExp: query.regExp
    });

    // `development`模式不需要上传
    // `production`模式才开启上传
    if (query.upload) {
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
                console.log(error);
                callback(error);
            });
        }
        // 如果在cache中证明已经上传完成
        else {
            callback(null, result);
        }
    }
    // for devServer
    else {
        // `devServer`模式仍需要`emitFile`
        // 否则体积超过limit的文件无法显示
        this.emitFile(url, content);
        return 'module.exports = __webpack_public_path__ + ' + JSON.stringify(url) + ';';
    }
};

module.exports.raw = true;


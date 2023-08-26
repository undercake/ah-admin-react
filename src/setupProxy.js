const { createProxyMiddleware } = require('http-proxy-middleware');
console.log('proxy started')
module.exports = function (app) {
    app.use(
        createProxyMiddleware('/api',
            {
                target: 'http://xxx', //转发到的域名或者ip地址
                pathRewrite: {
                    '/midas/:path*': 'https://manage.kmahjz.com.cn/midas/:path*', //接口地址里没有"/api",将其重写置空
                    '/static/:path*': 'https://manage.kmahjz.com.cn/static/:path*', //接口地址里没有"/api",将其重写置空
                    '/upload/:path*': 'https://manage.kmahjz.com.cn/upload/:path*', //接口地址里没有"/api",将其重写置空
                },
                changeOrigin: true, //必须设置为true
                secure: false //是否验证https的安全证书，如果域名是https需要配置此项
            }
        )
    );
};
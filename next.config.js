/** @type {import('next').NextConfig} */

const nextConfig = {
    experimental: {
        appDir: true
    },
    async rewrites() {
        return [
            {
                source: '/midas/:path*',
                destination: 'http://test.kmahjz.com.cn/midas/:path*'
            },
            {
                source: '/static/:path*',
                destination: 'http://test.kmahjz.com.cn/static/:path*'
            },
            {
                source: '/upload/:path*',
                destination: 'http://test.kmahjz.com.cn/upload/:path*'
            }
        ];
    },
    postcss: {
        plugins: [require('tailwindcss'), require('autoprefixer')]
    }
};

module.exports = nextConfig;

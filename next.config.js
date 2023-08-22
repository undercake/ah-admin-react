/** @type {import('next').NextConfig} */
const nextConfig =
// {
//     env:{
//         _ENV: 'development',
//     },
//     experimental: {
//         appDir: true
//     },
//     async rewrites() {
//         return [
//             {
//                 source: '/midas/:path*',
//                 destination: 'https://manage.kmahjz.com.cn/midas/:path*'
//             },
//             {
//                 source: '/static/:path*',
//                 destination: 'https://manage.kmahjz.com.cn/static/:path*'
//             },
//             {
//                 source: '/upload/:path*',
//                 destination: 'https://manage.kmahjz.com.cn/upload/:path*'
//             }
//         ];
//     },
//     postcss: {
//         plugins: [require('tailwindcss'), require('autoprefixer')]
//     }
// };
{
    output: 'export',
    // images: { unoptimized: true },
    postcss: {
        plugins: [require('tailwindcss'), require('autoprefixer')]
    }
};

module.exports = nextConfig;

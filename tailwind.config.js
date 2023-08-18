/** @type {import('tailwindcss').Config} */
module.exports = {

    mode: 'jit',
    // These paths are just examples, customize them to match your project structure
    purge: [
        './public/**/*.html',
        './src/**/*.{js,jsx,ts,tsx}',
    ],
    content: ['./src/pages/**/*.{js,ts,jsx,tsx}', './src/components/**/*.{js,ts,jsx,tsx}', './src/app/**/*.{js,ts,jsx,tsx}'],
    darkMode: 'class', // 启用暗黑模式
    plugins: [],
    theme: {
        extend: {
            colors: {
                purple: {
                    light: 'rgb(237, 231, 246)',
                    lightest: 'rgba(112, 63, 197, .5)',
                    lighter: 'rgb(112, 63, 197)',
                    DEFAULT: 'rgb(103, 58, 183)',
                    dark: 'rgb(103, 58, 183)',
                    darker: 'rgb(94, 53, 177)',
                    darkest: 'rgba(94, 53, 177, .5)',
                },
                gray: {
                    900: '#121212',
                    1080: 'rgb(36 36 36)'
                }
            },
            borderRadius: {
                '4xl': '2rem'
            },
            spacing: {
                22: '5.5rem',
                61: '15.25rem',
                62: '15.75rem',
                72: '18rem',
                84: '21rem',
                96: '24rem'
            },
            transitionProperty: {
                height: 'height',
                width: 'width',
                spacing: 'margin, padding'
            }
        }
    }
};

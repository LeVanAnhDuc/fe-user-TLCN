/** @type {import('tailwindcss').Config} \*/
// eslint-disable-next-line no-undef
module.exports = {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        screens: {
            xs: '540px',
            sm: '640px',
            md: '768px',
            lg: '1024px',
            xl: '1280px',
            '2xl': '1536px',
        },
        fontFamily: {
            sans: ['Graphik', 'sans-serif'],
            serif: ['Merriweather', 'serif'],
        },
        extend: {
            backgroundColor: {
                header: 'white',
                footer: '#787A91',
                headerProfile: '#FFEEE8',
                review: '#F3EEEA',
            },
            spacing: {
                18: '4.5rem',
                120: '30rem',
                128: '32rem',
                140: '35rem',
                144: '36rem',
                148: '37rem',
                152: '38rem',
                156: '39rem',
            },
            borderColor: {
                headerProfile: '#FFEEE8',
            },
            darkSelector: '.dark-mode',
        },
    },
    plugins: [],
};

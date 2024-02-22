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
        extend: {
            backgroundColor: {
                headerProfile: '#FFEEE8',
                review: '#F3EEEA',
            },
            colors: {
                primary: {
                    50: '#e0f7fa',
                    100: '#b2ebf2',
                    200: '#80deea',
                    300: '#4dd0e1',
                    400: '#26c6da',
                    500: '#00bcd4',
                    600: '#00acc1',
                    700: '#0097a7',
                    800: '#00838f',
                    900: '#006064',
                },
            },
            backgroundImage: {
                'login-banner': "url('./src/assets/img/login/banner-login.png')",
                'register-banner': "url('./src/assets/img/register/banner-register.png')",
                'forgotPassword-banner': "url('./src/assets/img/forgotPassword/banner-forgotPassword.png')",
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

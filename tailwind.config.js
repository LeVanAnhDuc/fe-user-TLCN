/** @type {import('tailwindcss').Config} \*/
// eslint-disable-next-line no-undef
module.exports = {
    darkMode: 'class',
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        screens: {
            sm: '640px',
            md: '768px',
            lg: '1024px',
            xl: '1280px',
            '2xl': '1536px',
        },
        extend: {
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
                dark: {
                    50: '#E5E7EB',
                    100: '#D1D5DB',
                    200: '#9CA3AF',
                    300: '#6B7280',
                    400: '#4B5563',
                    500: '#374151',
                    600: '#1F2A37',
                    700: '#111928',
                },
            },
            backgroundImage: {
                'login-banner': "url('./src/assets/img/login/banner.png')",
                'register-banner': "url('./src/assets/img/register/banner.png')",
                'forgotPassword-banner': "url('./src/assets/img/forgotPassword/banner.png')",
                'home-banner': "url('./src/assets/img/home/banner.png')",
            },
        },
    },
    plugins: [],
};

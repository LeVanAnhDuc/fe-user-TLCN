import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://dev-online-gateway.ghn.vn/shiip/public-api',
    timeout: 30000,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    },
});

instance.interceptors.request.use(
    function (config) {
        const token = import.meta.env.VITE_TOKEN_GHN;

        if (token) {
            config.headers['token'] = token;
        }

        return config;
    },
    function (error) {
        return Promise.reject(error);
    },
);

instance.interceptors.response.use(
    function (response) {
        return response;
    },
    function (error) {
        const res = { data: '', status: '', headers: '' };
        if (error.response) {
            res.data = error.response.data;
            res.status = error.response.status;
            res.headers = error.response.headers;
        } else if (error.request) {
            console.log('check API error >>>', error);
        } else {
            console.log('Error Something', error.message);
        }

        return res;
    },
);

export default instance;

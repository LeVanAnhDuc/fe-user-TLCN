// libs
import axios from 'axios';
const baseURL = import.meta.env.VITE_BASE_URL_GHN;

const instance = axios.create({
    baseURL: baseURL,
    timeout: 30000,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    },
});

instance.interceptors.request.use(
    function (config) {
        const token = import.meta.env.VITE_TOKEN_GHN;
        const shop_id = import.meta.env.VITE_SHOP_ID_GHN;

        if (token) {
            config.headers['token'] = token;
            config.headers['shop_id'] = shop_id;
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

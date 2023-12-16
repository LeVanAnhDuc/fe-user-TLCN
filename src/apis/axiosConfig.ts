import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://duckshop.onrender.com/api/v1',
    timeout: 3000000, // Thời gian timeout cho mỗi request
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    },
});
// Add a request interceptor
instance.interceptors.request.use(
    function (config) {
        // Do something before request is sent
        const accessToken = localStorage.getItem('accessToken'); // Lấy token từ localStorage
        const tokenType = localStorage.getItem('tokenType'); // Lấy tokenType từ localStorage

        if (accessToken) {
            config.headers['Authorization'] = `${tokenType} ${accessToken}`;
        }
        return config;
    },
    function (error) {
        // Do something with request error
        return Promise.reject(error);
    },
);

// Add a response interceptor
instance.interceptors.response.use(
    function (response) {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        return response;
    },
    function (error) {
        const res = { data: '', status: '', headers: '' };
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            res.data = error.response.data;
            res.status = error.response.status;
            res.headers = error.response.headers;
        } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser
            // and an instance of http.ClientRequest in node.js
            console.log('check API error >>>', error);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
        }

        return res;
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        // return Promise.reject(error);
    },
);
export default instance;

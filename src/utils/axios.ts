import axios from 'axios';
import type { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { ElNotification } from 'element-plus'


const service: AxiosInstance = axios.create({
    baseURL: 'https://www.demo.com',  // 后面我们会把它替换成环境变量
    timeout: 5000
})

// 添加请求拦截器
service.interceptors.request.use(function (config: InternalAxiosRequestConfig) {
    // 在发送请求之前做些什么
    return config;
}, function (error: AxiosError) {
    // 对请求错误做些什么
    ElNotification({
        title: 'Error',
        message: error.message,
        type: 'error'
    })
    return Promise.reject(error);
});

// 添加响应拦截器
service.interceptors.response.use(function (response: AxiosResponse) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么

    //这里处理的逻辑是登录密码错误，给个错误提示。axios请求是发送成功了，返回的数据里有code=200。而非200则表示登录不成功
    if (response.data.code != 200) {
        ElNotification({
            title: 'Error',
            message: response.data.message,
            type: 'error'
        })
    } else {
        return response.data;
    }

}, function (error: AxiosError) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    ElNotification({
        title: 'Error',
        message: error.message,
        type: 'error'
    })
    return Promise.reject(error);
});

export default service
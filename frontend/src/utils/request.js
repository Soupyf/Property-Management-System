import axios from "axios";
import router from "../router";
import { Message } from "element-ui";
const request = axios.create({
    //zzy
    // baseURL: 'http://10.21.144.44:8080',
    //fcc
    // baseURL: 'http://10.16.41.156:8080',
    //tyf
    baseURL: 'http://10.16.42.166:8080',
    timeout: 10000
})

//请求拦截器  在发请求前，进行统一的修改
request.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')
        if (token) config.headers.Authorization = `${token}`
        return config
    },
    (error) => Promise.reject(error)
)

request.interceptors.response.use(function (response) {
    if (response.data.code == 100000 || response.data.code == 100000) {
        Message.error(response.data.message)
        router.push({ path: "/administratorLogin" });
        return Promise.reject(new Error(response.data.message))
    } else if (response.data.code == 99999) {
        return Promise.reject(new Error(response.data.message))
    } else if (response.data.code == 100001) {
        Message.error(response.data.message)
        router.push({ path: "/userLogin" });
        return Promise.reject(new Error(response.data.message))
    }
    return response
}, function (err) {
    return Promise.reject(err)
})

export default request
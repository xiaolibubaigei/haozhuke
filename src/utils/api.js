import axios from "axios";
import {BASE_URL} from "./url";
import {getToken, removeToken} from "./auth";

//创建axios示例
const API = axios.create({
        baseURL: BASE_URL
    }
)

//添加请求拦截器
API.interceptors.request.use(config => {
    // console.log('123', config, config.url)
    //拿到请求地址
    const {url} = config
    if (
        //不需要加入鉴权路由的地址
        url.startsWith('/user') &&
        !url.startsWith('/user/login'),
            !url.startsWith('/user/registered')

    ) {
        //    添加请求头
        config.headers.Authorization = getToken()
    }
    return config
})
//添加响应拦截器
API.interceptors.response.use(response => {
    // console.log(response)
    //获取状态码
    const {status} = response.data
    if (status === 400) {
        // 说明token失效获取过期了，直接调用removeToken
        removeToken()
    }
    return response
})
//抛出地址
export {API}
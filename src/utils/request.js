import axios from "axios";
import ls from "@/utils/lsUtil";
import { ACCESS_TOKEN } from "@/store/mutation-types";
import store from "@/store/index";

const service = axios.create({
    baseURL: 'http://127.0.0.1:9999/api/v1/',
    timeout: 6000
})

const err = error => {
    return Promise.reject(error)
}

service.interceptors.request.use(config => {
    const token = ls.get_value(ACCESS_TOKEN)
    if (token) {
        config.headers[ACCESS_TOKEN] = token
    }
    return config
}, err)

service.interceptors.response.use(response => {
    let newToken = response.headers['authorization'];
    if (newToken) {
        store.commit('SET_TOKEN', newToken)
        ls.set_value(ACCESS_TOKEN, newToken, 5*60*1000+100)
    }
    if (response.status === 401) {
        console.log('401')
        store.commit('SET_TOKEN', '')
        ls.remove(ACCESS_TOKEN)
        return response
    }
    return response.data
}, err)

export default service

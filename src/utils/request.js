/* 对axios根据业务需求再次封装 */
import axios from 'axios'
import { Toast, Dialog } from 'vant'
import { getToken } from './auth'
import store from '@/store'
import { USER_TOKEN } from '@/utils/constant'
import Router from '@/router'
import defaultSettings from '@/settings'
// 创建axios实例
const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_API,
    timeout: 10000,
})

// 请求拦截器
service.interceptors.request.use(
    config => {
        if (store.getters.token) {
            // 让请求携带token
            config.headers['token'] = getToken(USER_TOKEN)
        }
        return config
    },
    error => {
        // console.log('request-error:', error)

        return Promise.reject(error)
    }
)

// 响应拦截器
service.interceptors.response.use(
    response => {
        // 拦截文件流
        const headers = response.headers
        if (headers['content-type'] === 'application/octet-stream') {
            return response.data
        }

        const res = response.data
        if (res.code === 200) {
            //响应成功
            return res.data
        } else {
            // 2004:  token 无效; 2005:  token 过期;
            if (res.code === 2004 || res.code === 2005) {
                // to re-login 不在白名单中就提示重新登录并且刷新当前页面
                if (
                    !defaultSettings.whiteList.includes(
                        Router.history.current.path
                    )
                ) {
                    Dialog.alert({
                        message: '您必须重新登录！',
                    }).then(() => {
                        console.log('重新登录确定')
                        store.dispatch('user/resetToken').then(() => {
                            location.reload()
                        })
                    })
                }
            } else if (res.code === 2001 || res.code === 2003) {
                // 不需要弹窗的情况
                // 微信没有绑定手机号的情况下
                return Promise.reject(res)
            } else {
                /* 其他的情况 */
                Toast({
                    message: res.msg || 'response error',
                    duration: 5 * 1000,
                })
                return Promise.reject(res)
            }
        }
    },
    error => {
        if (error.response.status > 500 && error.response.status < 506) {
            Toast('服务器错误')
        } else {
            Toast(error.msg)
        }
        return Promise.reject(error)
    }
)

export default service

import store from '@/store'
import router from '@/router'
import wx from 'weixin-js-sdk'

import {
    getSignature,
    getWechatUserByCode,
    loginByWechatOpenId,
} from '@/api/weChat'
import {
    SET_OPENID,
    OPENID,
    SET_USERINFO,
    SET_TOKEN,
    TO_URL,
    USER_TOKEN,
} from '@/utils/constant'
import { getToken } from '@/utils/auth'
import { Toast } from 'vant'

export default {
    /* wechat jssdk配置接入 'wx3b5e6070b4241088' */
    appid: process.env.VUE_APP_WECHAT_APPID,
    // appid: 'wx3b5e6070b4241088',
    getCode() {
        const code = location.href.split('?')[1]
        if (!code) return {}
        const obj = {}
        code.split('&').forEach(item => {
            const arr = item.split('=')
            obj[arr[0]] = arr[1]
        })
        return obj
    },
    // 用opengID登录
    loginWithOpenId(openId) {
        const path = localStorage.getItem(TO_URL)
        loginByWechatOpenId(openId)
            .then(data => {
                // console.log('通过openid获取token成功')
                // console.log('token---', data)
                store.commit(`user/${SET_TOKEN}`, data.token)
                // 跳转到存储的原来的url
                // if (path.includes('/invite/accept')) {
                //   // console.log('执行了接受邀请的操作了')
                //   this.acceptInvitation()
                // } else {
                router.replace({
                    path,
                })
                // }
            })
            .catch(err => {
                // console.log('通过openid获取token失败')
                if (err.code === 2001) {
                    // 用户不存在 微信没有和手机号进行绑定
                    if (path.includes('/invite/accept')) {
                        // 如果是接受邀请页就跳转到学生登录页面
                        router.replace({
                            path: '/studentlogin',
                        })
                    } else {
                        router.replace({
                            path: '/login',
                        })
                    }
                }
            })
    },
    // created函数中获取code并登录
    createdGetWechatUserByCode() {
        const device = store.getters.device
        const code = this.getCode().code
        const token = getToken(USER_TOKEN)
        const openId = getToken(OPENID)
        // console.log('createdGetWechatUserByCode-enter')
        if (device === 'wx') {
            if (!token) {
                if (!openId) {
                    if (code) {
                        // code 存在就换取openId
                        return getWechatUserByCode(code).then(data => {
                            // 存储openId
                            // console.log('getWechatUserByCode')
                            const { headimgurl, nickname, openId } = data
                            store.commit(`user/${SET_OPENID}`, openId)
                            store.commit(`user/${SET_USERINFO}`, {
                                headimgurl,
                                nickname,
                            })
                            this.loginWithOpenId(openId)
                        })
                    } else {
                        this.wxLogin()
                    }
                } else {
                    router.replace({
                        path: '/login',
                    })
                }
            } else {
                // 存在就提示已经登录了
                Toast('您已登录！')
            }
        }
    },
    wxLogin() {
        const openId = getToken(OPENID)
        if (openId) {
            // openId 存在就执行用openId登录
            this.loginWithOpenId(openId)
        } else {
            // 否则就跳转微信的获取code过程
            const redirect_uri = encodeURIComponent(location.href)
            const link = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${this.appid}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`
            window.location.href = link
        }
    },
    /* 初始化wxjsdk各种接口 */
    init(apiList = []) {
        const device = store.getters.device
        if (device === 'wx') {
            // 需要使用的api列表
            return new Promise((resolve, reject) => {
                getSignature(store.state.page.initLink).then(res => {
                    if (res.appId) {
                        wx.config({
                            // debug: true,
                            appId: res.appId,
                            timestamp: res.timestamp,
                            nonceStr: res.nonceStr,
                            signature: res.signature,
                            jsApiList: apiList,
                        })
                        wx.ready(res => {
                            // 微信SDK准备就绪后执行的回调。
                            resolve(wx, res)
                        })
                    } else {
                        reject(res)
                    }
                })
            })
        } else {
            return Promise.reject('init-none')
        }
    },
}

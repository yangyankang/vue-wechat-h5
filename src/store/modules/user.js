import {
    LOGIN,
    LOGOUT,
    USERINFO,
    SET_USERINFO,
    SET_OPENID,
    OPENID,
    USER_TOKEN,
    SET_TOKEN,
} from '@/utils/constant'
import { loginByPhone, fetchUserInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import { Toast } from 'vant'

const state = {
    token: getToken(USER_TOKEN) || '', // 权限验证
    userInfo: JSON.parse(localStorage.getItem(USERINFO)),
    openId: getToken(OPENID) || '', // openId
}

const mutations = {
    [LOGIN](state, token) {
        state.token = token
        setToken(USER_TOKEN, token)
    },
    [LOGOUT](state) {
        state.userInfo = null
        state.token = ''
        removeToken(USER_TOKEN)
        sessionStorage.removeItem(USERINFO)
        resetRouter()
    },
    [SET_TOKEN](state, token) {
        state.token = token
        setToken(USER_TOKEN, token)
    },
    [SET_USERINFO](state, userInfo = {}) {
        state.userInfo = { ...userInfo }
        localStorage.setItem(USERINFO, JSON.stringify(userInfo))
    },
    [SET_OPENID](state, openId) {
        state.openId = openId
        setToken(OPENID, openId)
    },
}

const actions = {
    async loginByPhone({ commit }, data) {
        // 登录，登出会根据业务场景实现
        try {
            let res = await loginByPhone({
                phoneNumber: data.phoneNumber,
                password: data.password,
            })
            commit(LOGIN, res)
            Toast({
                message: '登录成功',
                position: 'middle',
                duration: 1500,
            })
            setTimeout(() => {
                const redirect = data.$route.query.redirect || '/'
                data.$router.replace({
                    path: redirect,
                })
            }, 1500)
        } catch (error) {
            return error
        }
    },
    getUserInfo({ commit }) {
        return new Promise((resolve, reject) => {
            fetchUserInfo()
                .then(data => {
                    if (!data) {
                        reject('Verification failed, please Login again.')
                    }
                    commit(SET_USERINFO, data)
                    resolve(data)
                })
                .catch(err => {
                    reject(err)
                })
        })
    },
    resetToken({ commit }) {
        return new Promise(resolve => {
            commit(SET_TOKEN, '')
            removeToken(USER_TOKEN)
            resolve()
        })
    },
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
}

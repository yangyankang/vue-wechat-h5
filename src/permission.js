import router from '@/router'
import store from '@/store'
import { Toast } from 'vant'
import { getToken } from '@/utils/auth'
import { LOGOUT, TO_URL, USER_TOKEN } from '@/utils/constant'
import defaultSettings from './settings'
// import VConsole from 'vconsole'

// const vConsole = new VConsole() // 能够在vconsole中使用console.log打印

// 白名单需要公用就抽离出来放在了settings文件中
// const whiteList = ['/login', '/wxlogin', '/invite/accept', '/studentlogin']

// console.log(store.getters.device)

const history = window.sessionStorage
history.clear()
// let historyCount = history.getItem('count') * 1 || 0
history.setItem('/', 0)

// 这里是设置页面的过度效果。不过在微信登录中，最好不要使用，体验感很差
// function setPageDirection(to, from) {
//     // 设置过渡方向
//     if (to.params.direction) {
//         store.commit('page/updateDirection', to.params.direction)
//     } else {
//         const toIndex = history.getItem(to.path)
//         const fromIndex = history.getItem(from.path)

//         // 判断记录跳转页面是否访问过，以此判断跳转过渡方式
//         if (toIndex) {
//             if (
//                 !fromIndex ||
//                 parseInt(toIndex, 10) > parseInt(fromIndex, 10) ||
//                 (toIndex === '0' && fromIndex === '0')
//             ) {
//                 store.commit('page/updateDirection', 'forward')
//             } else {
//                 store.commit('page/updateDirection', 'back')
//             }
//         } else {
//             ++historyCount
//             history.setItem('count', historyCount)
//             to.path !== '/' && history.setItem(to.path, historyCount)
//             store.commit('page/updateDirection', 'forward')
//         }
//     }
// }

router.beforeEach(async (to, from, next) => {
    const hasToken = getToken(USER_TOKEN)
    // setPageDirection(to, from)

    // 权限验证
    if (hasToken) {
        // 如果是登录的情况下,移除记录的url
        localStorage.removeItem(TO_URL)

        // 获取用户信息
        const hasGetUserInfo =
            store.getters.userInfo && store.getters.userInfo.userId
        if (hasGetUserInfo) {
            next()
        } else {
            try {
                await store.dispatch('user/getUserInfo')
                next()
            } catch (err) {
                localStorage.setItem(TO_URL, to.fullPath)
                await store.commit('user/' + LOGOUT)
                Toast(err || 'Has error')
                if (store.getters.device === 'wx') {
                    // 在微信中就直接
                    next({
                        path: '/wxlogin',
                        replace: true,
                    })
                } else {
                    next({
                        path: `/login?redirect=${to.path}`,
                        replace: true,
                    })
                }
            }
        }
        next()
    } else {
        // 没有token
        const findeIndex = defaultSettings.whiteList.findIndex(item => {
            return to.path.includes(item)
        })
        if (findeIndex !== -1) {
            // 在白名单中就不需要登录
            next()
        } else {
            // 不在白名单的路由就要记录当前的url并且跳转到微信登录
            localStorage.setItem(TO_URL, to.fullPath)
            if (store.getters.device === 'wx') {
                // 在微信中就直接
                next({
                    path: '/wxlogin',
                    replace: true,
                })
            } else {
                next({
                    path: `/login?redirect=${to.path}`,
                    replace: true,
                })
            }
        }
    }
})

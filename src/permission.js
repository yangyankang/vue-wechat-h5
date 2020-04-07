import router from '@/router'
import store from '@/store'
import { Toast } from 'vant'
import defaultSettings from './settings'


const history = window.sessionStorage
history.clear()
let historyCount = history.getItem('count') * 1 || 0
history.setItem('/', 0)

function setPageDirection(to, from) {
  // 设置过渡方向
  if (to.params.direction) {
    store.commit('page/updateDirection', to.params.direction)
  } else {
    const toIndex = history.getItem(to.path)
    const fromIndex = history.getItem(from.path)

    // 判断记录跳转页面是否访问过，以此判断跳转过渡方式
    if (toIndex) {
      if (
        !fromIndex ||
        parseInt(toIndex, 10) > parseInt(fromIndex, 10) ||
        (toIndex === '0' && fromIndex === '0')
      ) {
        store.commit('page/updateDirection', 'forward')
      } else {
        store.commit('page/updateDirection', 'back')
      }
    } else {
      ++historyCount
      history.setItem('count', historyCount)
      to.path !== '/' && history.setItem(to.path, historyCount)
      store.commit('page/updateDirection', 'forward')
    }
  }
}

router.beforeEach(async (to, from, next) => {
  const hasToken = getToken(USER_TOKEN)
  setPageDirection(to, from)

  // 权限验证
  if (hasToken) {
    // 如果是在app中话直接跳入到页面
    if (store.getters.device.includes('hydf')) {
      let appWhiteList = defaultSettings.appWhiteList
      let findIndex = appWhiteList.findIndex(item => to.path.includes(item))
      if (findIndex < 0) {
        // 不在白名单里面才请求用户信息
        await store.dispatch('user/getUserInfo')
      }
      next()
    }

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
            replace: true
          })
        } else {
          next({
            path: `/login?redirect=${to.path}`,
            replace: true
          })
        }
      }
    }
    /* if (to.path === '/login') {
      // 这里也要做区分 区分微信端和原生
      next()
    } else {
      // 获取用户信息
      const hasGetUserInfo =
        store.getters.userInfo && store.getters.userInfo.name
      if (hasGetUserInfo) {
        next()
      } else {
        try {
          await store.dispatch('user/getUs erInfo')
          next()
        } catch (err) {
          await store.commit('user/' + LOGOUT)
          Toast(err || 'Has error')
          next(`/login?redirect=${to.path}`)
        }
      }
    } */
    next()
  } else {
    // 如果是在app中话直接跳入到页面
    if (store.getters.device.includes('hydf')) {
      // 这里写与原生交互的跳app登录的逻辑
      next()
    }

    let findeIndex = defaultSettings.whiteList.findIndex(item => {
      return to.path.includes(item)
    })
    if (findeIndex !== -1) {
      next()
    } else {
      localStorage.setItem(TO_URL, to.fullPath)
      if (store.getters.device === 'wx') {
        // 在微信中就直接
        next({
          path: '/wxlogin',
          replace: true
        })
      } else {
        next({
          path: `/login?redirect=${to.path}`,
          replace: true
        })
      }
    }
  }
})

import Vue from 'vue'
import VueRouter from 'vue-router'

/*  解决vue项目路由出现message: "Navigating to current location (XXX) is not allowed"的问题*/
const routerPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return routerPush.call(this, location).catch(error => error)
}

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('@/views/Home'),
        meta: {
            title: '首页',
            keepAlive: true,
        },
    },
    {
        path: '/404',
        name: '404',
        component: () => import('@/views/404'),
        meta: {
            title: '404',
            keepAlive: true,
        },
    },
    { path: '*', redirect: '/404', hidden: true },
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    scrollBehavior: () => ({ y: 0 }),
    routes,
})

export default router

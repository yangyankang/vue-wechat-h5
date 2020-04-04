import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import filters from '@/filters'
import * as directives from './directives'

// token 验证
import './permission'

import {
    Toast,
    List,
    Dialog,
    Stepper,
    ActionSheet,
    Overlay,
    Slider,
    Tab,
    Tabs,
    Popup,
    Sticky,
    Swipe,
    SwipeItem,
    CountDown,
} from 'vant' // 全局引入vant样式

import '@/icons'

Vue.use(Toast)
    .use(List)
    .use(Dialog)
    .use(Stepper)
    .use(ActionSheet)
    .use(Overlay)
    .use(Slider)
    .use(Tab)
    .use(Tabs)
    .use(Popup)
    .use(Sticky)
    .use(Swipe)
    .use(SwipeItem)
    .use(CountDown)

// 注入全局过滤器
Object.keys(filters).forEach(item => {
    Vue.filter(item, filters[item])
})

// 注入全局指令
Object.keys(directives).forEach(item => {
    Vue.directive(item, directives[item])
})
Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app')

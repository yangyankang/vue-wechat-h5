import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
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
  CountDown
} from 'vant' // 全局引入vant样式

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

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

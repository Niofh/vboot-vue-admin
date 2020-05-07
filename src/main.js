import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

import VueHighlightJS from 'vue-highlightjs'
import 'highlight.js/styles/atelier-estuary-dark.css'

import Clipboard from '@/directive/clipboard'

Vue.use(VueHighlightJS)
Vue.use(Clipboard)
Vue.use(ElementUI)

// 全局字典过滤器
Vue.filter('dictFilter', function(value, dictList) {
  let name = ''
  for (let i = 0; i < dictList.length; i++) {
    if (dictList[i].code === value) {
      name = dictList[i].name
      break
    }
  }
  return name
})

Vue.prototype.$code = 200

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

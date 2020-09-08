import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control
import permission from '@/directive/permission'

import VueHighlightJS from 'vue-highlightjs'
import 'highlight.js/styles/github-gist.css'

import Clipboard from '@/directive/clipboard'
import './filter'
Vue.use(VueHighlightJS)
Vue.use(Clipboard)
Vue.use(ElementUI)
Vue.use(permission)

Vue.prototype.$code = 200

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

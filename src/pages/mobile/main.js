import Vue from 'vue'

import 'normalize.css/normalize.css'
import Vant from 'vant'
import 'vant/lib/index.css'
import '@/styles/index.scss'

import App from './App'
import store from './store'
import router from './router'

import '@/icons'
import '@mobile/permission'
import '@/plugins'

Vue.use(Vant)

Vue.config.productionTip = false

Vue.prototype.$EventBus = new Vue()

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

import Vue from 'vue'

import 'normalize.css/normalize.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss'

import App from './App'
import store from './store'
import router from './router'

import '@/icons'
import '@admin/permission'
import '@/plugins'
import { selectEchoDic } from '@/utils'

Vue.use(ElementUI)

Vue.config.productionTip = false

Vue.prototype.selectEchoDic = selectEchoDic
Vue.prototype.$EventBus = new Vue()

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

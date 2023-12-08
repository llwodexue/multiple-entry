import Vue from 'vue'

// 全局样式
import ElementUI from 'element-ui'
import '@/assets/styles/element-variables.scss'
import '@/assets/styles/index.scss'
import '@/assets/styles/common.scss'
import '@/assets/icons'

import App from './App'
import store from './store'
import router from './router'
import './permission'

import directive from '@/directive'
import plugins from '@/plugins'
import { parseTime, resetForm } from '@/utils'
import request from '@admin/utils/request'
import Pagination from '@/components/Pagination'
import RightToolbar from '@/components/RightToolbar'

// 全局方法挂载
Vue.prototype.$parseTime = parseTime
Vue.prototype.$resetForm = resetForm
Vue.prototype.$axios = request

// 全局组件挂载
Vue.component('Pagination', Pagination)
Vue.component('RightToolbar', RightToolbar)

// 全局注册
Vue.use(directive)
Vue.use(plugins)
Vue.use(ElementUI, {
  size: 'small'
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

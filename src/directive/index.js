import hasRole from './permission/hasRole'
import hasPermission from './permission/hasPermission'
import dialogDrag from './dialog/drag'
import dialogDragWidth from './dialog/dragWidth'
import dialogDragHeight from './dialog/dragHeight'

// Vue：自定义指令：https://v2.cn.vuejs.org/v2/guide/custom-directive.html
const install = function (Vue) {
  Vue.directive('hasRole', hasRole)
  Vue.directive('hasPermission', hasPermission)
  Vue.directive('dialogDrag', dialogDrag)
  Vue.directive('dialogDragWidth', dialogDragWidth)
  Vue.directive('dialogDragHeight', dialogDragHeight)
}

if (window.Vue) {
  window['hasRole'] = hasRole
  window['hasPermission'] = hasPermission
  Vue.use(install) // eslint-disable-line
}

export default install

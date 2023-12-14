import { constantRoutes } from '@admin/router'
import Layout from '@admin/layout/index'
import ParentView from '@/components/ParentView'

const permission = {
  state: {
    routes: [],
    flattenRoutes: [],
    addRoutes: [],
    sidebarRouters: [], // 左侧边菜单的路由，被 Sidebar/index.vue 使用
    topbarRouters: [] // 顶部菜单的路由，被 TopNav/index.vue 使用
  },
  mutations: {
    SET_ROUTES: (state, routes) => {
      state.addRoutes = routes
      state.routes = constantRoutes.concat(routes)
    },
    SET_DEFAULT_ROUTES: (state, routes) => {
      state.defaultRoutes = constantRoutes.concat(routes)
    },
    SET_TOPBAR_ROUTES: (state, routes) => {
      state.topbarRouters = routes
    },
    SET_SIDEBAR_ROUTERS: (state, routes) => {
      state.sidebarRouters = routes
    },
    SET_FLATTEN_ROUTERS: (state, routes) => {
      state.flattenRoutes = routes
    }
  },
  actions: {
    /**
     * 生成路由
     *
     * @param commit commit 函数
     * @param menus  路由参数
     */
    GenerateRoutes({ commit }, menus) {
      return new Promise(resolve => {
        // TODO 如果不符合预期，需要对其进行处理
        const data = menus
        const sdata = JSON.parse(JSON.stringify(data)) // 用于菜单中的数据
        const rdata = JSON.parse(JSON.stringify(data)) // 用于最后添加到 Router 中的数据
        const sidebarRoutes = filterAsyncRouter(sdata)
        const rewriteRoutes = filterAsyncRouter(rdata, false, true)
        const flattenRoutes = flatteningRouters(rewriteRoutes)
        rewriteRoutes.push({ path: '*', redirect: '/404', hidden: true })
        commit('SET_FLATTEN_ROUTERS', flattenRoutes)
        commit('SET_ROUTES', rewriteRoutes)
        commit('SET_SIDEBAR_ROUTERS', constantRoutes.concat(sidebarRoutes))
        commit('SET_DEFAULT_ROUTES', sidebarRoutes)
        commit('SET_TOPBAR_ROUTES', sidebarRoutes)
        resolve(rewriteRoutes)
      })
    }
  }
}

function flatteningRouters(arr) {
  if (arr.length <= 0) return false
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].children) {
      arr = arr.slice(0, i + 1).concat(arr[i].children, arr.slice(i + 1))
    }
  }
  return arr
}

// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap, lastRouter = false, type = false) {
  return asyncRouterMap.filter(route => {
    if (type && route.children) {
      route.children = filterChildren(route.children)
    }
    if (route.component) {
      // Layout ParentView 组件特殊处理
      if (route.component === 'layout') {
        route.component = Layout
      } else if (route.component === 'layout/common') {
        route.component = ParentView
      } else if (route.component === 'ParentView') {
        route.component = ParentView
      } else {
        route.component = loadView(route.component)
      }
    }
    if (route.children != null && route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children, route, type)
    } else {
      delete route['children']
      delete route['redirect']
    }
    return true
  })
}

function filterChildren(childrenMap, lastRouter = false) {
  let children = []
  childrenMap.forEach((el, index) => {
    if (el.children && el.children.length) {
      if (!el.component && !lastRouter) {
        el.children.forEach(c => {
          c.path = el.path + '/' + c.path
          if (c.children && c.children.length) {
            children = children.concat(filterChildren(c.children, c))
            return
          }
          children.push(c)
        })
        return
      }
    }
    if (lastRouter) {
      el.path = lastRouter.path + '/' + el.path
    }
    children = children.concat(el)
  })
  return children
}

export const loadView = view => {
  // 路由懒加载
  return resolve => require([`@admin/views/${view}`], resolve)
}

export default permission

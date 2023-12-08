import request from '@admin/utils/request'
import { dynamicRoutes } from '@admin/router'
import defaultSettings from '@admin/settings'

const isDeBugger = process.env.NODE_ENV === 'development' && defaultSettings.isDeBugger

// 登录方法
export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

// 获取用户详细信息
export function getInfo() {
  if (isDeBugger) {
    return Promise.resolve({
      data: {
        operator: { operatorName: 'admin', avatar: null },
        menuList: dynamicRoutes,
        buttonList: ['*:*:*']
      },
      code: 200,
      msg: '操作成功'
    })
  } else {
    return request({
      url: '/getUserInfo',
      method: 'get'
    })
  }
}

// 退出方法
export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}

// 修改免密
export function changePwd(data) {
  return request({
    method: 'post',
    url: '/changePwd',
    data
  })
}

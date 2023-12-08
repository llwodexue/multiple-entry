import request from '@mobile/utils/request'

export function login() {
  return request({
    url: '/user/login',
    method: 'get'
  })
}

export function getInfo() {
  return request({
    url: '/user/info',
    method: 'get'
  })
}
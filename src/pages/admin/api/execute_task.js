import request from '@admin/utils/request'

export function queryByPage({ page, size }, params) {
  return request({
    url: '/executeTask/list' + `?page=${page - 1}&size=${size}`,
    method: 'post',
    data: params
  })
}
export function addCheckout(params) {
  return request({
    url: '/executeTask/addCheckout',
    method: 'post',
    data: params
  })
}
export function add(params) {
  return request({
    url: '/executeTask',
    method: 'post',
    data: params
  })
}
export function edit(params) {
  return request({
    url: '/executeTask',
    method: 'put',
    data: params
  })
}
export function deleteById(params) {
  return request({
    url: '/executeTask' + `?id=${params.id}`,
    method: 'delete'
  })
}
export function queryById(params) {
  return request({
    url: `/executeTask/${params.id}`,
    method: 'get'
  })
}
export function pause(params) {
  return request({
    url: '/executeTask/pause' + `?id=${params.id}`,
    method: 'post'
  })
}
export function resume(params) {
  return request({
    url: '/executeTask/resume' + `?id=${params.id}`,
    method: 'post'
  })
}
export function start(params) {
  return request({
    url: '/executeTask/start' + `?id=${params.id}`,
    method: 'post'
  })
}
export function stop(params) {
  return request({
    url: '/executeTask/delete' + `?id=${params.id}`,
    method: 'post'
  })
}

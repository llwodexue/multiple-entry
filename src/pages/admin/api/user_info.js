import request from '@admin/utils/request'

export function queryByPage({ page, size }, params) {
  return request({
    url: '/userInfo/list' + `?page=${page - 1}&size=${size}`,
    method: 'post',
    data: params || {}
  })
}
export function add(params) {
  return request({
    url: '/userInfo',
    method: 'post',
    data: params
  })
}
export function edit(params) {
  return request({
    url: '/userInfo',
    method: 'put',
    data: params
  })
}
export function deleteById(params) {
  return request({
    url: '/userInfo' + `?id=${params.id}`,
    method: 'delete'
  })
}
export function queryById(params) {
  return request({
    url: `/userInfo/${params.id}`,
    method: 'get'
  })
}

import request from '@admin/utils/request'

export function queryByPage({ page, size }, params) {
  return request({
    url: '/orgInfo/list' + `?page=${page - 1}&size=${size}`,
    method: 'post',
    data: params || {}
  })
}
export function add(params) {
  return request({
    url: '/orgInfo',
    method: 'post',
    data: params
  })
}
export function edit(params) {
  return request({
    url: '/orgInfo',
    method: 'put',
    data: params
  })
}
export function deleteById(params) {
  return request({
    url: '/orgInfo' + `?id=${params.id}`,
    method: 'delete'
  })
}
export function queryById(params) {
  return request({
    url: `/orgInfo/${params.id}`,
    method: 'get'
  })
}

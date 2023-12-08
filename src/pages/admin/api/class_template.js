import request from '@admin/utils/request'

export function queryByPage({ page, size }, params) {
  return request({
    url: '/classTemplate/list' + `?page=${page - 1}&size=${size}`,
    method: 'post',
    data: params || {}
  })
}
export function add(params) {
  return request({
    url: '/classTemplate',
    method: 'post',
    data: params
  })
}
export function edit(params) {
  return request({
    url: '/classTemplate',
    method: 'put',
    data: params
  })
}
export function deleteById(params) {
  return request({
    url: '/classTemplate' + `?id=${params.id}`,
    method: 'delete'
  })
}
export function queryById(params) {
  return request({
    url: `/classTemplate/${params.id}`,
    method: 'get'
  })
}
export function uploadClass(params) {
  return request({
    url: `/classTemplate/uploadClass`,
    method: 'post',
    data: params
  })
}
export function loadClass(params) {
  return request({
    url: `/classTemplate/loadClass` + `?id=${params.id}`,
    method: 'get'
  })
}

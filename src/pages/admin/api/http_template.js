import request from '@admin/utils/request'

export function queryByPage({ page, size }, params) {
  return request({
    url: '/httpTemplate/list' + `?page=${page - 1}&size=${size}`,
    method: 'post',
    data: params
  })
}
export function queryRelationByPage({ page, size }, params) {
  return request({
    url: '/httpTemplate/relationList' + `?page=${page - 1}&size=${size}`,
    method: 'post',
    data: params
  })
}
export function queryNoRelationByPage({ page, size }, params) {
  return request({
    url: '/httpTemplate/noRelationList' + `?page=${page - 1}&size=${size}`,
    method: 'post',
    data: params
  })
}
export function add(params) {
  return request({
    url: '/httpTemplate',
    method: 'post',
    data: params
  })
}
export function edit(params) {
  return request({
    url: '/httpTemplate',
    method: 'put',
    data: params
  })
}
export function deleteById(params) {
  return request({
    url: '/httpTemplate' + `?id=${params.id}`,
    method: 'delete'
  })
}
export function queryById(params) {
  return request({
    url: `/httpTemplate/${params.id}`,
    method: 'get'
  })
}
export function jsonFormat(params) {
  return request({
    url: '/httpTemplate/jsonFormat',
    method: 'post',
    data: params
  })
}
export function bind(params) {
  return request({
    url: '/httpTemplate/binding',
    method: 'post',
    data: params
  })
}
export function unBind(params) {
  return request({
    url: '/httpTemplate/deleteBinding',
    method: 'post',
    data: params
  })
}

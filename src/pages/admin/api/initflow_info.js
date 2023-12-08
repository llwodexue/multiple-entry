import request from '@admin/utils/request'

export function queryRelationByPage({ page, size }, params) {
  return request({
    url: '/initflowInfo/relationUsers' + `?page=${page - 1}&size=${size}`,
    method: 'post',
    data: params
  })
}
export function queryNoRelationByPage({ page, size }, params) {
  return request({
    url: '/initflowInfo/relationList' + `?page=${page - 1}&size=${size}`,
    method: 'post',
    data: params
  })
}
export function bind(params) {
  return request({
    url: '/initflowInfo/binding',
    method: 'post',
    data: params
  })
}
export function unBind(params) {
  return request({
    url: '/initflowInfo/deleteBinding',
    method: 'post',
    data: params
  })
}

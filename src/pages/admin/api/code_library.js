import request from '@admin/utils/request'

export function queryByPage({ page, size }, params) {
  return request({
    url: '/codeLibrary/list' + `?page=${page - 1}&size=${size}`,
    method: 'post',
    data: params || {}
  })
}
export function add(params) {
  return request({
    url: '/codeLibrary',
    method: 'post',
    data: params
  })
}
export function edit(params) {
  return request({
    url: '/codeLibrary',
    method: 'put',
    data: params
  })
}
export function deleteById(params) {
  return request({
    url: '/codeLibrary' + `?codeNo=${params.codeNo}&itemNo=${params.itemNo}`,
    method: 'delete'
  })
}
export function queryById(params) {
  return request({
    url: `/codeLibrary/${params.id}`,
    method: 'get'
  })
}
export function queryCodeByPage({ page, size }, params) {
  return request({
    url: '/codeLibrary/codeList' + `?page=${page - 1}&size=${size}`,
    method: 'post',
    data: params || {}
  })
}

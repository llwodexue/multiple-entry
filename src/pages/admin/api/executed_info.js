import request from '@admin/utils/request'

export function queryByPage({ page, size }, params) {
  return request({
    url: '/executedInfo/list' + `?page=${page - 1}&size=${size}`,
    method: 'post',
    data: params || {}
  })
}

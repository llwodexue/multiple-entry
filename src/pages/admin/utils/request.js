import axios from 'axios'
import modal from '@/plugins/modal'
import store from '@admin/store'
import { getToken } from '@/utils/auth'

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  // withCredentials: true,
  timeout: 10000
})

service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['Authorization'] = getToken()
    }
    return config
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    const res = response.data

    if (res.code && res.code !== 0) {
      /* if (res.code === 401) {
        window.location = window.location.origin + '/sso/userLogin'
        return
      } */
      modal.msgError(res.message || res.msg || 'Error')

      return Promise.reject(new Error(res.message || 'Error'))
    }

    return res
  },
  error => {
    console.log('err' + error)
    modal.msgError(error.message)
    return Promise.reject(error)
  }
)

export default service

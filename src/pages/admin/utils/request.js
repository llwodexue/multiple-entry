import axios from 'axios'
import modal from '@/plugins/modal'
import { getToken } from '@admin/utils/auth'
import errorCode from '@/utils/errorCode'
import { encryptLog } from '@admin/settings'
import { encryptAES, decryptAES } from '@/utils/aes-base64'
import router from '@admin/router'
import store from '@admin/store'
import { AUTHOR_KEY } from '@admin/global'

const encryptLogs = encryptLog && process.env.NODE_ENV === 'development'

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
const baseURL = process.env.VUE_APP_ADMIN_BASE_API
const service = axios.create({
  baseURL,
  timeout: 10 * 1000,
  withCredentials: true
})

// 接口加密白名单
const encryptAPI = true
const decryptAPI = true
const whiteList = []
service.interceptors.request.use(
  config => {
    // 是否需要设置 token
    const isToken = config.headers?.isToken === false
    if (getToken() && !isToken) {
      config.headers[AUTHOR_KEY] = 'Bearer ' + getToken()
    }

    // 多语言-只有中文
    config.headers['Accept-Language'] = 'zh_CN'
    // 接口加密
    const includeUrl = whiteList.some(item => config.url.endsWith(item))
    if (encryptAPI && !includeUrl) {
      const data = config.data
      if (data != null) {
        encryptLogs && console.log('request', config.url, data)
        config.data = {
          encryptStr: encryptAES(JSON.stringify(data))
        }
      }
      const params = config.params
      if (params != null) {
        encryptLogs && console.log('request', config.url, params)
        config.params = {
          encryptStr: encryptAES(JSON.stringify(params))
        }
      }
    }
    return config
  },
  error => {
    console.log(error)
    Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    // 二进制数据则直接返回
    if (['blob', 'arraybuffer'].includes(response.request.responseType)) {
      return response
    }
    const res = response.data

    // 接口解密
    const includeUrl = whiteList.some(item => res.config.url.endsWith(item))
    if (decryptAPI && !includeUrl) {
      try {
        const transFun = transData => {
          // *注意：\0 \b 问题
          return JSON.parse(decryptAES(transData).replace(/[\0\b]/g, ''))
        }
        encryptLogs && res.data && console.log('response', res.config.url, transFun(res.data))
        encryptLogs && res.rows && console.log('response', res.config.url, transFun(res.rows))
        res.data && (res.data = transFun(res.data))
        res.rows && (res.rows = transFun(res.rows))
      } catch (err) {
        console.log(err)
      }
    }

    // 展示正确或错误信息
    const code = res.code || 200
    const msg = errorCode[code] || res.msg || errorCode['default']
    if (code === 401 || code === 403) {
      store.dispatch('resetToken').then(() => {
        router.push({ path: '/login' })
      })
      return Promise.reject('无效的会话，或者会话已过期，请重新登录。')
    } else if (code === 500) {
      modal.msgError(msg)
      return Promise.reject(new Error(msg))
    } else if (code !== 200) {
      modal.notifyError(msg)
      return Promise.reject('error')
    } else {
      return Promise.resolve(res)
    }
  },
  error => {
    console.log('err' + error)
    let { message } = error
    if (message == 'Network Error') {
      message = '后端接口连接异常'
    } else if (message.includes('timeout')) {
      message = '后端接口请求超时'
    } else if (message.includes('Request failed with status code')) {
      message = '后端接口' + message.substr(message.length - 3) + '异常'
    }
    modal.msgError(message || '后端接口未知异常')
    return Promise.reject(error)
  }
)

export function getBaseHeader() {
  return {
    Authorization: 'Bearer ' + getToken()
  }
}

export default service

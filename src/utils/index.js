/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (typeof time === 'string') {
      if (/^[0-9]+$/.test(time)) {
        time = parseInt(time)
      } else {
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ')
  if (!search) {
    return {}
  }
  const obj = {}
  const searchArr = search.split('&')
  searchArr.forEach(v => {
    const index = v.indexOf('=')
    if (index !== -1) {
      const name = v.substring(0, index)
      const val = v.substring(index + 1, v.length)
      obj[name] = val
    }
  })
  return obj
}

/**
 * @param {String} obj
 * @returns {String}
 */
export function getFileName(path) {
  if (path.lastIndexOf('\\') >= 0) {
    const reg = new RegExp('\\\\', 'g')
    path = path.replace(reg, '/')
  }
  return path.substring(path.lastIndexOf('/') + 1)
}

/**
 * @param {Object|Array} obj
 * @returns {Object|Array}
 */
export function deepClone(obj) {
  let newObj = null
  try {
    newObj = obj.push ? [] : {}
  } catch (error) {
    newObj = {}
  }
  for (const attr in obj) {
    if (obj[attr] && typeof obj[attr] === 'object') {
      newObj[attr] = deepClone(obj[attr])
    } else {
      newObj[attr] = obj[attr]
    }
  }
  return newObj
}

export function isMobile() {
  if (
    navigator.userAgent.match(
      /('phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone')/i
    )
  ) {
    return true
  } else {
    return false
  }
}

export function uuidGeneratorByURL() {
  const tempUrl = URL.createObjectURL(new Blob())
  const uuid = tempUrl.toString()
  URL.revokeObjectURL(tempUrl)
  return uuid.substring(uuid.lastIndexOf('/') + 1)
}

export function uuidGeneratorByRandom() {
  return Math.random().toString(16).slice(2)
}

/**
 * @param {Date} startDate
 * @param {Date} endDate
 * @returns {number}
 */
export function diffDate(startDate, endDate) {
  if (!startDate || !endDate) return

  const start = startDate.getTime()
  const end = endDate.getTime()
  const datesent = (end - start) / (1000 * 60 * 60 * 24)
  return datesent
}

/**
 * @param {string|number} value1
 * @param {string|number} value2
 * @returns {boolean}
 */
export function isValueEqual(value1, value2) {
  value1 = typeof value1 === 'string' ? parseFloat(value1) : value1
  value2 = typeof value2 === 'string' ? parseFloat(value2) : value2
  return value1 === value2
}

/**
 * *回显数据字典
 * @param {Array} dataArr
 * @param {string} val
 * @returns {string}
 */
export function selectEchoDic(dataArr, val, noEmpty = true) {
  const row = dataArr.find(item => item.data == val)
  if (!row) return noEmpty ? '--' : ''
  return row.label
}
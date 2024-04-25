export const utils = {
  // 判断val是否为空
  isNull(val) {
    return val === null || val === void 0 || val === '' || val.toString() === 'NaN'
  },

  /**
   * 获取val值，若为空则使用默认值
   * @param {*} val
   * @param {*} dt val为空时的默认值
   * @param {*} unit 单位
   * @returns string|number|boolean
   */
  getStrVal(val, dt = '', unit = '') {
    return !this.isNull(val) ? val + unit : dt
  },

  // 获取css属性值的单位，如：px、rem、%
  getUnit(val = '') {
    return (
      String(val)
        .match(/[^.\d]*/gi)
        .find(item => item) || ''
    )
  },
  // 去掉值后的单位：eg： 10px -> 10
  delValUnit(val, unit) {
    if (!unit) {
      unit = this.getUnit(val) //
      if (!unit) return val
    }
    const reg = new RegExp(unit + '$', 'ig')
    return val.replace(reg, '')
  },

  // 禁止鼠标右键
  oncontextmenuDisabled(e) {
    e.stopPropagation()
    e.preventDefault()
    return false
  },

  setDOMH(dom, h) {
    if (!dom || !dom.style) return
    dom.style.height = h + 'px'
  },
  setDOMW(dom, w) {
    if (!dom || !dom.style) return
    dom.style.width = w + 'px'
  },
  // 获取dom 宽高
  getDOMWH(dom) {
    const _dom = dom || {}
    return {
      w: _dom.offsetWidth || 0,
      h: _dom.offsetHeight || 0
    }
  },

  // 清除画布
  clearCanvas(canvas) {
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    // ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    // ctx.restore();
  },
  // 设置canvas 宽高
  setCanvasWH(canvas, width, height) {
    if (!canvas) return
    canvas.width = width
    canvas.height = height
    canvas.style.width = width + 'px'
    canvas.style.height = height + 'px'
  },

  /**
   * 使用ease-in-out曲线作为默认的滚动效果
   * @param {*} t 当前动画时间
   * @param {*} b 起点距离
   * @param {*} c 终点距离
   * @param {*} d 动画持续时间
   * @returns
   */
  easeInOutQuad(t, b, c, d) {
    t /= d / 2
    if (t < 1) return (c / 2) * t * t + b
    t--
    return (-c / 2) * (t * (t - 2) - 1) + b
  },
  smoothScroll(
    {
      startPosition, // 开始位置
      distance, // 距离开始位置的距离
      duration = 300, // 动画持续时间 ms
      callBack
    } = { duration: 300 }
  ) {
    // 开始动画
    let startTimeStamp = null

    const render = timeStamp => {
      !startTimeStamp && (startTimeStamp = timeStamp)
      const progress = timeStamp - startTimeStamp
      // console.log(timeStamp, progress, 11111)
      const run = this.easeInOutQuad(progress, startPosition, distance, duration)
      callBack && callBack(run)
      if (progress < duration) {
        requestAnimationFrame(render)
      }
    }
    requestAnimationFrame(render)
  }
}

/** 对象克隆 */
export function cloneObj(obj) {
  let o = null
  if (Object.prototype.toString.call(obj) === '[object Array]') {
    o = []
    for (let i = 0; i < obj.length; i++) {
      o.push(cloneObj(obj[i]))
    }
  } else if (Object.prototype.toString.call(obj) === '[object Object]') {
    o = {}

    for (const x in obj) {
      o[x] = cloneObj(obj[x])
    }
  } else {
    o = obj
  }
  return o
}

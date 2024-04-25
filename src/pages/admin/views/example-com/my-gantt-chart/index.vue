<template>
  <div class="gantt-chart-wrap">
    <div
      ref="ganttBoxRefDom"
      :style="{ background: ganttBgColor }"
      tabindex="-2"
      class="gantt-chart-box"
    >
      <canvas ref="canvasGanttRefDom">您的浏览器不支持 HTML5 canvas标签</canvas>
      <div class="row-header" :style="{ height: paintTop }">
        <span
          ref="titleRefDom"
          class="gt-title"
          :style="{ width: paintLeft, height: paintTop }"
        >
          {{ title }}
        </span>
        <div class="header-right">
          <div ref="headerBoxRefDom" class="scrollX">
            <span v-for="(col, cIndex) in colsInfo" :key="cIndex" class="paint-col">
              <span class="name">{{ col.label }}</span>
              <i class="sLine" :style="{ background: gridLineColor }"></i>
            </span>
          </div>
        </div>
      </div>
      <div
        class="row-bottom"
        :style="{ height: ganTTBottomHeight ? ganTTBottomHeight + 'px' : '' }"
      >
        <div class="box-left scrollY" :style="{ width: paintLeft }">
          <div
            v-for="(row, rIndex) in rowsInfo"
            :key="rIndex"
            :class="{ 'paint-row': true, disabled: row.disabled }"
            :style="{ backgroundColor: row.disabled ? disabledBgColor : '' }"
          >
            <span class="name">{{ row.label }}</span>
            <i class="sLine" :style="{ background: gridLineColor }"></i>
          </div>
        </div>
        <div ref="boxRightRefDom" class="box-right">
          <div ref="paintBoxRefDom" class="box-paint scrollY" style="text-align: right">
            <canvas ref="canvasGridRefDom">您的浏览器不支持 HTML5 canvas标签</canvas>
            <canvas ref="canvasGuideBoxRefDom" style="z-index: 99">
              您的浏览器不支持 HTML5 canvas标签
            </canvas>

            <template v-for="item in tagList">
              <TagItem
                v-if="!item.hide"
                :key="item.tagId"
                :style="{ background: getLegendConfig(item).color || '#000000' }"
                :tag-item="item"
              >
                <template #tagTip="{ tagData }">
                  <slot name="tagTip" :tag-data="tagData"></slot>
                </template>
              </TagItem>
            </template>
          </div>
          <div ref="scrollXBarDom" class="scrollXBar">
            <div :style="{ width: paintBoxInfo.width + 'px' }"></div>
          </div>
        </div>
        <div ref="scrollYBarDom" class="scrollYBar">
          <div :style="{ height: paintBoxInfo.height + 'px' }"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted, getCurrentInstance, nextTick } from 'vue'
import { utils } from './utils'
import TagItem from './components/TagItem.vue'

const { proxy } = getCurrentInstance()
const props = defineProps({
  /** 甘特图标题 */
  title: {
    type: String,
    default: '甘特图'
  },
  /** 甘特图背景色 */
  ganttBgColor: {
    type: String,
    default: '#ffffff'
  },
  /** 画布左侧 "类目列" 宽 */
  paintLeft: {
    type: String,
    default: '100px'
  },
  /** 画布顶部 "时间列" 高 */
  paintTop: {
    type: String,
    default: '40px'
  },
  /** 网格线的颜色 */
  gridLineColor: {
    type: String,
    default: '#dddddd'
  },
  /** 甘特图行 */
  colsInfo: {
    type: Array,
    // required: true,
    default: () => [
      { label: '花都', value: 1 },
      { label: '乐同', value: 2 },
      { label: '狮岭', value: 3 },
      { label: '银盏', value: 4 },
      { label: '龙塘镇', value: 5 },
      { label: '清城', value: 6 }
    ]
  },
  /** 甘特图列 */
  rowsInfo: {
    type: Array,
    // required: true,
    default: () => [
      {
        label: '花都',
        tags: [
          { startNum: 0.5, endNum: 1.5, label: '5000', type: 1 },
          { startNum: 0.5, endNum: 2.5, label: '6000', type: 2 },
          { startNum: 0.5, endNum: 3.5, label: '7000', type: 3 },
          { startNum: 0.5, endNum: 4.5, label: '8000', type: 4 },
          { startNum: 0.5, endNum: 5.5, label: '10000', type: 5 }
        ]
      },
      {
        label: '乐同',
        tags: [
          { startNum: 1.5, endNum: 2.5, label: '6000', type: 1 },
          { startNum: 1.5, endNum: 3.5, label: '7000', type: 2 },
          { startNum: 1.5, endNum: 4.5, label: '8000', type: 3 },
          { startNum: 1.5, endNum: 5.5, label: '10000', type: 4 }
        ]
      },
      {
        label: '狮岭',
        tags: [
          { startNum: 2.5, endNum: 3.5, label: '7000', type: 1 },
          { startNum: 2.5, endNum: 4.5, label: '8000', type: 2 },
          { startNum: 2.5, endNum: 5.5, label: '10000', type: 3 }
        ]
      },
      {
        label: '银盏',
        tags: [
          { startNum: 3.5, endNum: 4.5, label: '8000', type: 1 },
          { startNum: 3.5, endNum: 5.5, label: '10000', type: 2 }
        ]
      },
      {
        label: '龙塘镇',
        tags: [{ startNum: 4.5, endNum: 5.5, label: '10000', type: 1 }]
      }
    ]
  },
  /** 停用行-背景色 */
  disabledBgColor: {
    type: String,
    default: '#ececec'
  },
  legend: {
    type: Array,
    // required: true,
    default: () => [
      { color: '#00a98e', type: 1 },
      { color: '#009ff7', type: 2 },
      { color: '#c76dd1', type: 3 },
      { color: '#eb6552', type: 4 },
      { color: '#8b9715', type: 5 }
    ]
  }
})
/** 标题宽 */
const paintLeftVal = () => +utils.delValUnit(props.paintLeft)
/** 标题高 */
const paintTopVal = () => +utils.delValUnit(props.paintTop)
/** 画布内拖拽区域 */
const paintBoxInfo = ref({
  width: 0,
  height: 0
})
/** 记录横向滚动的百分比 */
const scrolledXPercent = ref(0)

// ------------------------- 接口传输数据 -------------------------
const tagList = ref([])

// ------------------------- 基础定义数据 -------------------------
/** 单元格纵向padding */
const rowPaddingTop = 4
/** 单元格行高，不包含上下padding 【注意：不要小于tagHeight高度】 */
const rowContentHeight = 28
/** tag 高度 */
const tagHeight = 28
/** tag 纵向margin高度 */
const tagMarginTop = 5
/** 有数据时，单行内至少显示几行tag */
const minSowTagRow = 2
/** 计算的高度(行最小高度 - 无数据的行) */
const minRowHeight = 2 * rowPaddingTop + Math.min(...[tagHeight, rowContentHeight])
/** 有数据的行 - 至少显示几行tag【需求：有数据的行高度要高点】 */
let hasTagsDataMinRowHeight =
  2 * rowPaddingTop + minSowTagRow * tagHeight + (minSowTagRow - 1) * tagMarginTop
hasTagsDataMinRowHeight = Math.max(...[hasTagsDataMinRowHeight, minRowHeight])

let resizeObserver
const ganTTBottomHeight = ref(0)
/** 防抖 */
const tickTimer = ref(null)
const scrollTimer = ref(null)

// ------------------------- 计算表格、表头宽高 -------------------------
/** 获取 row 中的所有tag集合,返回对象格式如： {type:[tag1, tag2,...],type2:[tag1, tag2,...]} */
const getTagsMapByRowItem = (rowItem = {}) => {
  if (!rowItem || !Object.keys(rowItem).length) return {}
  const tagTypeObj = {}
  const tags = rowItem.tags || []
  tags.map(subItem => {
    tagTypeObj[subItem.type] || (tagTypeObj[subItem.type] = [])
    tagTypeObj[subItem.type].push(subItem)
  })

  return tagTypeObj
}
/** 计算甘特图对应行的行高 - 即RowsInfo中每行对应的行高，动态计算的，因为tag行是动态的 */
const calcRowHeightByRowsInfoItem = (rowItem = {}) => {
  let h = 2 * rowPaddingTop
  // tag 累计高度【包括margin】 整行高度 = row 上下padding + tag margintop【第一行tag不计算margin】 + tag高度
  const tagTypeObj = getTagsMapByRowItem(rowItem)
  const tagTypeNum = Object.keys(tagTypeObj).length
  if (tagTypeNum > 0) {
    // 内有tag
    h += tagTypeNum * tagHeight + (tagTypeNum - 1) * tagMarginTop
    // 有数据的行高度不一样，至少也比 hasTagsDataMinRowHeight 高
    h = Math.max(...[h, hasTagsDataMinRowHeight])
  }
  return Math.max(...[h, minRowHeight])
}
const getSummaryRowsHeight = () => {
  const ganttBoxRefDom = proxy.$refs['ganttBoxRefDom']
  if (!ganttBoxRefDom) return 0
  const tjRowNodes = ganttBoxRefDom.querySelectorAll('.stat-bottom') || []
  let h = 0
  for (let i = tjRowNodes.length - 1; i >= 0; i--) {
    const nodeItem = tjRowNodes[i]
    h += utils.getDOMWH(nodeItem).h
  }
  return h
}
/** 计算甘特图每行高度，每列宽度，重要函数，渲染前提是这里的计算正确！！！ */
const calcWHCore = () => {
  // 表头宽度处理
  const headerDom = proxy.$refs['headerBoxRefDom']
  if (!headerDom || !headerDom.parentNode) return
  const headerWidth = utils.getDOMWH(headerDom).w
  const len = props.colsInfo.length
  const wd = Math.max(...[paintLeftVal(), (headerWidth / len).toFixed(2)])
  props.colsInfo.map(item => {
    item.w = wd
  })

  // 计算行 - 实际高度【高度 = 无tag行最小高度+ 有tag行高度(最小tag所在行高或者撑开的高度)】
  props.rowsInfo.map(item => {
    // 计算当前行的行高
    item.h = +calcRowHeightByRowsInfoItem(item)
  })
  // 甘特图高度处理
  const ganttBoxRefDom = proxy.$refs['ganttBoxRefDom']
  if (!ganttBoxRefDom) return
  // 开启高度自适应
  const { h: ganttHeight } = utils.getDOMWH(ganttBoxRefDom)
  let remainHeight = ganttHeight - paintTopVal() - getSummaryRowsHeight()
  if (remainHeight <= 0) {
    // 父盒子没有设置最小高度则默认撑开 - 注意：只是初始渲染的高度，后面都以这个为准
    remainHeight = props.rowsInfo.reduce((pre, next) => pre + next.h, 0)
  }
  // 计算实际计算高度
  const realH = props.rowsInfo.reduce((pre, next) => pre + next.h, 0)
  if (remainHeight >= realH) {
    // 剩余高度大于计算高度,需要重新分配高度，有tag的数据行平分多出来的高度
    // 计算有几行有tag数据
    let hasTagRowsNum = 0
    props.rowsInfo.map(item => {
      if (item.tags && item.tags.length) {
        hasTagRowsNum++
      }
    })
    // 分配剩下的高度
    const zlH = Number(((remainHeight - realH) / hasTagRowsNum).toFixed(6))
    props.rowsInfo.map(item => {
      if (item.tags && item.tags.length) {
        item.h = Math.floor(zlH + item.h)
      }
    })
  }
  ganTTBottomHeight.value = remainHeight
}
/** 将宽高同步到dom */
const renderToDom = () => {
  const gbRefDom = proxy.$refs['ganttBoxRefDom']
  if (!gbRefDom) return
  // tag拖拽区域
  const paintWidth = +props.colsInfo.reduce((pre, next) => (pre += Number(next.w)), 0)
  const paintHeight = +props.rowsInfo.reduce((pre, next) => (pre += Number(next.h)), 0)

  paintBoxInfo.value.width = paintWidth
  paintBoxInfo.value.height = paintHeight
  // 行
  {
    const nodes = gbRefDom.querySelectorAll('.paint-row') || []
    nodes.forEach((dom, index) => {
      utils.setDOMH(dom, props.rowsInfo[index].h)
    })
  }
  // 列
  {
    const nodes = gbRefDom.querySelectorAll('.paint-col') || []
    nodes.forEach((dom, index) => {
      utils.setDOMW(dom, props.colsInfo[index].w)
    })
  }
  // 全屏甘特图的网格【宽高为整个甘特图宽高】 - 用于补充“画布内网格”未绘制的区域
  {
    const gtDom = proxy.$refs['ganttBoxRefDom']
    const canvas = proxy.$refs['canvasGanttRefDom']
    utils.setCanvasWH(canvas, utils.getDOMWH(gtDom).w, utils.getDOMWH(gtDom).h)
  }
  // 画布内网格canvas
  {
    const canvas = proxy.$refs['canvasGridRefDom']
    utils.setCanvasWH(canvas, paintWidth, paintHeight)
  }
}
/** 刷新甘特图宽高 */
const refreshGTTWH = () => {
  calcWHCore()
  renderToDom()
  drawGridCanvas()
  createTagList()
}
/** 画布resize -重新计算相关布局元素 */
const event_windowResize = () => {
  clearTimeout(tickTimer.value)
  tickTimer.value = setTimeout(() => {
    console.log('甘特图 resize...')
    try {
      refreshGTTWH()
      nextTick(() => {
        scrollToDurationTime()
      })
    } catch (e) {
      console.error('甘特图 resize error：', e)
    }
  })
}

// ------------------------- 网格线 -------------------------
/** 绘制禁用行 */
const drawDisabledRow = canvas => {
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  const x = 0
  let y = 0
  props.rowsInfo.map(item => {
    if (item.disabled) {
      ctx.fillStyle = props.disabledBgColor
      // fillRect(x, y, width, height)：绘制一个填充的矩形。
      ctx.fillRect(x, y, canvas.width, item.h)
    }
    y += item.h
  })
}
/** 画线 */
const drawGridLine = (ctx, beginPoints = [], endPoints = []) => {
  if (!beginPoints.length === 2 || !endPoints.length === 2) return
  ctx.beginPath()
  // canvas画线太粗并且模糊解决方法：+0.5 而且canvas不能设置box-sizing: border-box;设置了也不行
  ctx.moveTo(beginPoints[0] + 0.5, beginPoints[1] + 0.5)
  ctx.lineTo(endPoints[0] + 0.5, endPoints[1] + 0.5)
  ctx.lineWidth = 1
  ctx.strokeStyle = props.gridLineColor
  ctx.lineCap = 'butt'
  ctx.stroke()
}
/** 绘制网格、禁用行背景色 */
const drawGridCanvas = () => {
  const canvas = proxy.$refs['canvasGridRefDom']
  if (!canvas) return
  const width = canvas.width
  const height = canvas.height
  const ctx = canvas.getContext('2d')
  utils.clearCanvas(canvas)

  // 禁用行背景
  drawDisabledRow(canvas)

  // 内容区域-网格
  {
    // 行
    const rows = props.rowsInfo
    let y = 0
    rows.map((item, index) => {
      y += item.h
      if (index !== 0 || index !== rows.length - 1) {
        drawGridLine(ctx, [0, y], [width, y])
      }
    })

    // 列
    const cols = props.colsInfo
    let w = 0
    cols.map((item, index) => {
      w += item.w
      if (index !== 0 || index !== cols.length - 1) {
        drawGridLine(ctx, [w, 0], [w, height])
      }
    })
  }
  // 标题栏、整体-网格 - 补充没有绘制到的区域
  {
    const ganttCanvas = proxy.$refs['canvasGanttRefDom']
    if (!ganttCanvas) return
    const _width = ganttCanvas.width - 1.2
    const _height = ganttCanvas.height - 1.2
    const _ctx = ganttCanvas.getContext('2d')

    const points = {
      leftTop: [0, 0],
      rightTop: [_width, 0],
      // 最后一个，因为+0.5后会超出。因此减去一点F
      rightBottom: [_width, _height],
      leftBottom: [0, _height]
    }

    // 边框上
    drawGridLine(_ctx, points.leftTop, points.rightTop)
    // 边框右
    drawGridLine(_ctx, points.rightTop, points.rightBottom)
    // 边框下
    drawGridLine(_ctx, points.leftBottom, points.rightBottom)
    // 边框左
    drawGridLine(_ctx, points.leftTop, points.leftBottom)

    // 标题
    drawGridLine(_ctx, [0, paintTopVal()], [_width, paintTopVal()])
    drawGridLine(_ctx, [paintLeftVal(), 0], [paintLeftVal(), _height])

    // 底部-展示的统计行
    const ganttBoxRefDom = proxy.$refs['ganttBoxRefDom']
    if (!ganttBoxRefDom) return
    const tjRowNodes = ganttBoxRefDom.querySelectorAll('.stat-bottom') || []
    let _y = ganttCanvas.height
    const _x = ganttCanvas.width
    // 从后面向上减就不用考虑标题行因素
    for (let i = tjRowNodes.length - 1; i >= 0; i--) {
      const nodeItem = tjRowNodes[i]
      _y -= utils.getDOMWH(nodeItem).h
      drawGridLine(_ctx, [0, _y], [_x, _y])
    }
  }
}

// ------------------------- tag数据 -------------------------
const getPxOfTimeParticle = () => {
  const paintBoxDom = proxy.$refs['paintBoxRefDom']
  if (props.colsInfo.length <= 0 || !paintBoxDom) return false
  return utils.getDOMWH(paintBoxDom).w / props.colsInfo.length
}
const calcTagLeftAndWidth = item => {
  const { startNum, endNum } = item
  if (startNum == null || endNum == null) return null
  if (props.colsInfo.length <= 0) return false
  if (startNum < 0) {
    console.error('开始计数不能小于甘特图任务开始计数!')
    return false
  }
  const sp = endNum - startNum
  if (sp < 0) {
    console.error('开始计数要小于结束计数')
    return null
  }
  const pxOfTimeParticle = getPxOfTimeParticle()
  // 甘特图起止时间
  return {
    left: Number(startNum * pxOfTimeParticle).toFixed(6) + 'px',
    width: Number(sp * pxOfTimeParticle).toFixed(6) + 'px'
  }
}
/** 计算指定tag类型在行内的top，注意是距离当前行顶部的距离 */
const calcTagInRowTop = (parentKey, tagType) => {
  if (!parentKey || !tagType) return 0
  const findRow = props.rowsInfo.find(row => row.label === parentKey)
  const tagTypeObj = getTagsMapByRowItem(findRow) // 当前行所有tag
  const th = tagHeight // tag 高度固定
  const legendData = props.legend
  const tagMarginBottom = tagMarginTop
  let rowInTop = 0
  for (let i = 0; i < legendData.length; i++) {
    const item = legendData[i]
    const isThis = item.type === tagType // tag是不是这个类型
    if (tagTypeObj[item.type] && !isThis) {
      // 行里面有这个类型，且当前tag在后面
      rowInTop += tagMarginBottom + th
    }
    if (isThis) {
      break
    }
  }
  rowInTop += rowPaddingTop // 加上上边距
  return rowInTop
}
/** 计算 “第几行” 距离 paintBoxRefDom 画布顶部距离 【注意：不包含当前行高度，是当前行顶部距离画布顶部的距离】 */
const calcRowTopByRowIndex = (rowIndex = 0) => {
  let y = 0
  for (let i = 0; i < props.rowsInfo.length; i++) {
    const item = props.rowsInfo[i]
    if (i === rowIndex) {
      break
    } else {
      y += item.h
    }
  }

  return y
}
/** 根据行label获取当前行距离画布【paintBoxRefDom】顶部的距离 */
const calcRowTopByRowLabel = (parentKey = '') => {
  if (!parentKey) return 0
  const findRowIndex = props.rowsInfo.findIndex(row => row.label === parentKey)
  if (findRowIndex < 0) return 0
  const rowTop = calcRowTopByRowIndex(findRowIndex)
  return rowTop
}
/** 计算指定tag类型距离画布顶部的距离 */
const calcTagOffsetCanvasTop = (parentKey, tagType) => {
  if (!parentKey || !tagType) return 0
  const rowTop = calcRowTopByRowLabel(parentKey)
  // 计算tag 距离所在行顶部距离 - 注意这里是当前行内
  const rowInTop = calcTagInRowTop(parentKey, tagType)
  return rowTop + rowInTop
}
/** 根据所属行的label，与tag的类型来计算tag的 top、高度 */
const calcTagTopAndHeight = (parentKey, tagType) => {
  return {
    top: calcTagOffsetCanvasTop(parentKey, tagType) + 'px',
    height: tagHeight + 'px' // tag 高度固定
  }
}
/** tag 构造 */
const factoryTag = (tagItem = {}, rowParent = {}) => {
  const _item = {
    // 存储原始数据
    data: tagItem,
    hide: false,
    // 记录所属父节点 - 行
    parentKey: rowParent.label || '',
    // 生成唯一id
    tagId: tagItem.tagId,
    ...tagItem,
    style: {
      top: 0,
      width: 'auto',
      left: 0,
      height: tagHeight + 'px',
      transform: 'translateX(0)'
    }
  }

  // style横向信息赋值
  const style_horizontal = calcTagLeftAndWidth(_item)
  if (style_horizontal) {
    _item.style.left = style_horizontal.left
    _item.style.width = style_horizontal.width
  }

  // style纵向信息赋值
  const style_vertical = calcTagTopAndHeight(_item.parentKey, _item.type)
  if (style_vertical) {
    _item.style.top = style_vertical.top
    _item.style.height = style_vertical.height
  }
  return _item
}
/** 垂直居中tag 【原理：修改每个tag的top值实现】 - 前提是 props.rowsInfo 计算完成！ */
const verticalTag = () => {
  // 1.获取每行内的tag的最大 top
  const obj = {}
  tagList.value.map(item => {
    const top = +utils.delValUnit(item.style.top)
    obj[item.parentKey] || (obj[item.parentKey] = top)
    if (top > obj[item.parentKey]) {
      obj[item.parentKey] = top
    }
  })

  // 2.计算行内tag下的剩余高度
  let y = 0
  const rowPaddingBottom = rowPaddingTop
  props.rowsInfo.map(row => {
    const rowKey = row.label
    const rowHeight = +row.h
    if (!utils.isNull(obj[rowKey])) {
      obj[rowKey] = y + rowHeight - Number(obj[rowKey]) - tagHeight - rowPaddingBottom
    }
    y += row.h
  })

  // 3.给tag赋值
  tagList.value.map(item => {
    if (!utils.isNull(obj[item.parentKey])) {
      item.style.top =
        +utils.delValUnit(item.style.top) +
        Number((obj[item.parentKey] / 2 || 0).toFixed(4)) +
        'px'
    }
  })
}
/** 生成tag一维数据 */
const createTagList = () => {
  let tagListNew = []
  props.rowsInfo.forEach(row => {
    const arr = (row.tags || []).map(tagItem => factoryTag(tagItem, row))
    tagListNew = tagListNew.concat(arr)
  })
  tagList.value = tagListNew
  verticalTag() // 垂直居中tag
}
/** 获取tag 对应 legend的配置 */
const getLegendConfig = _tagItem => {
  return props.legend.find(item => item.type == _tagItem.type) || {}
}

// ------------------------- 滚动条 -------------------------
/** 获取纵向滚动距离 */
const getScrollTop = () => {
  // 纵向滚动条
  const scrollYBarDom = proxy.$refs['scrollYBarDom']
  if (!scrollYBarDom) return 0
  return scrollYBarDom.scrollTop
}
/** 获取横向滚动距离 */
const getScrollLeft = () => {
  // 横向滚动条
  const scrollXBarDom = proxy.$refs['scrollXBarDom']
  if (!scrollXBarDom) return 0
  return scrollXBarDom.scrollLeft
}
/** 鼠标滚轮滚动，滚动条滚动 */
const mousewheelHandle = e => {
  // 纵向滚动条
  const scrollYBarDom = proxy.$refs['scrollYBarDom']
  if (!scrollYBarDom) return
  // 【在甘特图内滚动鼠标，若甘特图有滚动条，滚动时触发的甘特图的滚动，没有则使用默认的滚动效果，也就是触发外层页面的滚动】
  if (scrollYBarDom.scrollHeight === scrollYBarDom.offsetHeight) return

  // 甘特图内有滚动条，则实现甘特图内部滚动效果
  e.stopPropagation()
  e.preventDefault()
  // 防抖
  scrollTimer.value && clearTimeout(scrollTimer.value)
  scrollTimer.value = setTimeout(() => {
    const dy = -e.deltaY || e.wheelDeltaY
    // 纵向滚动条
    const scrollYBarDom = proxy.$refs['scrollYBarDom']
    if (!scrollYBarDom) return
    const scrollTop = scrollYBarDom.scrollTop
    // 每次滚动6分之一
    let distance = utils.getDOMWH(scrollYBarDom).h / 6
    if (dy < 0) {
      // console.log('向下');
    } else {
      // console.log('向上');
      distance = -1 * distance
    }
    scrollYBarDom.scrollTop = scrollTop + distance
    scrollYHandle()
  })
}
/** 获取时间标题的单列宽 */
const getTimeColW = () => {
  if (!props.colsInfo.length) return 0
  return props.colsInfo[0].w || 0
}
const getDurationTimeWidth = () => {
  const len = props.colsInfo.length
  return getTimeColW() * len
}
const scrollGanTTXTo = (value = 0) => {
  const scrollXBarDom = proxy.$refs['scrollXBarDom'] // 横向滚动条
  if (!scrollXBarDom) return
  scrollXBarDom.scrollLeft = value || 0
}
/** 初始化横向滚动条初始距离，初始时应该滚到任务持续时间区间范围内 */
const scrollToDurationTime = () => {
  scrollGanTTXTo(getDurationTimeWidth())
}
/** 横向滚动条滚动位置变化，同步到其他横向滚动项 */
const scrollXHandle = e => {
  const ganttBoxRefDom = proxy.$refs['ganttBoxRefDom']
  // 横向滚动条
  const scrollXBarDom = proxy.$refs['scrollXBarDom']
  // 横向需要跟着滚动条滚动的内容
  const scrollContentDom = proxy.$refs['paintBoxRefDom']
  if (!ganttBoxRefDom || !scrollXBarDom || !scrollContentDom) return
  // 需要跟着横向滚动的标题
  const headerDomNodes = ganttBoxRefDom.querySelectorAll('.scrollX')
  const scrollLeft = -1 * (getScrollLeft() || 0)
  headerDomNodes.forEach(nodeItem => {
    // nodeItem.style.left = scrollLeft + 'px'
    nodeItem.style.transform = `translateX(${scrollLeft}px)`
  })
  scrollContentDom.style.left = `${scrollLeft}px`

  // 记录滚动百分比
  scrolledXPercent.value =
    Number((getScrollLeft() / scrollXBarDom.scrollWidth).toFixed(6)) * 100
}
const addScrollXEvent = () => {
  const scrollXBarDom = proxy.$refs['scrollXBarDom'] // 横向滚动条
  if (!scrollXBarDom) return
  scrollXBarDom.addEventListener('scroll', scrollXHandle, false)
}
/** 纵向滚动条滚动位置变化，同步到其他纵向滚动项 */
const scrollYHandle = e => {
  const ganttBoxRefDom = proxy.$refs['ganttBoxRefDom']
  // 纵向滚动条
  const scrollYBarDom = proxy.$refs['scrollYBarDom']
  if (!ganttBoxRefDom || !scrollYBarDom) return
  // 需要跟着纵向滚动的内容
  const scrollDoms = ganttBoxRefDom.querySelectorAll('.scrollY')
  const scrollTop = -1 * (getScrollTop() || 0)
  scrollDoms.forEach(nodeItem => {
    nodeItem.style.transform = `translateY(${scrollTop}px)`
  })
}
const addScrollYEvent = () => {
  // 纵向滚动条
  const scrollYBarDom = proxy.$refs['scrollYBarDom']
  // 画布内容
  const paintBoxRefDom = proxy.$refs['paintBoxRefDom']
  if (!scrollYBarDom || !paintBoxRefDom) return
  scrollYBarDom.addEventListener('scroll', scrollYHandle, false)
  paintBoxRefDom.addEventListener('mousewheel', mousewheelHandle, false)
}

// ------------------------- 初始化事件 -------------------------
/** 事件处理 */
const removeScrollXEvent = () => {
  const scrollXBarDom = proxy.$refs['scrollXBarDom'] // 横向滚动条
  if (!scrollXBarDom) return
  scrollXBarDom.removeEventListener('scroll', scrollXHandle)
}
const removeScrollYEvent = () => {
  scrollTimer.value && clearTimeout(scrollTimer.value)
  // 纵向滚动条
  const scrollYBarDom = proxy.$refs['scrollYBarDom']
  // 画布内容
  const paintBoxRefDom = proxy.$refs['paintBoxRefDom']
  if (!scrollYBarDom || !paintBoxRefDom) return
  scrollYBarDom.removeEventListener('scroll', scrollYHandle)
  paintBoxRefDom.removeEventListener('mousewheel', mousewheelHandle, false)
}
const removeEvents = () => {
  const ganttBoxRefDom = proxy.$refs['ganttBoxRefDom']
  // 结束对指定 Element 的监听。
  ganttBoxRefDom && resizeObserver?.unobserve(ganttBoxRefDom)
  // 横向纵向滚动条
  removeScrollXEvent()
  removeScrollYEvent()
}
const addEvents = () => {
  const boxDom = proxy.$refs['ganttBoxRefDom']
  removeEvents()
  // 1.指定resize事件
  resizeObserver = new ResizeObserver(event_windowResize)
  // 2.指定该resize事件的触发dom
  resizeObserver.observe(boxDom)

  // 3.滚动条
  addScrollXEvent()
  // 启用高度自适应功能-监控纵向滚动条
  addScrollYEvent()
}

/** mounted */
const init = () => {
  addEvents()
}
onMounted(() => {
  init()
})
onUnmounted(() => {
  removeEvents()
})
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>

import { beginOfDay, endOfDay } from '@/utils/dateUtils'

export const datePickerOptions = {
  shortcuts: [
    {
      text: '最近一周',
      onClick(picker) {
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
        const end = new Date()
        picker.$emit('pick', [beginOfDay(start), endOfDay(end)])
      }
    },
    {
      text: '最近一个月',
      onClick(picker) {
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
        const end = new Date()
        picker.$emit('pick', [beginOfDay(start), endOfDay(end)])
      }
    },
    {
      text: '最近三个月',
      onClick(picker) {
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
        const end = new Date()
        picker.$emit('pick', [beginOfDay(start), endOfDay(end)])
      }
    }
  ]
}

// 菜单管理-菜单类型
export const FUNC_TYPE_LIST = [
  { label: '模块', value: '0' },
  { label: '按钮', value: '1' }
]
// 菜单管理-菜单有效
export const FUNC_STATE_LIST = [
  { label: '有效', value: '0' },
  { label: '无效', value: '1' }
]
// 操作日志-状态
export const OPERATION_STATUS_LIST = [
  { label: '正常', value: '1' },
  { label: '异常', value: '2' }
]
// 操作日志-查询类型
export const BUSINESS_LIST_LIST = [
  { label: '其它', value: '0' },
  { label: '登录', value: '1' },
  { label: '登出', value: '2' },
  { label: '新增', value: '3' },
  { label: '修改', value: '4' },
  { label: '删除', value: '5' },
  { label: '授权', value: '6' },
  { label: '导入', value: '7' },
  { label: '导出', value: '8' },
  { label: '清空数据', value: '9' },
  { label: '查询', value: '10' }
]
// 操作日志-清理日志
export const TIME_LIST = [
  { label: '一个月前', value: '1' },
  { label: '三个月前', value: '3' },
  { label: '半年前', value: '6' },
  { label: '一年前', value: '12' },
  { label: '全部', value: '0' }
]
// 错误码管理
export const MESSAGE_TYPE_LIST = [
  { label: 'error', value: 0 },
  { label: 'warn', value: 1 },
  { label: 'info', value: 2 }
]

export const TEMPLATE_TYPE = [
  { label: 'url从码值取，json无或固定', value: 'fixedUrl' },
  { label: 'url从请求结果中获取，json无或固定', value: 'dynamicUrl' },
  { label: 'url从码值取，json从请求获取', value: 'fixedJson' },
  { label: 'url从请求结果中获取，json从请求获取', value: 'dynamicJson' },
  { label: '由自定义job类方法处理', value: 'classJson' }
]

export const CLASS_TYPE = [
  { label: '上传工作类', value: 'uploadJob' },
  { label: '本地工作类', value: 'localJob' },
  { label: '上传简单类', value: 'uploadSimple' },
  { label: '本地简单类', value: 'localSimple' },
  { label: '上传控制类', value: 'uploadController' },
  { label: '本地控制类', value: 'localController' }
]

export const STATE = [
  { label: '提交中', value: '1' },
  { label: '进行中', value: '2' },
  { label: '已完成', value: '4' },
  { label: '已取消', value: '5' }
]

export const SEND_TYPE = [
  { label: 'text', value: 'text' },
  { label: 'textcard', value: 'textcard' }
]

export const STATUS = [
  { label: '停用', value: '0' },
  { label: '启用', value: '1' },
  { label: '锁定', value: '2' }
]

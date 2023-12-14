import { ref } from 'vue'

const columns = ref([
  {
    field: 'date',
    label: '日期',
    visible: true
  },
  {
    field: 'name',
    label: '姓名',
    visible: true
  },
  {
    field: 'address',
    label: '地址',
    visible: true
  }
])

export { columns }

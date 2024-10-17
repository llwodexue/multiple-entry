<template>
  <div class="app-container">
    <div class="table-container">
      <el-scrollbar class="todo-wrapper">
        <div class="note-con">
          <div class="note-header">
            <div class="note-title">便签</div>
            <div class="note-btn" @click="handleAdd">
              <svg-icon icon-class="add1" class="icon-add" />
              <span>创建</span>
            </div>
          </div>
          <div class="idea-con">
            <span class="idea-todo" @click="setToDoFlag(false)">
              <span class="idea-num">{{ ideaToDo }}</span>
              个想法
            </span>
            <span class="idea-finish" @click="setToDoFlag(true)">
              <span class="idea-num">{{ finishToDo }}</span>
              个已完成
            </span>
          </div>
          <div class="todo-con">
            <VueDraggable
              v-model="showTodoList"
              class="todo-draggable"
              :scroll="true"
              target=".sort-target"
              @start="onStart"
              @end="onEnd"
            >
              <TransitionGroup type="transition" name="fade" class="sort-target">
                <div v-for="item in showTodoList" :key="item.id" class="todo-item">
                  <svg-icon v-if="item.isDragging" icon-class="draggable" class="icon-drag" />
                  <el-checkbox
                    v-model="item.isCompleted"
                    :disabled="item.isDragging"
                    :class="item.isDragging ? '' : 'pl24'"
                    @change="handleCheck(item)"
                  />
                  <span
                    class="todo-title"
                    :class="[item.isCompleted ? 'todo-complete' : '', item.isDragging ? 'pl8' : 'pl24']"
                    @dblclick="handleEdit(item)"
                  >
                    {{ item.content }}
                  </span>
                </div>
              </TransitionGroup>
            </VueDraggable>
          </div>
        </div>
      </el-scrollbar>
    </div>
    <el-dialog v-dialogDrag :visible.sync="dialogVisible" :modal="false" width="400px">
      <el-form ref="formRef" :model="formData" :rules="formRules" :inline="true">
        <el-form-item prop="htmlContent">
          <vue-editor v-model="formData.htmlContent"></vue-editor>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关 闭</el-button>
        <el-button type="primary" @click="submitContent">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, ref, watchEffect, getCurrentInstance } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import { VueEditor } from 'vue2-editor'

const { proxy } = getCurrentInstance()

/** 完成/未完成展示 */
const todoList = ref(proxy.$cache.local.getJSON('toDoList') || [])
const showTodoList = ref([])
// 未完成ToDo
const ideaToDo = computed(() => todoList.value.filter(item => !item.isCompleted).length)
// 已完成ToDo
const finishToDo = computed(() => todoList.value.filter(item => item.isCompleted).length)
const toDoFlag = ref(false)
const setToDoFlag = val => (toDoFlag.value = val)
watchEffect(() => {
  showTodoList.value = todoList.value.filter(item => item.isCompleted === toDoFlag.value)
})

/** 拖拽逻辑 */
const onStart = event => {
  event.data.isDragging = true
}
const onEnd = event => {
  event.data.isDragging = false
}

const formRules = ref({ htmlContent: [{ required: true, message: '请输入内容', trigger: 'change' }] })
/** 弹出框逻辑 */
const dialogType = ref('add')
const dialogVisible = ref(false)
const formData = ref({})
const handleAdd = () => {
  dialogType.value = 'add'
  dialogVisible.value = true
  formData.value = {
    isCompleted: false,
    htmlContent: '',
    content: '',
    isDragging: false,
    id: generateUniqueString()
  }
}
const handleEdit = row => {
  console.log(row)
  dialogType.value = 'edit'
  dialogVisible.value = true
  formData.value = row
}
function generateUniqueString(length = 32) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}
function stripHtmlTags(str) {
  return str.replace(/<[^>]*>/g, '')
}
const handleCheck = row => {
  const todoIndex = todoList.value.findIndex(item => item.id === row.id)
  todoList.value[todoIndex].isCompleted = row.isCompleted
  proxy.$cache.local.setJSON('toDoList', todoList.value)
}
const submitContent = () => {
  proxy.$refs.formRef.validate(valid => {
    if (!valid) return
    if (dialogType.value === 'add') {
      todoList.value.unshift({
        ...formData.value,
        content: stripHtmlTags(formData.value.htmlContent)
      })
      setToDoFlag(false)
    } else if (dialogType.value === 'edit') {
      const todoIndex = todoList.value.findIndex(item => item.id === formData.value.id)
      todoList.value[todoIndex].htmlContent = formData.value.htmlContent
      todoList.value[todoIndex].content = stripHtmlTags(formData.value.htmlContent)
    }
    proxy.$cache.local.setJSON('toDoList', todoList.value)
    dialogVisible.value = false
  })
}
</script>

<style lang="scss" scoped>
.table-container {
  background-color: #f5f5f5;
}
.todo-wrapper {
  height: 500px;
  width: 360px;
  background: var(--Tky-white-color);
}
.pl24 {
  padding-left: 24px;
}
.pl8 {
  padding-left: 8px;
}
.note-con {
  background: var(--Tky-white-color);
  color: var(--Tky-font-gray-1);
  width: 360px;
  .note-header {
    padding: 16px 24px 0 24px;
    display: flex;
    justify-content: space-between;
    .note-title {
      font-size: 18px;
      font-weight: 600;
      line-height: 26px;
    }
    .note-btn {
      font-size: 14px;
      font-weight: 400;
      line-height: 22px;
      cursor: pointer;
      display: flex;
      align-items: center;
    }
  }
  .icon-add {
    width: 16px;
    height: 16px;
    margin-right: 4px;
  }
  .icon-drag {
    width: 16px;
    height: 16px;
    margin: 0 6px;
  }
  .idea-con {
    padding: 0 24px;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
  }
  .idea-finish {
    margin-left: 8px;
  }
  .idea-todo,
  .idea-finish {
    cursor: pointer;
  }
  .idea-num {
    color: var(--Tky-brand-color-6);
  }
  .todo-con {
    .todo-draggable {
      background: var(--Tky-white-color);
    }
    .todo-item {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      height: 40px;
      cursor: move;
      .el-checkbox {
        width: 16px;
        height: 16px;
      }
      :deep(.el-checkbox__inner) {
        border-color: var(--Tky-gray-color-4);
        background-color: transparent;
      }
      :deep(.el-checkbox__input.is-checked .el-checkbox__inner::after) {
        border-color: var(--Tky-font-gray-2);
      }
      :deep(.el-checkbox__input.is-disabled .el-checkbox__inner) {
        background-color: var(--Tky-gray-color-1);
      }
      .el-input {
        margin-left: 8px;
      }
      :deep(.el-input__inner),
      :deep(.el-textarea__inner) {
        background: var(--Tky-white-color);
        border: none;
      }
      .todo-title {
        font-size: 16px;
        font-weight: 400;
        line-height: 24px;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding-right: 24px;
      }
      .todo-complete {
        text-decoration: line-through;
        color: var(--Tky-font-gray-3);
      }
    }
  }
}
:deep(.sortable-ghost) {
  width: 100%;
  background: transparent !important;
  color: var(--Tky-font-gray-1) !important;
  opacity: 1;
  box-shadow: 0px 3px 14px 2px #0000000d;
}
:deep(.el-scrollbar__wrap) {
  overflow-x: hidden;
}
:deep(.el-dialog__header) {
  height: 32px;
  background: var(--Tky-gray-color-1);
}
:deep(.el-dialog__headerbtn) {
  top: 10px;
}
:deep(.el-dialog__footer) {
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--Tky-gray-color-1);
  border-top: 1px solid var(--Tky-gray-color-3);
}
.fade-move,
.fade-enter-active,
.fade-leave-active {
  transition: all 0.6s cubic-bezier(0.55, 0, 0.1, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scaleY(0.01) translate(30px, 0);
}

.fade-leave-active {
  position: absolute;
}
</style>

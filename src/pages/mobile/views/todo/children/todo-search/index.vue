<template>
  <div class="todo-search">
    <van-popup
      :value="show"
      closeable
      round
      position="bottom"
      :style="{ height: '40%' }"
      @click-close-icon="handleClose"
      @click-overlay="handleClose"
    >
      <div class="title">筛选</div>
      <van-form>
        <van-field v-model="queryInfo.systemName" name="应用系统" label="应用系统" placeholder="请输入应用系统名称" />
        <van-field v-model="queryInfo.userName" name="发送人" label="发送人" placeholder="请输入发送人">
          <template #right-icon>
            <van-icon name="arrow" @click="showSenderPicker = true" />
          </template>
        </van-field>
        <van-popup v-model="showSenderPicker" position="bottom" round :style="{ height: '40%' }">
          <van-picker
            title="发送人"
            show-toolbar
            :columns="senderOptions"
            @confirm="handleSenderConfirm"
            @cancel="showSenderPicker = false"
          />
        </van-popup>

        <div class="time">
          <div class="label">
            <van-field label="时间" />
          </div>
          <div class="start-time">
            <van-field
              readonly
              clickable
              :value="queryInfo.startTime"
              name="picker"
              placeholder="请选择开始时间"
              :error-message="startTimeErrorMsg"
              @click="showStartTimePicker = true"
            />
            <van-popup v-model="showStartTimePicker" position="bottom" round :style="{ height: '40%' }">
              <van-datetime-picker
                v-model="startTime"
                type="date"
                title="开始时间"
                @confirm="handleStartTimeConfirm"
                @cancel="showStartTimePicker = false"
              />
            </van-popup>
          </div>
          <div class="line" />
          <div class="end-time">
            <van-field
              readonly
              clickable
              :value="queryInfo.endTime"
              name="picker"
              placeholder="请选择结束时间"
              :error-message="endTimeErrorMsg"
              @click="showEndTimePicker = true"
            />
            <van-popup v-model="showEndTimePicker" position="bottom" round :style="{ height: '40%' }">
              <van-datetime-picker
                v-model="endTime"
                type="date"
                title="结束时间"
                @confirm="handleEndTimeConfirm"
                @cancel="showEndTimePicker = false"
              />
            </van-popup>
          </div>
        </div>
      </van-form>

      <div class="btns">
        <van-button block @click="reset">重置</van-button>
        <van-button block type="info" @click="search">确定</van-button>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { parseTime, diffDate } from '@/utils'

const initialQueryInfo = {
  systemName: '',
  userName: '',
  startTime: '',
  endTime: ''
}

export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    senderOptions: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      queryInfo: { ...initialQueryInfo },
      showSenderPicker: false,
      showTimePicker: false,
      showStartTimePicker: false,
      showEndTimePicker: false,
      startTime: new Date(),
      endTime: new Date(),
      startTimeErrorMsg: '',
      endTimeErrorMsg: ''
    }
  },
  computed: {
    routeQueryInfo() {
      const { params } = this.$route
      return params
    }
  },
  watch: {
    routeQueryInfo: {
      handler: function (newValue) {
        this.queryInfo.systemName = newValue.systemName ?? ''
        this.search()
      },
      immediate: true
    },
    startTime() {
      this.validateTime()
    },
    endTime() {
      this.validateTime()
    }
  },
  methods: {
    handleSenderConfirm(value) {
      this.queryInfo.userName = value
      this.showSenderPicker = false
    },
    validateTime() {
      if (!this.startTime) {
        this.startTimeErrorMsg = '请选择开始时间'
        return
      } else {
        this.startTimeErrorMsg = ''
      }
      if (this.endTime) {
        const datesent = diffDate(this.startTime, this.endTime)
        if (datesent < 0) {
          this.endTimeErrorMsg = '结束时间不应小于开始时间'
        } else {
          this.endTimeErrorMsg = ''
        }
      }
    },
    handleStartTimeConfirm(value) {
      const startTime = parseTime(value, '{y}-{m}-{d}')
      this.queryInfo.startTime = startTime
      this.showStartTimePicker = false
    },
    handleEndTimeConfirm(value) {
      const endTime = parseTime(value, '{y}-{m}-{d}')
      this.queryInfo.endTime = endTime
      this.showEndTimePicker = false
    },
    handleClose() {
      this.handleSearch()
      this.$emit('update:show', false)
    },
    reset() {
      this.queryInfo = { ...initialQueryInfo }
    },
    handleSearch() {
      const { systemName, userName, startTime, endTime } = this.queryInfo
      const time = []
      if (startTime && endTime) {
        time.push(startTime)
        time.push(endTime)
      }

      const params = {
        systemName,
        username: userName,
        time
      }
      this.$emit('search', params)
    },
    search() {
      this.handleClose()
    }
  }
}
</script>

<style lang="scss" scoped>
.title {
  padding: 16px 0 8px 0;
  text-align: center;
}
.time {
  display: flex;
  align-items: center;
  .label {
    :deep(.van-cell) {
      padding-right: 0 !important;
    }
    :deep(.van-field__value) {
      display: none;
    }
  }
  .start-time {
    :deep(.van-cell) {
      padding-left: 0;
      padding-right: 0;
    }
  }
  .line {
    width: 10px;
    height: 0;
    border-bottom: 1px solid #333;
  }
  :deep(.van-cell::after) {
    border-bottom: unset;
  }
}
.btns {
  display: flex;
  align-items: center;
  position: absolute;
  bottom: 5%;
  left: 0;
  width: 100%;
}
</style>

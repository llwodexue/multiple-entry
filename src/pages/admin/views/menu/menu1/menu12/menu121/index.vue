<template>
  <div class="app-container">
    <div class="table-search">
      <el-form inline>
        <el-form-item :label="label">
          <el-input
            v-model="val"
            :placeholder="`${label} 请输入内容测试路由缓存`"
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 10 }"
            style="width: 300px"
          />
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Menu121',
  data() {
    return {
      label: 'Menu121',
      val: ''
    }
  }
}
</script>

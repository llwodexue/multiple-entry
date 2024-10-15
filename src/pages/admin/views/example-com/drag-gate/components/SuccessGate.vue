<template>
  <div class="drag-gate">
    <div class="gate-top">
      <svg-icon icon-class="gate" :class="['icon-gate', 'success']" />
    </div>
    <div class="gate-bottom">
      <el-input v-model="gateNo" maxlength="3" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const gateNo = ref(228)
</script>

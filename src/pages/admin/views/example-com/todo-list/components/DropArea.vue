<template>
  <div ref="droparea" @drop.stop="drop" @dragover.prevent="dragEnter" @dragleave.prevent="dragLeave">
    <slot></slot>
    <div v-if="isOver" class="over">
      <slot name="over"></slot>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isOver: false
    }
  },
  methods: {
    drop(event) {
      // Your drop logic here
      this.isOver = false
    },
    dragEnter(event) {
      // Your drag enter logic here
      this.isOver = true
    },
    dragLeave(event) {
      // Your drag leave logic here
      this.isOver = false
    }
  }
}
</script>

<script>
export default {
  name: 'drop-area',
  data() {
    return {
      isOver: false
    }
  },
  methods: {
    drop(event) {
      this.isOver = false
      let id = event.dataTransfer.getData('text')
      this.$emit('drop', id)
    },
    dragEnter(event) {
      this.isOver = true
    },
    dragLeave(event) {
      this.isOver = false
    }
  }
}
</script>

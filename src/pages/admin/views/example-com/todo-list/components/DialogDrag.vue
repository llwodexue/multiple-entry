<template>
  <div
    :id="id"
    class="dialog-drag"
    :draggable="drag"
    :class="!drag ? 'fixed' : ''"
    :style="dialogStyle"
    @mousedown="mouseDown"
    @touchstart.prevent="touchStart"
    @touchmove.passive="touchMove"
    @touchend.stop="touchEnd"
  >
    <div class="dialog-header">
      <div class="title">
        <!-- Title slot -->
        <slot name="title">
          <!-- Render title prop, if title slot is empty -->
          <span v-if="title">{{ title }}</span>
          <span v-else>&nbsp;</span>
        </slot>
      </div>
      <div class="buttons">
        <!-- Pin Button -->
        <button v-if="buttonPin" class="pin" @click="setDrag" @touchstart="setDrag">
          <!-- Button pin slot -->
          <slot v-if="drag" name="button-pin"></slot>
          <!-- Button pinned slot -->
          <slot v-if="!drag" name="button-pinned">
            <!-- Render button-pin slot if button-pinned slot is empty -->
            <slot v-if="!drag" name="button-pin"></slot>
          </slot>
        </button>
        <!-- Close Button -->
        <button v-if="buttonClose" class="close" @click.stop="close" @touchstart.passive="close">
          <slot name="button-close"></slot>
        </button>
      </div>
    </div>
    <!-- Default slot -->
    <div class="dialog-body">
      <slot>
        <div class="blank-body"></div>
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DialogDrag',
  props: ['id', 'title', 'options', 'eventCb'],
  data() {
    return {
      width: 0,
      height: 0,
      zIndex: 0,
      offset: {
        x: 0,
        y: 0
      },
      left: 0,
      top: 0,
      buttonClose: true,
      buttonPin: true,
      dragEnabled: true,
      drag: true,
      touch: null,
      overEvent: null,
      centered: false,
      dropEnabled: true,
      dragCursor: 'default',
      dragging: false,
      clickButton: false,
      pX: 0,
      pY: 0,
      availableOptions: [
        'left',
        'top',
        'width',
        'height',
        'buttonPin',
        'buttonClose',
        'centered',
        'dropEnabled',
        'dragCursor',
        'zIndex'
      ]
    }
  },
  computed: {
    dialogStyle() {
      const style = { left: this.left + 'px', top: this.top + 'px' }
      if (this.width) style.width = this.width + 'px'
      if (this.height) style.height = this.height + 'px'
      if (this.zIndex) style.zIndex = this.zIndex
      if (this.drag) {
        style['user-select'] = 'none'
        style.cursor = this.dragCursor
      }
      return style
    }
  },
  watch: {
    options(newValue) {
      this.setOptions(newValue)
      if (newValue.centered) this.center()
    }
  },
  created() {
    this.setOptions(this.options)
  },
  mounted() {
    if (this.dropEnabled) {
      this.$el.addEventListener('dragstart', this.dragStart)
      this.$el.addEventListener('dragend', this.dragEnd)
      window.addEventListener('dragover', this.dragOver)
    } else {
      document.addEventListener('mousemove', this.mouseMove, { passive: true })
      document.addEventListener('mouseup', this.mouseUp)
    }
    if (this.centered) {
      const vm = this
      this.$nextTick(() => {
        vm.center()
        vm.emit('load')
      })
    } else {
      this.emit('load')
    }
  },
  beforeDestroy() {
    if (this.dropEnabled) {
      window.removeEventListener('dragover', this.dragOver)
    } else {
      document.removeEventListener('mousemove', this.mouseMove)
      document.removeEventListener('mouseup', this.mouseUp)
    }
  },
  methods: {
    mouseOut(event) {
      if (!this.dragEnabled && this.dragging) {
        this.move(event)
      }
    },
    dragOver(event) {
      if (this.dropEnabled) {
        this.overEvent = event
        this.emit('move')
      }
    },
    mouseOver(event) {
      setTimeout(this.mouseMove(event), 50)
    },
    close() {
      this.clickButton = 'close'
      this.emit('close')
    },
    setDrag() {
      if (this.dragEnabled) {
        this.drag = !this.drag
        this.emit('pin')
      }
    },
    dragStart(event) {
      event.stopPropagation()
      if (this.drag && this.dragEnabled && this.dropEnabled) {
        event.dataTransfer.setData('text', event.target.id)
        this.startMove(event)
      }
    },
    dragEnd(event) {
      event.preventDefault()
      if (this.dropEnabled) {
        this.move(event)
        this.emit('drag-end')
      }
    },
    mouseDown(event) {
      if (!this.dragging) this.focus()
      if (!this.dropEnabled) {
        if (this.drag) event.preventDefault()
        this.startMove(event)
      }
    },
    mouseMove(event) {
      // event.preventDefault()
      if (!this.dropEnabled && this.dragging && this.drag) {
        // event.stopPropagation()
        setTimeout(this.move(event), 50)
      }
    },
    mouseUp(event) {
      event.preventDefault()
      if (!this.dropEnabled) {
        this.stopMove()
        this.emit('dragEnd')
      }
    },
    touchStart(event) {
      this.emit('focus')
      this.startMove(event.targetTouches[0])
    },
    touchMove(event) {
      this.move(event.targetTouches[0])
    },
    touchEnd(event) {
      this.emit('dragEnd')
      this.stopMove()
    },
    stopMove() {
      this.dragging = false
      this.pX = 0
      this.pY = 0
    },
    emit(eventName, data) {
      data = data || {
        id: this.id,
        left: this.left,
        top: this.top,
        x: this.left,
        y: this.top,
        z: this.zIndex,
        pinned: !this.drag,
        width: this.$el.clientWidth,
        height: this.$el.clientHeight
      }
      if (this.eventCb) {
        const ef = this.eventCb
        if (ef && typeof ef === 'function') {
          data = ef(data)
        }
      }
      this.$emit(eventName, data)
    },
    move(event) {
      if (this.drag && this.dragEnabled) {
        if (event.clientX === 0) event = this.overEvent // for firefox
        if (event && event.clientX && event.clientY) {
          const x = event.clientX
          const y = event.clientY
          this.left = x + this.offset.x
          this.top = y + this.offset.y
          this.dragging++
          this.emit('move')
        }
      }
    },
    clearSelection() {
      if (document.selection) {
        document.selection.empty()
      } else if (window.getSelection) {
        window.getSelection().removeAllRanges()
      }
    },
    startMove(event) {
      const x = this.left - event.clientX
      const y = this.top - event.clientY
      this.offset = { x, y }
      this.dragging = 1
      this.emit('drag-start')
    },
    focus(event) {
      if (this.drag) this.clearSelection()
      const vm = this
      setTimeout(() => {
        if (!vm.clickButton) vm.emit('focus')
      }, 200)
    },
    center() {
      let ww, wh
      if (this.centered === 'window') {
        ww = window.innerWidth
        wh = window.innerHeight
      }
      if (this.centered === 'viewport') {
        const body = document.body
        ww = body.clientWidth + body.scrollLeft
        wh = body.clientHeight + body.scrollTop
      }
      ww = ww || this.$parent.$el.clientWidth
      wh = wh || this.$parent.$el.clientHeight
      this.left = ww / 2 - this.$el.clientWidth / 2
      this.top = wh / 2 - this.$el.clientHeight / 2
    },
    setOptions(options) {
      if (options) {
        if (options.x) options.left = options.x
        if (options.y) options.top = options.y
        if (options.z) options.zIndex = options.z
        this.drag = this.options.pinned ? false : this.drag
        // available options
        const ops = this.availableOptions
        for (const op of ops) {
          if (this.options.hasOwnProperty(op)) {
            this.$set(this, op, this.options[op])
          }
        }
      }
    }
  }
}
</script>

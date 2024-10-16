<template>
  <div id="app">
    <div class="menu-container">
      <!-- Droparea -->
      新增
      <drop-area @drop="drop">
        <small v-if="!droppeds.length">Drop dialog here</small>
        <!-- Dialogs container -->
        <div v-for="dialog in droppeds" :key="dialog.id" class="dropped" @click="unDrop(dialog.id)">
          <div class="name">{{ dialog.name }}</div>
        </div>
      </drop-area>

      <!-- Restore dialogs message -->
      <small v-if="droppeds.length">
        <em>Click an icon to restore dialog</em>
      </small>

      <!-- Menu -->
      <div class="menu">
        <div class="title">
          <h1>{{ app.name }}</h1>
          <h2 class="subtitle">{{ app.des }}</h2>
        </div>
        <button class="btn" @click="newDialog(style)">new dialog</button>
        <div class="set">
          <label>Dialog Style:</label>
          <select v-model="style">
            <option :value="null">random</option>
            <option v-for="(style, key) in styles" :value="key">{{ style.name }}</option>
          </select>
        </div>
      </div>

      <!-- Console -->
      <div v-if="selected" class="console">
        <p>Dialog Selected</p>
        <small>{{ selected }}</small>
      </div>

      <!-- DIALOGS -->
      <div class="dialogs">
        <dialog-drag
          v-for="(dialog, key) in dialogs"
          :id="dialog.id"
          :key="dialog.id"
          :ref="'dialog-' + dialog.id"
          :class="dialog.style.name"
          :options="dialog.options"
          @close="removeDialog"
          @drag-end="dialogDragEnd"
          @drag-start="selectDialog"
          @move="dialogDragEnd"
        >
          <span slot="title">{{ dialog.name }}</span>
          <p>{{ dialog.content }}</p>
          <small>
            <strong>Style: {{ dialog.style.name }}</strong>
            <p>
              <strong>options:</strong>
            </p>
            <p>
              <small>
                <em>{{ dialog.options }}</em>
              </small>
            </p>
          </small>
        </dialog-drag>
      </div>
    </div>
  </div>
</template>

<script>
import DialogDrag from './DialogDrag'
import DropArea from './DropArea'
import rndText from './randomText.js'

export default {
  name: 'Example',
  components: {
    DialogDrag,
    DropArea
  },
  data() {
    return {
      dialogs: [],
      dialogId: 1,
      styles: [
        { name: 'dialog-1', options: { width: 400 } },
        { name: 'dialog-2', options: { width: 150, buttonPin: false } },
        { name: 'dialog-3' }
      ],
      style: null,
      selected: null,
      dialogWidth: 400,
      droppeds: [],
      app: process.env.APP
    }
  },
  created() {
    for (let i = 0; i < this.styles.length; i++) {
      const index = this.newDialog(i) - 1
      this.dialogs[index].options.left = index * this.dialogWidth + 50 * index + 1
    }
  },
  methods: {
    drop(id) {
      const index = this.findDialog(id)
      if (index !== null) {
        this.droppeds.push(this.dialogs[index])
        this.dialogs.splice(index, 1)
      }
    },
    unDrop(id) {
      const index = this.findDialog(id, this.droppeds)
      if (index !== null) {
        this.dialogs.push(this.droppeds[index])
        this.droppeds.splice(index, 1)
      }
    },
    newDialog(sId) {
      if (sId === null) sId = Math.floor(Math.random() * this.styles.length)
      return this.dialogs.push(this.dialog(this.styles[sId]))
    },
    removeDialog(dialog) {
      const id = dialog.id
      const index = this.findDialog(id)
      this.dialogs.splice(index, 1)
      if (this.selected && this.selected.id === id) this.selected = null
    },
    findDialog(id, dialogs) {
      if (!dialogs) dialogs = this.dialogs
      const index = dialogs.findIndex(val => {
        return val.id === id
      })
      return index > -1 ? index : null
    },
    dialog(style) {
      const id = String(this.dialogId)
      this.dialogId++
      const name = 'Dialog ' + id
      const content = rndText()
      let options = {}
      if (style.options) options = Object.assign({}, style.options)
      if (!options.left) options.left = 30 * id
      if (!options.top) options.top = 30 * id
      return { id, name, content, style, options }
    },
    dialogDragEnd(obj) {
      const index = this.findDialog(obj.id)
      this.$set(this.dialogs[index].options, 'left', obj.left)
      this.$set(this.dialogs[index].options, 'top', obj.top)
    },
    selectDialog(obj) {
      const index = this.findDialog(obj.id)
      this.selected = this.dialogs[index]
    }
  }
}
</script>

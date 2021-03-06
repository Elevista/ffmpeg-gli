<template>
  <div class="outputs flex-column d-flex">
    <div class="title d-flex justify-content-between align-items-center">
      Outputs
      <span class="d-flex flex-row">
        <mu-button small icon color="rgba(0,0,0,0.7)" class="addAll" :disabled="!inputs.length"
                   @click="addAll"
        >
          <mu-icon value="reply_all" />
        </mu-button>
        <Presets :disabled="!outputs.length" color="rgba(0,0,0,0.7)" all />
        <mu-button :disabled="!outputs.length" small icon color="rgba(0,0,0,0.7)" @click="openExecute">
          <mu-icon value="launch" />
        </mu-button>
      </span>
    </div>
    <draggable :value="outputs" :options="draggableOptions" class="cards" style="list-style-type: none;" @change="onChange">
      <Output v-for="(output,idx) of outputs" :key="output.key" :output="output" :stream-default-option="streamDefaultOption" :idx="idx"
              @remove="onRemoved(idx)"
      />
    </draggable>
    <execute :show.sync="show" />
    <mu-dialog :open.sync="dialog.show" :esc-press-close="false" :overlay-close="false">
      <span style="white-space: pre-wrap;">{{ dialog.content }}</span>
      <mu-button slot="actions" flat color="primary" @click="dialog.deferred.resolve(true)">Yes</mu-button>
      <mu-button slot="actions" flat @click="dialog.deferred.resolve(false)">No</mu-button>
    </mu-dialog>
    <options />
  </div>
</template>
<script>
import Presets from './Presets.vue'
import Options from './Options/Options.vue'
import Deferred from '~/utils/Deferred'
import Output from './Output.vue'
import Execute from './Execute.vue'
import path from 'path'
import fs from 'fs'
import { promisify } from 'util'
const stat = promisify(fs.stat)

export default {
  name: 'Outputs',
  components: { Output, Options, Execute, Presets },
  data () {
    return {
      show: false,
      draggableOptions: {
        group: {
          name: 'shared',
          pull: false
        },
        animation: 150
      },
      dialog: {
        show: false,
        content: '',
        deferred: null
      }
    }
  },
  computed: {
    outputs () { return this.$store.state.outputs },
    inputs () { return this.$store.state.inputs }
  },
  methods: {
    streamDefaultOption (stream) {
      return stream.type === 'Subtitle' ? {} : { '-c': 'copy' }
    },
    showDialog (content) {
      const deferred = new Deferred()
      Object.assign(this.dialog, { content, deferred, show: true })
      return deferred.promise.finally(() => { this.dialog.show = false })
    },
    addAll () {
      this.inputs.forEach(input => this.onAdded(this.outputs.length, input))
    },
    onStreamAdded (newIndex, stream) {
      stream.options = this.streamDefaultOption(stream)
      const input = this.$store.state.inputs[stream.input]
      const { dir, ext } = input
      const name = `${input.name.slice(0, -ext.length)}-output${ext}`
      const output = { class: 'Output', dir, name, key: performance.now() + Math.random(), streams: [stream], options: {} }
      const outputs = this.outputs.slice()
      outputs.splice(newIndex, 0, output)
      this.$store.commit('setOutputs', outputs)
    },
    onInputAdded (newIndex, input) {
      const { dir, ext } = input
      const name = `${input.name.slice(0, -ext.length)}-output${ext}`
      const streams = input.streams.map(x => Object.assign({}, x, {
        options: this.streamDefaultOption(x),
        key: performance.now() + Math.random()
      }))
      const output = { class: 'Output', dir, name, key: performance.now() + Math.random(), streams, options: {} }
      const outputs = this.outputs.slice()
      outputs.splice(newIndex, 0, output)
      this.$store.commit('setOutputs', outputs)
    },
    onAdded (newIndex, el) {
      const element = _.cloneDeep(el)
      if (element.class === 'Input') this.onInputAdded(newIndex, element)
      else if (element.class === 'Stream') this.onStreamAdded(newIndex, element)
    },
    onMoved (newIndex, oldIndex, stream) {
      const outputs = this.outputs.slice()
      outputs[newIndex] = this.outputs[oldIndex]
      outputs[oldIndex] = this.outputs[newIndex]
      this.$store.commit('setOutputs', outputs)
    },
    onRemoved (oldIndex) {
      const outputs = this.outputs.slice()
      outputs.splice(oldIndex, 1)
      this.$store.commit('setOutputs', outputs)
    },
    onChange ({ added, moved, removed }) {
      const { newIndex, oldIndex, element: stream } = added || moved
      if (added) return this.onAdded(newIndex, stream)
      if (moved) return this.onMoved(newIndex, oldIndex, stream)
      if (removed) return this.onMoved(oldIndex)
    },
    async openExecute () {
      const outputFiles = this.outputs.map(({ dir, name }) => path.join(dir, name))
      const exists = await Promise.all(outputFiles.map(x => stat(x).catch(e => false)))
        .then(r => r.map((x, i) => x && outputFiles[i]).filter(x => x).join('\n'))
      if (exists) {
        const overwrite = await this.showDialog(`File\n${exists}\nalready exists. Overwrite ?`)
        if (!overwrite) return
      }
      this.show = true
    }
  }
}
</script>
<style scoped>
.cards{ list-style-type: none; flex:1; padding: 8px; }
.addAll{transform: rotate(180deg) rotateX(-180deg);}
</style>

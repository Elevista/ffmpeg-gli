<template>
  <div class="inputs flex-column d-flex" @drop.prevent="drop">
    <div class="title d-flex justify-content-between align-items-center">
      Inputs
      <span>
        <mu-button small icon color="rgba(0,0,0,0.7)" @click="openFiles">
          <mu-icon value="add" />
        </mu-button>
      </span>
    </div>
    <draggable :value="inputs" :options="draggableOptions" class="cards" style="list-style-type: none;">
      <!-- eslint-disable-next-line vue/html-self-closing -->
      <Input v-for="(input,idx) of inputs" :key="input.key" :input="input" @remove="onRemove(idx)" />
    </draggable>
  </div>
</template>
<script>
import Input from './Input.vue'
import ffmpeg from '~/utils/ffmpeg'
import { dirname, extname, basename } from 'path'
import { remote } from 'electron'
import fs from 'fs'
import { promisify } from 'util'
import { lookup as mime } from 'mime-types'
import { filters } from '~/utils/fileTypes'
const stat = promisify(fs.stat)
export default {
  name: 'Inputs',
  components: { Input },
  data () {
    return {
      draggableOptions: {
        group: {
          name: 'shared',
          pull: 'clone',
          put: false
        },
        animation: 150,
        sort: false
      }
    }
  },
  computed: {
    inputs () { return this.$store.state.inputs }
  },
  methods: {
    async openFiles () {
      const selectedFiles = remote.dialog.showOpenDialog({ properties: ['openFile', 'multiSelections'], filters })
      if (!selectedFiles) return
      const files = []
      for (const path of selectedFiles) {
        const { mtimeMs: lastModified, mtime: lastModifiedDate, size } = await stat(path)
        files.push({ lastModified, lastModifiedDate, name: basename(path), path, size, type: mime(extname(path)) })
      }
      this.addFiles(files)
    },
    onRemove (idx) {
      this.$store.commit('removeInput', idx)
    },
    parseStreamText (text) {
      const match = text.match(/Stream #(\d+:\d+)(\(\w+\))?: (Video|Audio|Subtitle): (.+)/)
      if (!match) return
      const [ , id, , type, etc ] = match
      const [codec, ...info] = etc.split(', ')
      const [input, stream] = id.split(':')
      const inputKey = this.$store.state.inputs[input].key
      return { class: 'Stream', input, stream, key: Math.random().toString().slice(2), type, codec, info, inputKey }
    },
    async setStreams () {
      const res = await ffmpeg(this.inputs.map(x => ['-i', x.path]))
      const durations = (res.match(/Duration: [\w:/.]+/g) || [])
        .map(x => x.slice(10))
        .map(x => /[\d:.]+/.test(x) && moment.duration(x))
      const streams = (res.match(/Stream #\d+:\d+(\(\w+\))?:.+/g) || [])
        .map(this.parseStreamText).filter(x => x)
      streams.filter(stream => !this.inputs[stream.input].streams).forEach(stream => {
        const input = this.inputs[stream.input]
        const streams = (this.inputs[stream.input].streams || []).slice()
        streams.push(stream)
        stream.duration = durations[stream.input]
        this.$store.commit('assignInput', [input, { streams }])
      })
    },
    async addFiles (files) {
      const q = []
      let dir = ''
      for (const f of files) {
        const { lastModified, lastModifiedDate, name, path, size, type } = f
        if (/Stream #\d+:\d+/.test(await ffmpeg('-i', path))) {
          q.push(() => this.$store.commit('addInput', {
            class: 'Input',
            lastModified,
            lastModifiedDate,
            name,
            path,
            size,
            type,
            dir: dirname(path),
            ext: extname(name),
            key: Math.random().toString().slice(2),
            streams: null
          }))
          dir = dirname(path)
        }
      }
      if (dir) this.$store.commit('setInputDir', dir)
      if (q.length) {
        q.forEach(x => x())
        this.setStreams()
      }
    },
    drop (evt) {
      this.addFiles(evt.dataTransfer.files)
    }
  }
}
</script>
<style scoped>
.cards{ list-style-type: none; flex:1; padding: 8px; }
</style>

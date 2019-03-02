<template>
  <mu-card class="output">
    <mu-card-header>
      <mu-button icon color="rgba(0,0,0,0.7)" @click.native="$store.commit('setSelectedElement',output)">
        <mu-icon :value="icon" />
      </mu-button>
      <mu-text-field v-model="name" style="flex:1" class="name" @click.native.stop />
      <mu-button small icon color="rgba(0,0,0,0.7)" @click="selectDir">
        <mu-icon value="folder_open" />
      </mu-button>
    </mu-card-header>
    <mu-card-text>
      <mu-list>
        <draggable :value="streams" :options="draggableOptions" class="draggable" @change="onChange">
          <stream v-for="(stream,index) of streams" :key="stream.key" :stream="stream" @remove="onRemoved(index)" />
        </draggable>
      </mu-list>
    </mu-card-text>
  </mu-card>
</template>
<script>
import Stream from './Stream.vue'
import { extname, join, basename, dirname } from 'path'
import { remote } from 'electron'
import { exts, filters } from '~/utils/fileTypes'

export default {
  name: 'Output',
  components: { Stream },
  props: ['output', 'idx', 'streamDefaultOption'],
  data () {
    return {
      editName: this.output.name,
      editDir: this.output.dir,
      draggableOptions: {
        group: {
          name: 'shared',
          pull: true
        },
        animation: 150
      }
    }
  },
  computed: {
    streams () { return this.output.streams },
    path: {
      get () { return join(this.dir, this.name) },
      set (v) {
        this.name = basename(v)
        this.dir = dirname(v)
      }
    },
    name: {
      get () { return this.editName },
      set (v) {
        this.editName = v
        this.$store.commit('assignOutput', [this.output, { name: v }])
      }
    },
    dir: {
      get () { return this.editDir },
      set (v) {
        this.editDir = v
        this.$store.commit('assignOutput', [this.output, { dir: v }])
      }
    },
    isVideo () {
      return exts.video.includes(extname(this.editName || ''))
    },
    isAudio () {
      return exts.audio.includes(extname(this.editName || ''))
    },
    isSubtitle () {
      return exts.subtitle.includes(extname(this.editName || ''))
    },
    icon () {
      const { isVideo, isAudio, isSubtitle } = this
      if (isVideo) return 'videocam'
      if (isAudio) return 'audiotrack'
      if (isSubtitle) return 'subtitles'
      return 'insert_drive_file'
    }
  },
  methods: {
    selectDir () {
      const path = remote.dialog.showSaveDialog({ defaultPath: this.path, filters })
      if (path) this.path = path
    },
    getOptionCommands (cls, idx) {
      return _(cls.options).map((v, option) => {
        if (!v) return
        const streamId = cls.class === 'Output' ? '' : `:${idx}`
        if (v === true) return `${option}${streamId}`
        return `${option}${streamId} ${v}`
      }).filter(x => x).join(' ')
    },
    onStreamAdded (newIndex, st) {
      if (_.find(this.streams, { key: st.key })) return // stream already exists
      const stream = _.cloneDeep(st)
      if (!stream.options) stream.options = this.streamDefaultOption(stream)
      const streams = this.streams.slice()
      streams.splice(newIndex, 0, stream)
      this.$store.commit('assignOutput', [this.output, { streams }])
    },
    onAdded (newIndex, element) {
      if (['Input', 'Output'].includes(element.class)) element.streams.forEach((x, i) => this.onStreamAdded(newIndex + i, x))
      else if (element.class === 'Stream') this.onStreamAdded(newIndex, element)
    },
    onMoved (newIndex, oldIndex, stream) {
      const streams = this.streams.slice()
      streams[newIndex] = this.streams[oldIndex]
      streams[oldIndex] = this.streams[newIndex]
      this.$store.commit('assignOutput', [this.output, { streams }])
    },
    onRemoved (oldIndex) {
      const streams = this.streams.slice()
      streams.splice(oldIndex, 1)
      if (streams.length) this.$store.commit('assignOutput', [this.output, { streams }])
      else this.$emit('remove')
    },
    onChange ({ added, moved, removed }) {
      const { newIndex, oldIndex, element: stream } = added || moved || removed
      if (added) return this.onAdded(newIndex, stream)
      if (moved) return this.onMoved(newIndex, oldIndex, stream)
      if (removed) return this.onRemoved(oldIndex)
    }
  }
}
</script>

<style scoped>
.output:first-child{ margin-bottom:8px;}
.output:not(:first-child){ margin-top: 8px;margin-bottom:8px;}
.mu-card-header{display: flex;flex-direction: row;align-items: center;padding-bottom: 0px;height: 57px;justify-content: space-between;}
.name{margin:0;padding:6px;min-height: 0;overflow:hidden;text-overflow: ellipsis;font-size: 15px;flex:1}
.draggable{min-height: 40px;}
.draggable::-webkit-scrollbar { display: none; }
.mu-list {overflow: hidden;}
</style>

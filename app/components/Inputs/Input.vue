<template>
  <mu-card class="input">
    <mu-card-header>
      <mu-icon :value="icon" class="icon" color="rgba(0,0,0,0.54)" />
      <span class="name">{{ input.name }}</span>
      <mu-button small icon color="rgba(0,0,0,0.7)" @click="$emit('remove')">
        <mu-icon value="clear" />
      </mu-button>
    </mu-card-header>
    <mu-card-text>
      <mu-list>
        <draggable :value="input.streams" :options="draggableOptions">
          <stream v-for="stream of input.streams" :key="stream.key" :stream="stream" />
        </draggable>
      </mu-list>
    </mu-card-text>
  </mu-card>
</template>

<script>
import Stream from './Stream.vue'
import { exts } from '~/utils/fileTypes'

export default {
  name: 'Input',
  components: { Stream },
  props: ['input'],
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
    isVideo () {
      const { type = '', ext = '' } = this.input
      return type.startsWith('video') || exts.video.includes(ext)
    },
    isAudio () {
      const { type = '', ext = '' } = this.input
      return type.startsWith('audio') || exts.audio.includes(ext)
    },
    isSubtitle () {
      return exts.subtitle.includes(this.input.ext)
    },
    icon () {
      const { isVideo, isAudio, isSubtitle } = this
      if (isVideo) return 'videocam'
      if (isAudio) return 'audiotrack'
      if (isSubtitle) return 'subtitles'
      return 'insert_drive_file'
    },
    info () {
      const { lastModified, type } = this.input
      return [moment(lastModified).format('YYYY.MM.DD'), type].filter(x => x).join(', ')
    }
  }
}
</script>
<style scoped>
.icon{width: 48px;height: 48px; padding: 12px;}
.input:first-child{ margin-bottom:8px;}
.input.sortable-ghost{pointer-events: none;} /* nested drop problem */
.input:not(:first-child){ margin-top: 8px;margin-bottom:8px;}
.mu-card-header{display: flex;flex-direction: row;align-items: center;padding-bottom: 0px;height: 57px;justify-content: space-between;}
.name{margin:0;padding:6px;min-height: 0;overflow:hidden;text-overflow: ellipsis;font-size: 15px;flex:1}
</style>

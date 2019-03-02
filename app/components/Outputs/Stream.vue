<template>
  <mu-list-item class="stream" button @click.native.stop="$store.commit('setSelectedElement',stream)">
    <mu-list-item-action>
      <mu-icon :value="icon" />
    </mu-list-item-action>
    <mu-list-item-content>
      <mu-list-item-title>{{ stream.codec }} [{{ stream.input }}:{{ stream.stream }}]</mu-list-item-title>
      <mu-list-item-sub-title>{{ stream.info.join(', ') }}</mu-list-item-sub-title>
    </mu-list-item-content>
    <mu-list-item-action style="min-width:20px">
      <mu-button small icon color="rgba(0,0,0,0.7)" @click.stop="$emit('remove')">
        <mu-icon value="clear" />
      </mu-button>
    </mu-list-item-action>
  </mu-list-item>
</template>
<script>
export default {
  name: 'Stream',
  props: ['stream'],
  computed: {
    input () { return this.$store.state.inputs[this.stream.input] },
    icon () {
      switch (this.stream.type) {
        case 'Video': return 'videocam'
        case 'Audio': return 'audiotrack'
        case 'Subtitle': return 'subtitles'
        default: return 'insert_drive_file'
      }
    }
  },
  watch: {
    input (v = {}) {
      if (v.key !== this.stream.inputKey) this.$emit('remove')
    }
  }
}
</script>
<style scoped>
.stream {display: flex;}
.stream >>> .mu-item-wrapper{flex:1}
.stream >>> .mu-item{height: auto;min-height: 40px;padding-top: 2px;padding-bottom:2px;}
.mu-item-title,.mu-item-sub-title{white-space: normal;height: auto;}
.mu-item-title{font-size:14px;}
.mu-item-sub-title{font-size:13px;}
</style>

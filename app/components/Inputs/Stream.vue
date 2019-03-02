<template>
  <mu-list-item class="stream" button>
    <mu-list-item-action>
      <mu-icon :value="icon" />
    </mu-list-item-action>
    <mu-list-item-content>
      <mu-list-item-title>{{ stream.codec }} [{{ stream.input }}:{{ stream.stream }}]</mu-list-item-title>
      <mu-list-item-sub-title>{{ stream.info.join(', ') }}</mu-list-item-sub-title>
    </mu-list-item-content>
  </mu-list-item>
</template>
<script>
export default {
  name: 'Stream',
  props: ['stream'],
  computed: {
    icon () {
      switch (this.stream.type) {
        case 'Video': return 'videocam'
        case 'Audio': return 'audiotrack'
        case 'Subtitle': return 'subtitles'
        default: return 'input'
      }
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

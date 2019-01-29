<template>
  <mu-dialog :open.sync="open" :esc-press-close="!running" :overlay-close="!running" width="360" transition="slide-bottom">
    <mu-list>
      <mu-list-item>
        <mu-list-item-action v-if="error">
          <mu-icon value="error" color="error"/>
        </mu-list-item-action>
        <mu-list-item-action v-else-if="complete">
          <mu-icon value="check" color="success"/>
        </mu-list-item-action>
        <mu-list-item-action v-else>
          <mu-circular-progress/>
        </mu-list-item-action>
        <mu-list-item-title><b>{{ error?'Error':complete?'Complete':'Processing' }}</b></mu-list-item-title>
      </mu-list-item>
      <template v-if="!error">
        <mu-list-item v-for="(v,k) of progress" :key="k">
          <mu-list-item-content>
            <mu-list-item-title>{{ k }}</mu-list-item-title>
          </mu-list-item-content>
          <mu-list-item-action>
            <mu-list-item-after-text>{{ v }}</mu-list-item-after-text>
          </mu-list-item-action>
        </mu-list-item>
      </template>
    </mu-list>
    <span v-if="error" style="white-space:pre-wrap;">{{ error }}</span>
    <mu-button slot="actions" flat color="primary" @click="close">{{ running?'cancel':'close' }}</mu-button>
  </mu-dialog>
</template>
<script>
import { spawn } from '~/utils/ffmpeg'
import path from 'path'

export default {
  name: 'Execute',
  props: ['show'],
  data () {
    return {
      progress: {},
      error: null,
      complete: false,
      process: null
    }
  },
  computed: {
    inputs () { return this.$store.state.inputs },
    outputs () { return this.$store.state.outputs },
    running () { return !this.error && !this.complete },
    open: {
      get () { return this.show },
      set (v) { this.$emit('update:show', v) }
    }
  },
  watch: {
    show (v) {
      this.reset()
      if (v) this.run()
      else this.process && this.process.kill()
    }
  },
  methods: {
    reset () { Object.assign(this, this.$options.data()) },
    close () {
      this.open = false
    },
    run () {
      const args = [
        '-y',
        _.map(this.inputs, input => ['-i', input.path]),
        _.map(this.outputs, output => [
          _.map(output.streams, stream => ['-map', `${stream.input}:${stream.stream}`]),
          _.map(output.streams, (stream, i) => _.map(stream.options, (v, k) => [`${k}:${i}`, v])),
          _.map(output.options, (v, k) => [k, v]),
          path.join(output.dir, output.name),
        ])
      ]
      this.process = spawn(args).progress(this.onProgress)
      this.process.promise.then(this.onComplete, this.onError)
    },
    async onError (e = {}) {
      this.error = e.message || e.error || 'unknown'
    },
    onComplete (v) {
      this.complete = true
    },
    onProgress (v) {
      this.progress = v
    },
  },
}
</script>

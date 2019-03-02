<template>
  <mu-menu cover placement="top-end" class="presets" :open.sync="menu">
    <mu-button small icon>
      <mu-icon value="tune" />
    </mu-button>
    <mu-list slot="content">
      <mu-sub-header>Presets</mu-sub-header>
      <mu-list-item v-for="[key,preset] of presetEntries" :key="key" button @click="load(preset)">
        <mu-list-item-action><mu-icon :value="icon[preset.type]||'insert_drive_file'" /></mu-list-item-action>
        <mu-list-item-title>{{ preset.name }}</mu-list-item-title>
      </mu-list-item>
      <mu-divider v-if="presetEntries.length" />
      <mu-list-item button @click="save">
        <mu-list-item-action><mu-icon value="save" /></mu-list-item-action>
        <mu-list-item-title>save</mu-list-item-title>
      </mu-list-item>
    </mu-list>
    <mu-dialog title="Create Preset" width="360" :open.sync="dialog" @close="deferred.resolve(false)">
      <mu-text-field v-model.trim="name" label="Name" full-width @keydown.enter="deferred.resolve(true)" />
      <mu-button slot="actions" flat @click="deferred.resolve(false)">Cancel</mu-button>
      <mu-button slot="actions" flat :disabled="!name" color="primary" @click="deferred.resolve(true)">Create</mu-button>
    </mu-dialog>
  </mu-menu>
</template>
<script>
import Deferred from '~/utils/Deferred'
export default {
  name: 'Presets',
  props: {
    element: { type: Object, default: () => ({}) },
    options: Object
  },
  data () {
    return {
      menu: false,
      dialog: false,
      name: '',
      deferred: new Deferred(),
      icon: { Video: 'videocam', Audio: 'audiotrack', Subtitle: 'subtitles' }
    }
  },
  computed: {
    type () { return this.element.type },
    presets () { return this.$store.state.presets },
    current () { return this.element.preset },
    presetEntries () { return Object.entries(this.presets).filter(([, v]) => v.type === this.type) }
  },
  methods: {
    load (preset) {
      this.menu = false
      this.$store.commit('setOptions', [this.element, preset.options])
    },
    remove ({ key }) {
      const presets = Object.assign({}, this.presets)
      delete presets[key]
      this.$store.commit('setPresets', presets)
    },
    make ({ key = performance.now() + Math.random(), name } = {}) {
      const { options, type } = this
      return { name, key, type, options }
    },
    save () {
      this.menu = false
      if (!this.current) return this.create()
      const { current } = this
      const presets = Object.assign({}, this.presets, { [current.key]: this.make(current) })
      this.$store.commit('setPresets', presets)
    },
    async create () {
      this.deferred = new Deferred()
      this.dialog = true
      this.name = ''
      const ok = await this.deferred.promise
      this.dialog = false
      if (!ok) return
      const preset = this.make({ name: this.name })
      const presets = Object.assign({ [preset.key]: preset }, this.presets)
      this.$store.commit('setPresets', presets)
    }
  }
}
</script>
<style scoped>
.presets /deep/ .mu-menu-activator{display: flex;}
.mu-button {text-transform:none;}
</style>

<template>
  <mu-menu cover placement="top-end" class="presets d-flex" :open.sync="menu" :class="{disabled}">
    <mu-button small icon :disabled="disabled" :color="color">
      <mu-icon value="tune" />
    </mu-button>
    <mu-list slot="content">
      <mu-sub-header>Presets</mu-sub-header>
      <mu-list-item v-for="[key,preset] of presetEntries" :key="key" button @click="click(preset)">
        <mu-list-item-action><mu-icon :value="icon[preset.type]||'insert_drive_file'" :color="currentKey==key?'primary':''" /></mu-list-item-action>
        <mu-list-item-title>{{ preset.name }}</mu-list-item-title>
        <mu-list-item-action>
          <mu-button small icon color="rgba(0,0,0,0.7)" @click.stop="remove(key)">
            <mu-icon value="clear" />
          </mu-button>
        </mu-list-item-action>
      </mu-list-item>
      <mu-list-item v-if="!presetEntries.length">
        <mu-list-item-title>no preset</mu-list-item-title>
      </mu-list-item>
      <mu-divider v-if="presetEntries.length && options" />
      <mu-list-item v-if="options" button @click="save">
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
    all: Boolean,
    color: String,
    element: { type: Object, default: () => ({}) },
    options: Object,
    disabled: Boolean
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
    currentKey () { return this.current && this.current.key },
    current () { return this.presets[this.element.options && this.element.options.$preset] },
    presetEntries () { return Object.entries(this.presets).filter(([, v]) => this.all || v.type === this.type) }
  },
  methods: {
    click (preset) {
      if (preset.key === this.currentKey) {
        this.$store.commit('setOptions', [this.element, Object.assign({}, this.element.options)])
      } else this.load(preset)
    },
    load (preset) {
      this.menu = false
      const options = Object.assign({}, preset.options)
      Object.defineProperty(options, '$preset', { value: preset.key })
      if (this.all) {
        const { type } = preset
        const { $store: { state: { outputs } } } = this
        const elements = this.type ? outputs : _(outputs).map('streams').flatten().filter({ type }).value()
        elements.forEach(element => this.$store.commit('setOptions', [element, options]))
      } else if (this.element.key) this.$store.commit('setOptions', [this.element, options])
      else return
      this.$root.$emit('snackbar', 'Preset applied')
    },
    remove (key) {
      const presets = Object.assign({}, this.presets)
      delete presets[key]
      this.$store.commit('setPresets', presets)
      this.$root.$emit('snackbar', 'Preset removed')
    },
    make ({ key = performance.now() + Math.random(), name } = {}) {
      const { type } = this
      const options = Object.assign({}, this.options)
      Object.defineProperty(options, '$preset', { value: key })
      return { name, key, type, options }
    },
    save () {
      this.menu = false
      this.current ? this.update() : this.create()
    },
    update () {
      const { current } = this
      const presets = Object.assign({}, this.presets, { [current.key]: this.make(current) })
      this.$store.commit('setPresets', presets)
      this.$root.$emit('snackbar', 'Preset updated')
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
      this.load(preset)
      this.$root.$emit('snackbar', 'Preset created')
    }
  }
}
</script>
<style scoped>
.presets /deep/ .mu-menu-activator{display: flex;}
.mu-button {text-transform:none;}
.disabled{cursor: not-allowed;}
.disabled /deep/ .mu-menu-activator{ pointer-events: none;}

</style>

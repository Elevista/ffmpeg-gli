<template>
  <mu-bottom-sheet :open="!!selectedElement" class="options" @close="closeSheet">
    <mu-list>
      <mu-sub-header class="d-flex justify-content-between align-items-center">
        Options
        <Presets v-if="selectedElement" :element="selectedElement" :options="displayOptions" />
      </mu-sub-header>
      <mu-list-item>
        <template v-for="(v,option) of options">
          <mu-button
            :key="option"
            color="primary"
            small round
            @click="open(option)"
          >
            {{ optionObject[option].name }}
          </mu-button>
        </template>
        <template v-for="{option,name} of unselectedOptionList">
          <mu-button
            :key="option"
            small round
            @click="open(option)"
          >
            {{ name }}
          </mu-button>
        </template>
      </mu-list-item>
    </mu-list>
    <mu-expansion-panel :style="{visibility:show?'visible':'hidden',opacity:show?1:0}" :expand.sync="show">
      <span slot="header">{{ selected.name }}</span>
      <Option v-if="selected.type" :key="selected.option" :option="selected" :value.sync="value" />
      <mu-button v-if="options[selected.option]" slot="action" flat @click="remove">Remove</mu-button>
      <mu-button slot="action" :disabled="selected.value&&!value" flat color="primary" @click="closeSheet">Close</mu-button>
    </mu-expansion-panel>
  </mu-bottom-sheet>
</template>
<script>
import Presets from '../Presets.vue'
import Options from './Options'
import Option from './Option.vue'
export default {
  name: 'Options',
  components: { Option, Presets },
  data () {
    return { show: false, selected: {}, value: null }
  },
  computed: {
    unselectedOptionList () {
      return this.optionList.filter(({ option }) => !this.options[option])
    },
    selectedElement () { return this.$store.state.selectedElement },
    optionList () {
      if (!this.selectedElement) return []
      const { class: cls, type } = this.selectedElement
      return cls === 'Stream' ? Options[cls][type] : Options[cls]
    },
    optionObject () { return _.keyBy(this.optionList, 'option') },
    key () {
      return this.selectedElement && this.selectedElement.key
    },
    options () {
      return this.selectedElement ? this.selectedElement.options : {}
    },
    displayOptions () {
      return Object.assign({}, this.options, this.selected.option && { [this.selected.option]: this.value })
    }
  },
  watch: {
    options (n, o) {
      if (n.$preset && n.$preset !== o.$preset && this.show) this.open(this.selected.option)
    },
    value (v) {
      this.setOption(this.selected.option, v || null)
    }
  },
  methods: {
    setOption (option, value) {
      this.$store.commit('setOption', [this.options, option, value])
    },
    async open (option) {
      this.value = null
      if (this.options[option]) {
        this.value = this.options[option]
      }
      const { type, info, name, options } = this.optionObject[option]
      this.selected = { option, type, info, name, options }
      await this.$nextTick()
      this.show = true
    },
    toggle (option, value, info) {
      if (!this.options[option]) {
        if (!value) {
          this.cancel()
          return this.setOption(option, true)
        }
        this.selected = { option, value, info }
        this.show = true
        return
      } else this.setOption(option, false)
      this.cancel()
    },
    close () {
      this.selected = {}
      this.show = false
      this.value = null
    },
    closeSheet () {
      this.$store.commit('setSelectedElement', null)
      this.close()
    },
    remove () {
      this.setOption(this.selected.option, null)
      this.close()
    }
  }
}
</script>
<style scoped>
  .mu-sub-header{padding-right:16px}
  .mu-button{text-transform: none;min-width: 34px;margin: 4px;}
  .options{max-height: 100%;overflow: auto;}
  .options /deep/ .mu-item { display: block; height: auto;}
</style>

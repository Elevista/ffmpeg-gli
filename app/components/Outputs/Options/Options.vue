<template>
  <mu-bottom-sheet :open="!!selectedElement" class="options" @close="closeSheet">
    <mu-list>
      <mu-sub-header>Options</mu-sub-header>
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
      <div slot="header">{{ selected.name }}</div>

      <template v-if="valueIsArray">
        <span v-for="(v,i) of value" :key="i">
          {{ selected.option }} {{ v }}<br>
        </span>
      </template>
      <template v-else-if="valueIsObject">
        <span v-for="(v,k) of value" :key="k">
          {{ selected.option }} {{ k }}={{ v }}<br>
        </span>
      </template>
      <template v-else>
        {{ selected.option }} {{ value }}<br>
      </template>

      <p>{{ selected.info }}</p>
      <Option v-if="selected.type" :key="selected.option" :option="selected" :value.sync="value" />
      <mu-button slot="action" flat @click="close">Cancel</mu-button>
      <mu-button v-if="options[selected.option]" slot="action" flat @click="remove">Remove</mu-button>
      <mu-button slot="action" :disabled="selected.value&&!value" flat color="primary" @click="save">Save</mu-button>
    </mu-expansion-panel>
  </mu-bottom-sheet>
</template>
<script>
import Options from './Options'
import Option from './Option.vue'
export default {
  name: 'Options',
  components: { Option },
  data () {
    return { show: false, selected: {}, value: null }
  },
  computed: {
    valueIsArray () { return _.isArray(this.value) },
    valueIsObject () { return _.isObject(this.value) },
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
    },
    save () {
      this.setOption(this.selected.option, !this.selected.type || this.value)
      this.close()
    },
  },
}
</script>
<style scoped>
  .mu-button{text-transform: none;min-width: 34px;margin: 4px;}
  .options{max-height: 100%;overflow: auto;}
</style>

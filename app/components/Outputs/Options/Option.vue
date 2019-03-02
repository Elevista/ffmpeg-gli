<template>
  <component :is="type" v-if="Types[type]" :option="option" :value="value" @update:value="$emit('update:value',$event)" />
  <mu-text-field v-else-if="type==='Number'" :value="value" type="tel" :label="type" @input="$emit('update:value',$event)" />
  <mu-select v-else-if="type==='Select'" ref="select" :value="value"
             filterable no-data-text="custom input" :label="type"
             @change.native="change"
             @change.exact="$emit('update:value',$event)"
  >
    <mu-option v-for="{name,info} of options" :key="name" :label="info" :value="name" />
  </mu-select>
  <mu-text-field v-else :value="value" type="text" :label="type" @input="$emit('update:value',$event)" />
</template>
<script>
import * as Types from './Types'
export default {
  name: 'Option',
  components: { ...Types },
  props: ['option', 'value'],
  computed: {
    Types: () => Types,
    type () { return this.option.type },
    options () { return this.option.options }
  },
  methods: {
    change () {
      const { $refs: { select } } = this
      if (select.focusIndex < 0) this.$emit('update:value', select.searchValue)
    }
  }
}
</script>

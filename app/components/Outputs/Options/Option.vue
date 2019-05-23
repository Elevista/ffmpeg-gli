<template>
  <component :is="type" v-if="Types[type]" :option="option" :value="value" @update:value="$emit('update:value',$event)" />
  <div v-else>
    <template v-if="valueIs.array">
      <span v-for="(v,i) of value" :key="i">
        {{ option.option }} {{ v }}<br>
      </span>
    </template>
    <template v-else-if="valueIs.object">
      <span v-for="(v,k) of value" :key="k">
        {{ option.option }} {{ k }}={{ v }}<br>
      </span>
    </template>
    <template v-else-if="valueIs.boolean">
      {{ option.option }}
    </template>
    <template v-else>
      {{ option.option }} {{ value }}<br>
    </template>
    <p>{{ option.info }}</p>
    <mu-text-field v-if="type==='Number'" :value="value" type="tel" :label="type" @input="$emit('update:value',$event)" />
    <mu-checkbox v-else-if="type==='Boolean'" :input-value="value" type="tel" :label="value?'Enabled':'Disabled'" @change="$emit('update:value',$event)" />
    <mu-select v-else-if="type==='Select'" ref="select" :value="value"
               filterable no-data-text="custom input" :label="type"
               @change.native="change"
               @change.exact="$emit('update:value',$event)"
    >
      <mu-option v-for="{name,info} of options" :key="name" :label="info" :value="name" />
    </mu-select>
    <mu-text-field v-else :value="value" type="text" :label="type" @input="$emit('update:value',$event)" />
  </div>
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
    options () { return this.option.options },
    valueIs () {
      return {
        array: _.isArray(this.value),
        object: _.isObject(this.value),
        boolean: typeof this.value === 'boolean'
      }
    }
  },
  methods: {
    change () {
      const { $refs: { select } } = this
      if (select.focusIndex < 0) this.$emit('update:value', select.searchValue.trim())
    }
  }
}
</script>

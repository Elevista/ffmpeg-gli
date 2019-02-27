<template>
  <mu-form :model="form">
    <component :is="type" v-if="Types[type]" :option="option" :value="value" @update:value="$emit('update:value',$event)" />
    <mu-form-item :label="type" v-else prop="input">
      <mu-text-field v-if="type==='Number'" v-model="form.input" type="tel" @input="$emit('update:value',$event)" />
      <mu-select v-else-if="type==='Select'" v-model="form.input" filterable @change="$emit('update:value',$event)">
        <mu-option v-for="{name,info} of options" :key="name" :label="info" :value="name" />
      </mu-select>
      <mu-text-field v-else v-model="form.input" type="text" @input="$emit('update:value',$event)" />
    </mu-form-item>
  </mu-form>
</template>
<script>
import * as Types from './Types'
export default {
  name: 'Option',
  components: { ...Types },
  props: ['option', 'value'],
  data () {
    return {
      form: {
        input: this.value,
      }
    }
  },
  computed: {
    Types: () => Types,
    type () { return this.option.type },
    options () { return this.option.options },
  }
}
</script>

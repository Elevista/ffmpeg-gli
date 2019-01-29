<template>
  <mu-form :model="form">
    <mu-form-item :label="label" prop="input">
      <mu-text-field v-if="type==='Number'" v-model="form.input" type="tel" @input="$emit('update:value',$event)" />
      <mu-select v-else-if="isArray" v-model="form.input" filterable @change="$emit('update:value',$event)">
        <mu-option v-for="{name,info} of type" :key="name" :label="info" :value="name" />
      </mu-select>
      <mu-text-field v-else v-model="form.input" type="text" @input="$emit('update:value',$event)" />
    </mu-form-item>
  </mu-form>
</template>
<script>
export default {
  name: 'Option',
  props: ['type', 'value'],
  data () {
    return {
      form: {
        input: this.value,
      }
    }
  },
  computed: {
    label () {
      return this.isArray ? 'Select' : this.type
    },
    isArray () {
      return _.isArray(this.type)
    }
  },
}
</script>

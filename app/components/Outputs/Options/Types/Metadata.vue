<template>
  <div class="metadata">
    <mu-form-item prop="input" label="Key">
      <mu-select :value="value" filterable full-width @change="$emit('update:value',$event)">
        <mu-option v-for="{name,info} of option.options" :key="name" :label="info" :value="name" />
      </mu-select>
    </mu-form-item>
  </div>
</template>
<script>
export default {
  name: 'Metadata',
  props: ['option', 'value']
}
</script>

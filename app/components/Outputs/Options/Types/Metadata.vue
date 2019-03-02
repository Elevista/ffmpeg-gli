<template>
  <div class="metadata">
    <mu-select :value="value" filterable full-width @change="$emit('update:value',$event)">
      <mu-option v-for="{name,info} of option.options" :key="name" :label="info" :value="name" />
    </mu-select>
  </div>
</template>
<script>
export default {
  name: 'Metadata',
  props: ['option', 'value']
}
</script>

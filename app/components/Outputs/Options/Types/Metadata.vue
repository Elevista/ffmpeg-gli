<template>
  <div class="metadata">
    <div class="chips">
      <template v-for="(v,key) of (value||{})">
        <mu-chip :key="key" class="demo-chip" delete @click="select(v,key)" @delete="remove(key)">
          {{ key }}={{ v }}
        </mu-chip>
      </template>
    </div>
    <div class="inputs d-flex flex-wrap">
      <mu-select ref="select" :value="selected.key" filterable class=" keycol-12 col-md-6"
                 no-data-text="custom input"
                 label="Key"
                 @change.exact="selectChange"
                 @change.native="inputChange"
      >
        <mu-option v-for="{name,info} of options" :key="name" :label="info" :value="name" />
      </mu-select>
      <mu-text-field v-model.trim="selected.value" label="Value" :action-icon="actionIcon" :action-click="set"
                     class="value col-12 col-md-6" @input="set"
                     @keydown.enter="set"
      />
    </div>
  </div>
</template>
<script>
export default {
  name: 'Metadata',
  props: ['option', 'value'],
  data () {
    return {
      selected: { key: '', value: '' }
    }
  },
  computed: {
    actionIcon () {
      const { selected: { key, value } } = this
      return key && value && ((this.value && this.value.hasOwnProperty(key)) ? 'edit' : 'add')
    },
    options () {
      return this.option.options
    }
  },
  methods: {
    select (value, key) {
      this.selected = { key, value }
    },
    selectChange ($evt) {
      this.selected.key = $evt
      this.set()
    },
    inputChange () {
      const { $refs: { select }, selected } = this
      if (select.focusIndex < 0) selected.key = select.searchValue.trim()
      this.set()
    },
    remove (key) {
      const value = Object.assign({}, this.value)
      delete value[key]
      this.$emit('update:value', Object.keys(value).length ? value : undefined)
    },
    set () {
      const { key, value } = this.selected
      if (!value || !key) return
      this.$emit('update:value', Object.assign({}, this.value, { [key]: value }))
    }
  }
}
</script>
<style scoped>
.chips{margin:-4px;}
.mu-chip{margin: 4px;}
.metadata .inputs {margin-right: -8px; margin-left: -8px;}
</style>

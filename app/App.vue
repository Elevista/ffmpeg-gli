<template>
  <div class="app d-flex flex-wrap" @drop.prevent @dragover.prevent>
    <inputs class="area col-12 col-md-6" />
    <outputs class="area col-12 col-md-6" />
  </div>
</template>

<script>
import Inputs from './components/Inputs/Inputs.vue'
import Outputs from './components/Outputs/Outputs.vue'

export default {
  name: 'App',
  components: { Inputs, Outputs }
}
</script>
<style scoped>
.app{
  min-height: 100vh;
  max-width: 100vw;
  overflow: hidden;
  display: flex;
  padding: 0 8px;
}
.area {padding:0;}
.area >>> .title{color: gray;padding:12px 12px 0 8px;}
</style>
<style>
body{user-select: none;}
</style>

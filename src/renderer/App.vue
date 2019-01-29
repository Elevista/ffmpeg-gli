<template>
  <mu-container class="container" fluid @drop.prevent @dragover.prevent>
    <mu-row fill align-items="stretch" style="max-width:100%">
      <mu-col span="12" md="6" fill class="d-flex">
        <inputs class="area" />
      </mu-col>
      <mu-col span="12" md="6" fill class="d-flex">
        <outputs class="area" />
      </mu-col>
    </mu-row>
  </mu-container>
</template>

<script>
import Inputs from './components/Inputs/Inputs.vue'
import Outputs from './components/Outputs/Outputs.vue'

export default {
  name: 'Index',
  components: { Inputs, Outputs }
}
</script>
<style scoped>
.container{
  min-height: 100vh;
  max-width: 100vw !important;
  overflow: hidden;
  display: flex;
}
.area >>> .title{color: gray;padding:12px 12px 0 8px;}
</style>
<style>
body{user-select: none;}
</style>

<template>
  <div class="app d-flex flex-wrap" @drop.prevent @dragover.prevent>
    <inputs class="area col-12 col-md-6" />
    <outputs class="area col-12 col-md-6" />
    <mu-snackbar :open.sync="snackbar.open">
      {{ snackbar.message }}
      <mu-button slot="action" flat color="secondary" @click="snackbar.open = false">Close</mu-button>
    </mu-snackbar>
  </div>
</template>

<script>
import Inputs from './components/Inputs/Inputs.vue'
import Outputs from './components/Outputs/Outputs.vue'

export default {
  name: 'App',
  components: { Inputs, Outputs },
  data () {
    return {
      snackbar: { open: false, message: '', timeout: null }

    }
  },
  mounted () {
    this.$root.$on('snackbar', async message => {
      this.snackbar.message = message
      this.snackbar.open = false
      clearTimeout(this.snackbar.timeout)
      await this.$nextTick()
      this.snackbar.open = true
      this.snackbar.timeout = setTimeout(() => { this.snackbar.open = false }, 2000)
    })
  }
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

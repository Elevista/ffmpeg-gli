import Vue from 'vue'
import App from './App.vue'
import store from './store'
import './plugins/MuseUI'
import './plugins/filters'
import './plugins/vuedraggable'
import './assets/material-icons.css'
import { remote } from 'electron'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({ el: 'app', render: h => h(App), store })
remote.getCurrentWindow().show()

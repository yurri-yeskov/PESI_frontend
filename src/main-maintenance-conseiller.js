import 'babel-polyfill'
import axios from 'axios'
import Vue from 'vue'
import App from './App'
import router from './router/maintenance'
import store from './store'
import VueLogger from './plugins/VueLogger'
import XeroxButton from './components/XeroxButton'
import WaitModal from './components/WaitModal'

// Force main.scss loading
require('./assets/sass/conseiller.scss')

// Axios defaults
axios.defaults.timeout = 60 * 1000

// Init Vue
Vue.use(VueLogger, { level: process.env.LOG_LEVEL, logToConsole: process.env.LOG_CONSOLE, logToServer: process.env.LOG_SERVER })
Vue.component('xerox-button', XeroxButton)
Vue.component('wait-modal', WaitModal)
Vue.config.productionTip = false

// User mode
store.dispatch('setUserType', 'conseiller')

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App }
})

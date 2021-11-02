import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import { initRouter } from './common-init'

// Specific init for DE
require('./assets/sass/main.scss')
store.dispatch('setUserType', 'de')
initRouter(router)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App }
})

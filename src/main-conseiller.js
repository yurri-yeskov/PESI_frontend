import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router/conseiller'
import store from './store'
import { initRouter } from './common-init'

// Specific init for CONSEILLER
require('./assets/sass/conseiller.scss')
store.dispatch('setUserType', 'conseiller')
initRouter(router)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App }
})

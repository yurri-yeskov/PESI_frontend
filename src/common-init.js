import axios from 'axios'
import Vue from 'vue'
import store from './store'
import VueScanner from './plugins/VueScanner'
import VueLogger from './plugins/VueLogger'
import VeeValidate from 'vee-validate'
import XeroxButton from './components/XeroxButton'
import WaitModal from './components/WaitModal'
import VueTouchKeyboard from './components/keyboard'
import keyboard from './util/keyboard'

// Axios defaults
axios.defaults.timeout = 60 * 1000

// Init Vue
Vue.use(VueScanner, { targetIp: process.env.SCANNER_IP })
Vue.use(VueLogger, { level: process.env.LOG_LEVEL, logToConsole: process.env.LOG_CONSOLE, logToServer: process.env.LOG_SERVER })
Vue.use(VeeValidate)

Vue.component('xerox-button', XeroxButton)
Vue.component('wait-modal', WaitModal)
Vue.component('vue-touch-keyboard', VueTouchKeyboard)
Vue.config.productionTip = false

store.dispatch('loadSavedDrs')

export function initRouter(router) {
  // Do not allow access to application if not authenticated
  router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth) && !store.getters.isAuthenticated) {
      next({
        path: '/Login'
      })
    }
    next()
  })
  router.beforeEach((to, from, next) => {
    keyboard.hide()
    next()
  })
}

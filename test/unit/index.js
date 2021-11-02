import Vue from 'vue'
import VueScanner from '@/plugins/VueScanner'
import VueLogger from '@/plugins/VueLogger'
import XeroxButton from '@/components/XeroxButton'
import WaitModal from '@/components/WaitModal'

Vue.use(VueScanner)
Vue.use(VueLogger, { level: 'debug', logToConsole: true, logToServer: false })
Vue.component('xerox-button', XeroxButton)
Vue.component('wait-modal', WaitModal)

Vue.config.productionTip = false

// require all test files (files that ends with .spec.js)
const testsContext = require.context('./specs', true, /\.spec$/)
testsContext.keys().forEach(testsContext)

// require all src files except main.js for coverage.
// you can also change this to match only the subset of files that
// you want coverage for.
const srcContext = require.context('../../src', true, /^\.\/(?!main(-conseiller)*(\.js)?$)/)
srcContext.keys().forEach(srcContext)

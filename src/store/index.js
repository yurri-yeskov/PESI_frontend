import Vue from 'vue'
import Vuex from 'vuex'
import authentication from './modules/authentication'
import deviceInfos from './modules/deviceInfos'
import scan from './modules/scan'
import drs from './modules/drs'

Vue.use(Vuex)
Vue.config.productionTip = false

const debug = process.env.NODE_ENV !== 'production'

/* eslint-disable no-new */
export default new Vuex.Store({
  modules: {
    authentication,
    deviceInfos,
    scan,
    drs
  },
  strict: debug
})

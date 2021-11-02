import log from '../../util/log'

let VueLogger = {}
VueLogger.install = function(Vue, options) {
  if (options) {
    log.setLogLevel(options.level ? options.level : log.LogLevels.DEBUG)
    log.setLogToConsole(options.logToConsole)
    log.setLogToServer(options.logToServer)
  }

  Vue.prototype.$log = log
}

// Auto-install
let GlobalVue = null
if (typeof window !== 'undefined') {
  GlobalVue = window.Vue
} else if (typeof global !== 'undefined') {
  GlobalVue = global.Vue
}
if (GlobalVue) {
  GlobalVue.use(VueLogger)
}

export default VueLogger

let VueScanner = {}

VueScanner.install = (Vue, options) => {
  Vue.prototype.$scanner = {
    /**
     * Launches scan with given template
     * @param {string} template target template
     * @returns {Promise<string>} job ID
     */
    launchScan(template) {
      return Promise.resolve('110')
    },

    /**
     * Creates or replaces given template
     * @param {string} template template name
     * @param {string} content template content
     * @returns {Promise<void>} empty Promise
     */
    createOrReplaceTemplate(template, content) {
      return Promise.resolve()
    },

    /**
     * Tells if the printer is in error state
     * @returns {Promise<{isError: boolean, message: string}>} error if any
     */
    checkErrors() {
      return Promise.resolve({ isError: false })
    },

    /**
     * Gives status for job
     * @param {string} jobId job to check
     * @returns {Promise<boolean>} true if running
     */
    checkStatus(jobId) {
      return new Promise(function(resolve) {
        setTimeout(() => {
          resolve(false)
        }, 3000)
      })
    },

    /**
     * Cancels target job
     * @param {string} jobId job to cancel
     * @returns {Promise<void>} empty Promise
     */
    cancelJob(jobId) {
      return Promise.resolve()
    },

    /**
     * Exits application
     * @returns {Promise<Void>}
     */
    exitApplication() {
      return Promise.resolve()
    }
  }

  /**
  * Returns device informations
  * @returns {Promise<{ mac: string, name: string, serial: string, systemSoftware: string }>} device informations
  */
  Vue.getDeviceInformations = function() {
    return Promise.resolve({ mac: '9c:93:4e:49:b6:5e', name: 'I22322', serial: '3350230237', systemSoftware: '072.060.165.14201' })
  }
}

// Auto-install
let GlobalVue = null
if (typeof window !== 'undefined') {
  GlobalVue = window.Vue
} else if (typeof global !== 'undefined') {
  GlobalVue = global.Vue
}
if (GlobalVue) {
  GlobalVue.use(VueScanner)
}

export default VueScanner

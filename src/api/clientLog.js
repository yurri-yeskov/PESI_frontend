import axios from 'axios'
import * as commons from './api-commons'

export default {
  /**
   * Adds a log to the server.
   * @param {string} level
   * @param {string} application
   * @param {string} deviceName
   * @param {string} serial
   * @param {string} systemSoftware
   * @param {string} mac
   * @param {string} comment
   * @returns {Promise<void>}
   */
  send(level, application, deviceName, serial, systemSoftware, mac, comment) {
    let headers = commons.getAuthHeaders()
    return commons.timeout(axios.post(process.env.BACKEND_ADDR + process.env.LOG_RESOURCE, {
      level: level,
      application: application,
      deviceName: deviceName,
      serial: serial,
      systemSoftware: systemSoftware,
      mac: mac,
      comment: comment
    }, headers), headers.internalSource)
  }
}

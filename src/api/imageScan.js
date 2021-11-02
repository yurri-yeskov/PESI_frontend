import axios from 'axios'
import log from '../util/log'
import * as commons from './api-commons'

export default {
  /**
   * Returns scan informations.
   * @param {string} jobId
   * @param {string} serial
   * @param {Date} creationDate
   * @returns {Promise<{fileName: string, pageCount: number}>}
   */
  searchScan(jobId, serial, creationDate) {
    log.debug(`Calling server for ${jobId} / ${serial} / ${creationDate.toISOString()}`)
    let headers = commons.getAuthHeaders()
    headers.params = {
      jobId: jobId,
      serial: serial,
      creationDate: creationDate.toISOString()
    }
    return commons.timeout(axios.get(process.env.BACKEND_ADDR + process.env.SCAN_RESOURCE + '/search', headers)).then(({ data }) => {
      return Promise.resolve({
        fileName: data.fileName,
        pageCount: data.pageCount,
        size: data.size
      })
    })
  },

  /**
   * Builds an URL for page retrieval.
   * @param {string} fileName
   * @param {number} page
   */
  getPageUrl(fileName, page) {
    return process.env.BACKEND_ADDR + process.env.SCAN_RESOURCE + `/part?fileName=${fileName}&page=${page}`
  },

  /**
   * Builds an Image for page retrieval.
   * @param {string} fileName
   * @param {number} page
   */
  getPage(fileName, page) {
    let headers = commons.getAuthHeaders()
    headers.responseType = 'arraybuffer'
    return commons.timeout(axios.get(this.getPageUrl(fileName, page), headers))
      .then(response => Buffer.from(response.data, 'binary').toString('base64'))
  },

  /**
   * Deletes given scan.
   * @param {string} fileName
   * @returns {Promise<void>}
   */
  deleteScan(fileName) {
    log.debug(`Deleting scan ${fileName}`)
    return commons.timeout(axios.delete(process.env.BACKEND_ADDR + process.env.SCAN_RESOURCE + '/file/' + fileName, commons.getAuthHeaders()))
  },

  /**
   * Merges given scans
   * @param {string[]} scans
   * @returns {Promise<{fileName: string, pageCount: number}>}
   */
  mergeScans(scans) {
    log.debug(`Merging ${scans.length} scans`)
    return commons.timeout(axios.post(process.env.BACKEND_ADDR + process.env.SCAN_RESOURCE + '/merge', scans, commons.getAuthHeaders())).then(({ data }) => {
      return Promise.resolve({
        fileName: data.fileName,
        pageCount: data.pageCount,
        size: data.size
      })
    })
  }
}

import axios from 'axios'
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
    console.log(`TODO : Calling server for ${jobId} / ${serial} / ${creationDate.toISOString()}`)
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({
          fileName: '833_3350230237_20180119-180803.pdf',
          pageCount: 3
        })
      }, commons.LATENCY)
    })
  },

  /**
   * Deletes given scan.
   * @param {string} fileName
   * @returns {Promise<void>}
   */
  deleteScan(fileName) {
    console.log(`TODO : Deleting scan ${fileName}`)
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve()
      }, commons.LATENCY)
    })
  },

  /**
   * Builds an URL for page retrieval.
   * @param {string} fileName
   * @param {number} page
   */
  getPageUrl(fileName, page) {
    return 'http://www.format-papier-a0-a1-a2-a3-a4-a5.fr/format-a4/a4.jpg'
  }
}

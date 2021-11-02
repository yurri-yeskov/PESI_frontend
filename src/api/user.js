import log from '../util/log'
import axios from 'axios'
import * as commons from './api-commons'

export default {
  /**
   * Initiates a scanner login (IP based).
   */
  loginScanner() {
    let base = process.env.AUTH_DE_ADDR
    let id = process.env.AUTH_DE_CLIENT_ID
    let secret = process.env.AUTH_DE_CLIENT_SECRET
    let url = `${base}/connexion/oauth2/access_token?client_id=${id}&client_secret=${secret}&realm=individu&grant_type=client_credentials&scope=individuScanr%20nomenclature%20docScanr%20docScanrW%20sldng`
    return commons.timeout(axios.post(url, null, {
      'Content-Type': 'application/x-www-form-urlencoded'
    })).then(result => {
      return Promise.resolve({
        token: result.data.access_token,
        refreshToken: result.data.refresh_token
      })
    })
  },

  /**
   * Initiates a DE login.
   * @param {string} login
   * @param {string} birthDate
   * @param {string} postalCode
   */
  loginDe(login, birthDate, postalCode) {
    let base = process.env.EX064_ADDR
    let config = commons.getAuthHeaders()
    config.params = {
      identifiant: login.toUpperCase(),
      codePostal: postalCode,
      dateNaissance: birthDate
    }
    let url = `${base}/scanr-pe/rs/v1/identifier-individu`
    return commons.timeout(axios.get(url, config)).then(({ data }) => {
      return Promise.resolve({
        peId: login,
        isAuthenticated: true,
        rci: data
      })
    })
  },

  /**
   * Initiates a conseiller login.
   * @param {string} login
   * @param {string} password
   */
  loginConseiller(login, password) {
    let base = process.env.AUTH_AGENT_ADDR
    let id = process.env.AUTH_AGENT_CLIENT_ID
    let secret = process.env.AUTH_AGENT_CLIENT_SECRET
    let url = `${base}/connexion/oauth2/access_token?client_id=${id}&client_secret=${secret}&grant_type=password&realm=agent&scope=nomenclature%20docScanr%20docScanrW%20documentNumeriseW%20rechercheIndividu%20profile%20sldng&username=${login}&password=${encodeURIComponent(password)}`
    return commons.timeout(axios.post(url, null, {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cache-Control': 'no-cache'
    })).then(result => {
      return Promise.resolve({
        peId: login,
        isAuthenticated: true,
        token: result.data.access_token,
        refreshToken: result.data.refresh_token
      })
    })
  },

  /**
   * Returns Conseiller identity.
   * @param {string} login
   * @returns {{firstName: string, lastName: string}}
   */
  getConseillerIdentity(login) {
    let url = `${process.env.AUTH_AGENT_ADDR}/connexion/oauth2/userinfo?realm=agent`
    let conf = commons.getAuthHeaders()
    conf.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    conf.params = {
      _: new Date().getTime()
    }
    return commons.timeout(axios.get(url, conf)).then(({ data }) => {
      return Promise.resolve({
        firstName: data.given_name,
        lastName: data.family_name
      })
    }).catch(error => {
      log.info('Could not get conseiller identity', error)
      return Promise.resolve({
        firstName: login,
        lastName: ''
      })
    })
  },

  /**
   * Returns conseiller structure
   * @param {string} login
   * @returns {Promise<{code: string, region: {codeAssedic: string, libelleAssedic: string}}}>}
   */
  getConseillerStructure(login) {
    let url = process.env.BACKEND_ADDR + process.env.CONSEILLER_RESOURCE + '/' + login
    let conf = commons.getAuthHeaders()
    conf.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    conf.params = {
      _: new Date().getTime()
    }
    return commons.timeout(axios.get(url, conf)).then(({ data }) => {
      return Promise.resolve(data)
    })
  },

  /**
   * Returns DE identity.
   * @param {string} dr Regional code number
   * @param {string} de DE code
   * @returns {Promise<{firstName: string, lastName: string, rci: string}>}
   */
  getDE(dr, de) {
    let url = `${process.env.DE_ADDR}/exp-rechercheindividu/v2/individus`
    let config = commons.getAuthHeaders()
    config.params = {
      identifiantrsin: de.toUpperCase(),
      codetp: dr
    }
    return commons.timeout(axios.get(url, config)).then(({ data }) => {
      if (data.length === 0) {
        return Promise.reject(new Error('Could not find any user'))
      } else {
        let target = data[0]
        let result = {
          peId: de,
          firstName: target.prenom,
          lastName: target.nomUsage ? target.nomUsage : target.nomNaissance,
          rci: target.identifiantRCI
        }
        if (result.firstName && result.firstName.length > 0) {
          result.firstName = result.firstName.charAt(0).toUpperCase() + result.firstName.slice(1).toLowerCase()
        }
        if (result.lastName) {
          result.lastName = result.lastName.toUpperCase()
        }
        return Promise.resolve(result)
      }
    })
  }
}

import store from '../store'
import axios from 'axios'

export const LATENCY = 500

export function getDefaultHeaders() {
  const source = axios.CancelToken.source()
  let user = store.getters.isDe ? store.getters.deRci : store.getters.userId
  return {
    headers: {
      'pe-id-environnement': process.env.PE_ID_ENVIRONMENT,
      'pe-id-utilisateur': user,
      'pe-id-correlation': store.getters.sessionId,
      'pe-nom-application': 'px014-scanr'
    },
    cancelToken: source.token,
    internalSource: source
  }
}

export function getAuthHeaders() {
  let defaultHeaders = getDefaultHeaders()
  defaultHeaders.headers.Authorization = `Bearer ${store.getters.token}`
  defaultHeaders.headers.typeAuth = store.getters.isDe ? '/individu' : '/agent'
  return defaultHeaders
}

export function getAuthHeadersAgento() {
  let defaultHeaders = getDefaultHeaders()
  defaultHeaders.headers.Authorization = `Bearer agento ${store.getters.token}`
  defaultHeaders.headers.typeAuth = store.getters.isDe ? '/individu' : '/agent'
  return defaultHeaders
}

export function timeout(promise, cancelSource) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (cancelSource) {
        cancelSource.cancel('Timeout triggered')
      } else {
         // Ignored if already resolved
        reject(new Error('Timeout triggered'))
      }
    }, axios.defaults.timeout + 1000)
    promise.then(resolve, reject)
  })
}

export function registerRefreshToken(isDe) {
  axios.interceptors.response.use(response => response, error => {
    const originalRequest = error.config
    if (error && error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      const refreshToken = store.getters.refreshToken
      let base = isDe ? process.env.AUTH_DE_ADDR : process.env.AUTH_AGENT_ADDR
      let id = isDe ? process.env.AUTH_DE_CLIENT_ID : process.env.AUTH_AGENT_CLIENT_ID
      let secret = isDe ? process.env.AUTH_DE_CLIENT_SECRET : process.env.AUTH_AGENT_CLIENT_SECRET
      let realm = isDe ? 'individu' : 'agent'
      let url = isDe ? `${base}/connexion/oauth2/access_token?client_id=${id}&client_secret=${secret}&realm=individu&grant_type=client_credentials&scope=individuScanr%20nomenclature%20docScanr%20docScanrW%20sldng`
        : `${base}/connexion/oauth2/access_token?client_id=${id}&client_secret=${secret}&realm=${realm}&grant_type=refresh_token&refresh_token=${refreshToken}`
      return axios.post(url, null, {
        'Content-Type': 'application/x-www-form-urlencoded'
      }).then(({ data }) => {
        store.dispatch('updateTokens', { token: data.access_token, refreshToken: data.refreshToken })
        originalRequest.headers['Authorization'] = 'Bearer ' + data.access_token
        return axios(originalRequest)
      })
    }
    return Promise.reject(error)
  })
}

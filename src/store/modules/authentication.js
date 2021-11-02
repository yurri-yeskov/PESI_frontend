import uuid from 'uuid/v1'
import * as types from '../mutation-types'
import userApi from '../../api/user'
import { registerRefreshToken } from '../../api/api-commons'
import dr from '../../api/drList'
import log from '../../util/log'

// initial state
const state = {
  isAuthenticated: false,
  token: null,
  refreshToken: null,
  peId: null,
  firstName: null,
  lastName: null,
  userType: 'de',
  sessionId: null,
  de: {
    dr: null,
    rci: null,
    infos: null
  }
}

// getters
const getters = {
  isAuthenticated: () => state.isAuthenticated,
  isDe: () => state.userType === 'de',
  token: () => state.token,
  refreshToken: () => state.refreshToken,
  userName: () => `${state.firstName} ${state.lastName}`,
  deDr: () => state.de.dr,
  deRci: () => state.de.rci,
  deInfos: () => state.de.infos,
  userId: () => state.peId,
  sessionId: () => state.sessionId
}

// actions
const actions = {
  authScanner({ commit }) {
    return userApi.loginScanner().then(({ token, refreshToken }) => {
      commit(types.TOKENS, { token, refreshToken })
    })
  },
  login({ commit, getters, state, dispatch }, { login, password, birthDate, postalCode }) {
    if (getters.isDe) {
      return userApi.loginDe(login, birthDate, postalCode).then(payload => {
        payload.token = state.token
        payload.refreshToken = state.refreshToken
        payload.firstName = login
        payload.lastName = ''
        commit(types.LOGIN, payload)
        commit(types.DE_RCI, { rci: payload.rci })
        commit(types.SESSION_ID)
        log.info('New session started')
        return Promise.resolve()
      })
    } else {
      return userApi.loginConseiller(login, password).then(payload => {
        commit(types.LOGIN, payload)
        commit(types.SESSION_ID, payload)
        return userApi.getConseillerIdentity(login).then(identity => {
          payload.firstName = identity.firstName
          payload.lastName = identity.lastName
          commit(types.LOGIN, payload)
          log.info('New session started')
          if (!getters.drZone1 || getters.drZone1 === null) { // If zones have not been registered yet, try and set them
            return userApi.getConseillerStructure(login).then(structure => {
              return dr.getDrFromStructure(structure).then(drs => {
                if (drs.length > 0) {
                  commit(types.DE_DR, drs[0])
                  dispatch('updateDrZone1', drs[0])
                  if (drs.length > 1) {
                    dispatch('updateDrZone2', drs[1])
                  }
                } else {
                  log.info(`Could not retrieve DR list of user ${login}`)
                }
              })
            }).catch(error => { // Ignore structure errors
              log.info(`Could not retrieve DR list of user ${login} : ${error}`)
            }).finally(() => {
              return Promise.resolve()
            })
          } else {
            return Promise.resolve()
          }
        }).catch(error => {
          log.warn(`Could not retrieve identity of user ${login} : ${error}`)
          commit(types.LOGOUT)
          return Promise.reject(error)
        })
      })
    }
  },
  logout({ commit }) {
    commit(types.LOGOUT)
  },
  setUserType({ commit, getters }, userType) {
    commit(types.USER_TYPE, userType)
    registerRefreshToken(getters.isDe)
  },
  updateDR({ commit }, { codeAssedic, libelleAssedic }) {
    commit(types.DE_DR, { codeAssedic, libelleAssedic })
  },
  updateDE({ commit, state }, { de }) {
    return userApi.getDE(state.de.dr.codeAssedic, de).then(identity => {
      commit(types.DE_INFOS, identity)
      commit(types.DE_RCI, { rci: identity.rci })
      return Promise.resolve()
    })
  },
  resetDE({ commit }) {
    commit(types.DE_INFOS, { peId: null, firstName: null, lastName: null })
  },
  updateTokens({ commit }, { token, refreshToken }) {
    commit(types.TOKENS, { token, refreshToken })
  }
}

// mutations
const mutations = {
  [types.LOGIN](state, { isAuthenticated, token, refreshToken, peId, firstName, lastName }) {
    state.isAuthenticated = isAuthenticated
    state.token = token
    state.peId = peId
    state.firstName = firstName
    state.lastName = lastName
    state.refreshToken = refreshToken
  },
  [types.DE_INFOS](state, { peId, firstName, lastName }) {
    state.de.infos = peId === null ? null : {
      peId: peId,
      firstName: firstName,
      lastName: lastName
    }
  },
  [types.LOGOUT](state) {
    state.isAuthenticated = false
    state.token = null
    state.peId = null
    state.de.dr = null
    state.de.infos = null
    state.firstName = null
    state.lastName = null
    state.refreshToken = null
    state.sessionId = null
  },
  [types.DE_DR](state, { codeAssedic, libelleAssedic }) {
    state.de.dr = { codeAssedic, libelleAssedic }
  },
  [types.DE_RCI](state, { rci }) {
    state.de.rci = rci
  },
  [types.USER_TYPE](state, userType) {
    state.userType = userType
  },
  [types.TOKENS](state, { token, refreshToken }) {
    state.token = token
    state.refreshToken = refreshToken
  },
  [types.SESSION_ID](state) {
    state.sessionId = uuid().replace(/[-]/g, '')
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}

import * as types from '../mutation-types'

function parseZone(zone) {
  let localStorageZone = localStorage.getItem(zone)
  if (localStorageZone && localStorageZone.length > 0) {
    let parsed = JSON.parse(localStorageZone)
    if (parsed.codeAssedic && parsed.libelleAssedic) {
      return { codeAssedic: parsed.codeAssedic, libelleAssedic: parsed.libelleAssedic }
    }
  }
  return null
}

// initial state
const state = {
  zone1: null,
  zone2: null
}

// getters
const getters = {
  /**
   * Current DR zone 1
   * @returns {{ codeAssedic: string, libelleAssedic: string }}
   */
  drZone1() {
    return state.zone1
  },

  /**
   * Current DR zone 2
   * @returns {{ codeAssedic: string, libelleAssedic: string }}
   */
  drZone2() {
    return state.zone2
  }
}

// actions
const actions = {
  updateDrZone1({ commit }, { codeAssedic, libelleAssedic }) {
    commit(types.UPDATE_DR_ZONE_1, { codeAssedic, libelleAssedic })
  },
  updateDrZone2({ commit }, { codeAssedic, libelleAssedic }) {
    commit(types.UPDATE_DR_ZONE_2, { codeAssedic, libelleAssedic })
  },
  loadSavedDrs({ commit }) {
    commit(types.LOAD_SAVED_DRS)
  }
}

// mutations
const mutations = {
  [types.UPDATE_DR_ZONE_1](state, { codeAssedic, libelleAssedic }) {
    state.zone1 = { codeAssedic, libelleAssedic }
    localStorage.setItem('drZone1', JSON.stringify(state.zone1))
  },
  [types.UPDATE_DR_ZONE_2](state, { codeAssedic, libelleAssedic }) {
    state.zone2 = { codeAssedic, libelleAssedic }
    localStorage.setItem('drZone2', JSON.stringify(state.zone2))
  },
  [types.LOAD_SAVED_DRS](state) {
    state.zone1 = parseZone('drZone1')
    state.zone2 = parseZone('drZone2')
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}

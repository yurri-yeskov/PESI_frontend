import docApi from '../../api/document'
import * as types from '../mutation-types'

// initial state
const state = {
  all: []
}

// getters
const getters = {
  allDocumentTypes: state => state.all
}

// actions
const actions = {
  refreshDocumentTypes({ commit }) {
    docApi.getAll().then(elements => {
      commit(types.RECEIVE_ALL, { elements })
    })
  }
}

// mutations
const mutations = {
  [types.RECEIVE_ALL](state, { elements }) {
    state.all = elements
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}

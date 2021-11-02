import * as types from '../mutation-types'
import Vue from 'vue'

// initial state
const state = {
  deviceName: null,
  serial: null,
  systemSoftware: null,
  mac: null
}

// getters
const getters = {
  /**
   * Current device informations
   * @returns {{ deviceName: string, mac: string, serial: string, systemSoftware: string }}
   */
  deviceInformations() {
    return {
      deviceName: state.deviceName,
      serial: state.serial,
      systemSoftware: state.systemSoftware,
      mac: state.mac
    }
  }
}

// actions
const actions = {
  setDeviceInfos({ commit }) {
    Vue.getDeviceInformations().then((infos) => {
      commit(types.DEVICE_INFOS, infos)
    })
  }
}

// mutations
const mutations = {
  [types.DEVICE_INFOS](state, infos) {
    state.deviceName = infos.deviceName
    state.serial = infos.serial
    state.systemSoftware = infos.systemSoftware
    state.mac = infos.mac
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}

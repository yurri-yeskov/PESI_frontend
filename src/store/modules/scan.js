import scanApi from '../../api/imageScan'
import docApi from '../../api/document'
import log from '../../util/log'
import * as types from '../mutation-types'

// initial state
const state = {
  scan: {
    fileName: null,
    pageCount: 0,
    size: 0
  },
  docType: {
    code: null,
    codeContexte: null,
    libelle: null,
    profile: null,
    isCharger: false,
    isMultidoc: false,
    templateContent: null,
    template: null
  },
  groupId: null,
  folder: {
    label: null,
    archive: true,
    length: 0
  }
}

// getters
const getters = {
  currentScan: state => state.scan,
  currentDocType: state => state.docType,
  currentGroupId: state => state.groupId,
  currentFolder: state => state.folder
}

// actions
const actions = {
  updateCurrentDocType({ commit }, updatedType) {
    commit(types.UPDATE_DOC_TYPE, updatedType)
  },
  updateCurrentScan({ commit }, { fileName, pageCount, size }) {
    commit(types.UPDATE_SCAN_INFOS, { fileName, pageCount, size })
  },
  resetScanState({ commit, dispatch }) {
    commit(types.UPDATE_DOC_TYPE, { code: null, codeContexte: null, libelle: null, profile: null, isCharger: false, isMultidoc: false, templateContent: null, template: null })
    dispatch('cancelScan')
  },
  cancelScan({ commit }) {
    if (state.scan.fileName !== null && state.scan.fileName.length > 0) {
      log.debug('Cancelling scan {0}', state.scan.fileName)
      scanApi.deleteScan(state.scan.fileName).then(() => {
        commit(types.UPDATE_SCAN_INFOS, { fileName: null, pageCount: 0, size: 0 })
      }).catch((error) => {
        log.debug('Could not delete scan {0} : {1}', state.scan.fileName, error)
      })
    } else {
      commit(types.UPDATE_SCAN_INFOS, { fileName: null, pageCount: 0, size: 0 })
    }
  },

  generateGroupId({ commit }) {
    return docApi.getGroupId().then(groupId => {
      commit(types.GENERATE_GROUP_ID, { groupId })
    })
  },
  resetGroupId({ commit }) {
    commit(types.GENERATE_GROUP_ID, { groupId: null })
  },
  finishCurrentGroup({ commit, getters }) {
    if (getters.groupId != null) {
      return docApi.finishGroup(getters.groupId).then(() => {
        commit(types.GENERATE_GROUP_ID, { groupId: null })
      })
    } else {
      return Promise.resolve()
    }
  },

  setFolder({ commit }, folderName) {
    commit(types.UPDATE_FOLDER, { folderName })
  },
  setFolderAction({ commit }, action) {
    commit(types.UPDATE_FOLDER, { archive: action === 'archive' })
  },
  addDocumentToFolder({ commit, getters }) {
    commit(types.UPDATE_FOLDER, { length: getters.currentFolder.length + 1 })
  },
  resetFolder({ commit }) {
    commit(types.UPDATE_FOLDER, { folderName: null, archive: true, length: 0 })
  }
}

// mutations
const mutations = {
  [types.UPDATE_DOC_TYPE](state, { code, codeContexte, libelle, profile, isCharger, isMultidoc, templateContent, template }) {
    state.docType.code = code
    state.docType.codeContexte = codeContexte
    state.docType.libelle = libelle
    state.docType.profile = profile
    state.docType.isCharger = isCharger
    state.docType.isMultidoc = isMultidoc
    state.docType.templateContent = templateContent
    state.docType.template = template
  },

  [types.UPDATE_SCAN_INFOS](state, { fileName, pageCount, size }) {
    state.scan.fileName = fileName
    state.scan.pageCount = pageCount
    state.scan.size = size
  },

  [types.GENERATE_GROUP_ID](state, { groupId }) {
    let cleanedValue = groupId
    if (cleanedValue === null || cleanedValue.length === 0) {
      cleanedValue = null
    }
    state.groupId = cleanedValue
  },

  [types.UPDATE_FOLDER](state, { folderName, archive, length }) {
    if (folderName !== undefined) {
      state.folder.label = folderName
    }
    if (archive !== undefined) {
      state.folder.archive = archive
    }
    if (length !== undefined) {
      state.folder.length = length
    }
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}

import * as commons from './api-commons'
import log from '../util/log'
import axios from 'axios'
import profiles from '../scanTemplates'
import uuid from 'uuid/v1'
import stringUtils from '../util/stringUtils'

function mergeDocs(documents, folder) {
  let translatedDocuments = []
  let matchingFolderDocuments = folder && folder.length > 0 ? folderDocuments[folder] : []
  if (matchingFolderDocuments === null) {
    matchingFolderDocuments = []
  }
  for (let i = 0; i < documents.length; ++i) {
    let tmp = documents[i]
    let isFiltered = matchingFolderDocuments.length === 0 || matchingFolderDocuments.indexOf(tmp.code) >= 0
    if (tmp.modeCapture && profiles[tmp.modeCapture.code] && isFiltered) {
      tmp.profile = tmp.modeCapture.code
      let profile = profiles[tmp.profile]
      tmp.isCharger = profile.isCharger
      tmp.isMultidoc = profile.isMultidoc
      tmp.templateContent = profile.templateContent
      tmp.template = profile.template
      tmp.codeContexte = parseInt(tmp.codeContexte)
      if (isNaN(tmp.codeContexte)) {
        log.error('Could not read codeContexte : ' + tmp.codeContexte)
        alert(tmp.codeContexte)
      }
      translatedDocuments.push(tmp)
    } else if (isFiltered) {
      log.warn('Unknown profile {0}', tmp.modeCapture)
    }
  }

  if (matchingFolderDocuments.length > 0) {
    translatedDocuments.sort((doc1, doc2) => {
      let libelle1 = stringUtils.normalizeUpper(doc1.libelle)
      let libelle2 = stringUtils.normalizeUpper(doc2.libelle)
      return libelle1 < libelle2 ? -1 : (libelle1 > libelle2 ? 1 : 0)
    })
  }
  return translatedDocuments
}

const folderDocuments = {
  'DAL ASS': [
    'JRM',
    'ACP',
    'PINV',
    'PMI',
    'APSS',
    'ASF',
    'AEMP',
    'PRAV',
    'AI',
    'BDS',
    'CEDT',
    'CDT',
    'DALASS'
  ],
  'Renouvellement ASS': [
    'JRM',
    'AEMP',
    'AI',
    'BDS',
    'CDT',
    'QASS'
  ],
  'Saisine IPR': [
    'AGASS',
    'ASF',
    'AEMP',
    'AP',
    'AAT',
    'BDF',
    'BDS',
    'CEDT',
    'CDT',
    'CONV',
    'CUVI',
    'JIE',
    'LDAE',
    'RIPR',
    'REPOFFE'
  ],
  'Trop-perçu': [
    'AEMP',
    'ASA',
    'BDS',
    'COTA',
    'CRTP',
    'DEDR',
    'DED',
    'ECC',
    'FACHH',
    'FACH',
    'JRE',
    'QRCF',
    'IMMO',
    'RCS',
    'RGTP'
  ]
}

export default {
  getDEList() {
    log.debug(`Calling server for DE document retrieval`)
    let targetUrl = `${process.env.LIST_DOC_ADDR}/candidat/nomenclature/document/v1/documents-numerisables?codeOrigineAcquisition=DE&codeCanalReception=scan`
    return commons.timeout(axios.get(targetUrl, commons.getAuthHeaders()))
      .then(({ data }) => Promise.resolve(mergeDocs(data[0].documents)))
  },

  getConseillerList(dossier) {
    log.debug(`Calling server for conseiller document retrieval`)
    let targetUrl = `${process.env.LIST_DOC_ADDR}/conseiller/nomenclature/document/v1/documents-numerisables?codeOrigineAcquisition=C&codeCanalReception=scan`
    return commons.timeout(axios.get(targetUrl, commons.getAuthHeaders())).then(({ data }) => Promise.resolve(mergeDocs(data[0].documents, dossier)))
  },

  getFolders() {
    let folders = []
    for (let f in folderDocuments) {
      folders.push(f)
    }
    return folders
  },

  sendDocument(docType, scan, groupId, rci, idConseiller, archive) {
    log.info(`Calling server for document sending : ${scan.fileName} / ${docType.code} / ${groupId} / ${rci} / archive=${archive} / ${scan.pageCount} / ${scan.size}`)
    let headers = commons.getAuthHeaders()
    return commons.timeout(axios.post(process.env.EX064_ADDR + '/scanr-pe/rs/v1/document-scanne', {
      codeContexte: docType.codeContexte,
      codeDoc: docType.code,
      idFichier: scan.fileName,
      idPli: groupId,
      idRCI: rci,
      nbPage: scan.pageCount,
      taille: Math.round(scan.size / 1024),
      origineAcquisition: idConseiller === undefined || idConseiller === null ? 'DE' : 'C',
      idConseiller: idConseiller,
      archive: archive
    }, headers), headers.internalSource)
  },

  /**
   * Returns a server generated groupId.
   * @returns {Promise<string>}
   */
  getGroupId() {
    return Promise.resolve(uuid().replace(/[-]/g, ''))
  },

  /**
   * Finishes given group.
   * @param {string} groupId
   * @returns {Promise<void>}
   */
  finishGroup(groupId) {
    return Promise.resolve()
  }
}

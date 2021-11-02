import axios from 'axios'
import log from '../util/log'
import * as commons from './api-commons'

const DR_LIST = [
  {
    'codeAssedic': '001',
    'libelleAssedic': 'AQUITAINE TEST'
  },
  {
    'codeAssedic': '012',
    'libelleAssedic': 'LIMOUSIN'
  },
  {
    'codeAssedic': '013',
    'libelleAssedic': 'PAYS DE LOIRE'
  },
  {
    'codeAssedic': '016',
    'libelleAssedic': 'SUD EST FRANCILIEN'
  },
  {
    'codeAssedic': '017',
    'libelleAssedic': 'ALSACE'
  },
  {
    'codeAssedic': '020',
    'libelleAssedic': 'FRANCHE COMTE'
  },
  {
    'codeAssedic': '024',
    'libelleAssedic': 'ALPES'
  },
  {
    'codeAssedic': '025',
    'libelleAssedic': 'PICARDIE'
  },
  {
    'codeAssedic': '026',
    'libelleAssedic': 'PAS DE CALAIS'
  },
  {
    'codeAssedic': '027',
    'libelleAssedic': 'BRETAGNE'
  },
  {
    'codeAssedic': '031',
    'libelleAssedic': 'VALLEES RHONE LOIRE'
  },
  {
    'codeAssedic': '032',
    'libelleAssedic': 'COTE D\'AZUR'
  },
  {
    'codeAssedic': '034',
    'libelleAssedic': 'ALPES PROVENCE'
  },
  {
    'codeAssedic': '035',
    'libelleAssedic': 'REGION CENTRE'
  },
  {
    'codeAssedic': '039',
    'libelleAssedic': 'POITOU CHARENTES'
  },
  {
    'codeAssedic': '040',
    'libelleAssedic': 'BASSE NORMANDIE'
  },
  {
    'codeAssedic': '041',
    'libelleAssedic': 'REGION HAUTE NORMANDIE'
  },
  {
    'codeAssedic': '044',
    'libelleAssedic': 'AUVERGNE'
  },
  {
    'codeAssedic': '046',
    'libelleAssedic': 'LANGUEDOC ROUSSILLON'
  },
  {
    'codeAssedic': '048',
    'libelleAssedic': 'MIDI PYRENEES'
  },
  {
    'codeAssedic': '049',
    'libelleAssedic': 'PAYS DU NORD'
  },
  {
    'codeAssedic': '050',
    'libelleAssedic': 'BOURGOGNE'
  },
  {
    'codeAssedic': '051',
    'libelleAssedic': 'CHAMPAGNE ARDENNE'
  },
  {
    'codeAssedic': '055',
    'libelleAssedic': 'POLE EMPLOI SERVICES (RG)'
  },
  {
    'codeAssedic': '056',
    'libelleAssedic': 'PARIS'
  },
  {
    'codeAssedic': '057',
    'libelleAssedic': 'OUEST FRANCILIEN'
  },
  {
    'codeAssedic': '061',
    'libelleAssedic': 'EST FRANCILIEN'
  },
  {
    'codeAssedic': '063',
    'libelleAssedic': 'LORRAINE'
  },
  {
    'codeAssedic': '065',
    'libelleAssedic': 'CORSE'
  },
  {
    'codeAssedic': '066',
    'libelleAssedic': 'GUADELOUPE'
  },
  {
    'codeAssedic': '067',
    'libelleAssedic': 'MARTINIQUE'
  },
  {
    'codeAssedic': '068',
    'libelleAssedic': 'LA REUNION'
  },
  {
    'codeAssedic': '069',
    'libelleAssedic': 'GUYANE'
  },
  {
    'codeAssedic': '070',
    'libelleAssedic': 'SAINT-PIERRE ET MIQUELON'
  },
  {
    'codeAssedic': '071',
    'libelleAssedic': 'MAYOTTE'
  },
  {
    'codeAssedic': '080',
    'libelleAssedic': 'POLE EMPLOI SERVICES (SPECTACLE)'
  }
]

const ADDITIONAL_STRUCTURES = [
  {
    code: '35030',
    regions: [
      {
        codeAssedic: '013',
        libelleAssedic: 'PAYS DE LOIRE'
      }
    ]
  }
]

export default {
  /**
   * Returns all DR embedded in application.
   * @returns {array<{codeAssedic: string, libelleAssedic: string}>}
   */
  getStaticDrList() {
    return DR_LIST
  },

  /**
   * Returns all DR from server.
   * @returns {Promise<{codeAssedic: string, libelleAssedic: string}[]>}
   */
  getDrList() {
    log.debug(`Calling server for DR list retrieval`)
    let headers = commons.getAuthHeaders()
    return commons.timeout(axios.get(process.env.BACKEND_ADDR + process.env.REGION_RESOURCE, headers), headers.internalSource).then(drList => Promise.resolve(drList.data))
  },

  /**
   * Returns matching DR
   * @param {string} id
   * @returns {{id: string, label: string}}
   */
  getDr(id) {
    let found = null
    for (var i = 0; i < DR_LIST.length; ++i) {
      let tmp = DR_LIST[i]
      if (tmp.id === id) {
        found = tmp
        break
      }
    }
    return found
  },

  async getDrFromStructure(structure) {
    let foundDrs = []
    foundDrs.push(structure.region)

    // Check special agencies
    for (let additional of ADDITIONAL_STRUCTURES) {
      if (additional.code === structure.code) {
        foundDrs.push(...additional.regions)
        break
      }
    }
    return Promise.resolve(foundDrs)
  }
}

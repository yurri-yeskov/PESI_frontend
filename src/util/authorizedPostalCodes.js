const POSTAL_CODES = [
  '91780',
  '91580',
  '91740',
  '91720',
  '91820',
  '91890',
  '91840',
  '91590',
  '91490',
  '91410',
  '91780',
  '91150',
  '91690',
  '91870',
  '91850',
  '91880',
  '91730',
  '91670',
  '91660',
  '91510',
  '91930',
  '91160',
  '91320',
  '91380',
  '91420',
  '92000',
  '93100',
  '93170',
  '77820',
  '77390',
  '77190',
  '77370',
  '77550',
  '77000',
  '77115',
  '77350',
  '77310',
  '77720',
  '77590',
  '77950',
  '77240',
  '77760',
  '77123',
  '77890',
  '77570',
  '77167',
  '77780',
  '77620',
  '77460',
  '77140',
  '77690',
  '77880',
  '77710',
  '64220',
  '64120',
  '64780',
  '64430',
  '64480',
  '64200',
  '64640',
  '64210',
  '64250',
  '64190',
  '64390',
  '64450',
  '64160',
  '64230',
  '64330',
  '64420',
  '64350',
  '64530',
  '64800',
  '64320',
  '64460',
  '64510',
  '64121',
  '64000',
  '64410',
  '40360',
  '40250',
  '40180',
  '40380',
  '40330',
  '40700',
  '40400',
  '40370',
  '40465',
  '40990',
  '40110',
  '40350',
  '40290',
  '40140',
  '40230',
  '40510',
  '40550',
  '40390',
  '40560',
  '40530',
  '40480',
  '40260',
  '40150',
  '40660',
  '40130',
  '93300',
  '93600',
  '93000',
  '93140',
  '93390',
  '93470',
  '93700',
  '93440',
  '93800',
  '93220',
  '93460',
  '93450',
  '93120',
  '93210',
  '93150',
  '93350',
  '93310',
  '93340',
  '93260',
  '93320',
  '93190',
  '93370',
  '93360',
  '93330',
  '93160',
  '93130',
  '93500',
  '93380',
  '93230',
  '93110',
  '93200',
  '93400',
  '93270',
  '93240',
  '93290',
  '93410',
  '93250',
  '93420',
  '93430',
  '92600',
  '92270',
  '92110',
  '92700',
  '92400',
  '92380',
  '92230',
  '92250',
  '92300',
  '92200',
  '92800',
  '92500',
  '92210',
  '92150',
  '92420',
  '92390'
]

export default {
  /**
   * Tells if this postal code is allowed.
   * @param {string} cp
   */
  isPostalCodeAllowed(cp) {
    let found = false
    for (let tmp of POSTAL_CODES) {
      if (cp === tmp) {
        found = true
        break
      }
    }
    return found
  }
}
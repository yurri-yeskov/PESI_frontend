module.exports = {

  'normal': {
    _meta: {
      'tab': { key: '\t', text: 'Tab', width: 60, classes: 'control' },
      'shiftl': { keySet: 'shifted', text: 'Shift', width: 100, classes: 'control' },
      'shiftr': { keySet: 'shifted', text: 'Shift', width: 100, classes: 'control' },
      'caps': { keySet: 'capsed', text: 'Caps lock', width: 80, classes: 'control' },
      'space': { key: ' ', text: 'Space', width: 180 },
      'enter': { key: '\r\n', text: 'Enter', width: 80, classes: 'control' },
      'backspace': { func: 'backspace', classes: 'control backspace', width: 65 },
      'accept': { func: 'accept', text: 'Close', classes: 'control featured' },
      'next': { func: 'next', text: 'Next', classes: 'control featured' }
    },
    default: [
      '` 1 2 3 4 5 6 7 8 9 0 - = {backspace}',
      '{tab} q w e r t y u i o p [ ] \\',
      '{caps} a s d f g h j k l ; \' {enter}',
      '{shiftl} z x c v b n m , . / {shiftr}',
      '{next} {space} {accept}'
    ],
    shifted: [
      '~ ! @ # $ % ^ & * ( ) _ + {backspace}',
      '{tab} Q W E R T Y U I O P { } |',
      '{caps} A S D F G H J K L : \' {enter}',
      '{shiftl} Z X C V B N M < > ? {shiftr}',
      '{next} {space} {accept}'
    ],
    capsed: [
      '` 1 2 3 4 5 6 7 8 9 0 - = {backspace}',
      '{tab} Q W E R T Y U I O P [ ] \\',
      '{caps} A S D F G H J K L ; \' {enter}',
      '{shiftl} Z X C V B N M , . / {shiftr}',
      '{next} {space} {accept}'
    ]
  },

  'compact': {
    _meta: {
      'default': { keySet: 'default', text: 'abc', classes: 'control' },
      'alpha': { keySet: 'default', text: 'Abc', classes: 'control' },
      'shift': { keySet: 'shifted', text: 'ABC', classes: 'control' },
      'numbers': { keySet: 'numbers', text: '123', classes: 'control' },
      'space': { key: ' ', text: 'Space', width: 200 },
      'backspace': { func: 'backspace', classes: 'control' },
      'accept': { func: 'accept', text: 'Close', classes: 'control featured' },
      'next': { func: 'next', text: 'Next', classes: 'featured' },
      'zero': { key: '0', width: 130 }
    },
    default: [
      'q w e r t y u i o p',
      ' a s d f g h j k l ',
      '{shift} z x c v b n m {backspace}',
      '{numbers} , {space} . {next} {accept}'
    ],
    shifted: [
      'Q W E R T Y U I O P',
      ' A S D F G H J K L ',
      '{default} Z X C V B N M ',
      '{numbers} _ {space} {backspace} {next} {accept}'
    ],
    numbers: [
      '1 2 3',
      '4 5 6',
      '7 8 9',
      '  {alpha} . {zero} {backspace} {next} {accept}'
    ]
  },

  'numeric': {
    _meta: {
      'backspace': { func: 'backspace', classes: 'control' },
      'accept': { func: 'accept', text: 'Close', classes: 'control featured' },
      'next': { func: 'next', text: 'Next', classes: 'control featured' },
      'zero': { key: '0', width: 130 }
    },
    default: [
      '1 2 3',
      '4 5 6',
      '7 8 9',
      '_ - . {zero} {backspace} {next} {accept}'
    ]
  },

  'PE-DE': {
    _meta: {
      'default': { keySet: 'default', text: 'abc', classes: 'control' },
      'alpha': { keySet: 'default', text: 'Abc', classes: 'control' },
      'shift': { keySet: 'shifted', text: 'ABC', classes: 'control' },
      'numbers': { keySet: 'numbers', text: '123', classes: 'control' },
      'space': { key: ' ', text: 'Espace', width: 200 },
      'backspace': { func: 'backspace', classes: 'control backspace' },
      'accept': { func: 'accept', text: 'Fermer', classes: 'control featured' },
      'next': { func: 'next', text: 'Suiv.', classes: 'featured' },
      'zero': { key: '0', width: 130 }
    },

    default: [
      '1 2 3 4 5 6 7 8 9 0',
      'A Z E R T Y U I O P',
      'Q S D F G H J K L M',
      'W X C V B N {backspace}'
    ]
  },

  'PE-CONSEILLER': {
    _meta: {
      'default': { keySet: 'default', text: 'abc', classes: 'control' },
      'alpha': { keySet: 'default', text: '123 \r\n abc', classes: 'control multiline width-small' },
      'shift': { keySet: 'shifted', text: 'ABC', classes: 'control' },
      'numbers': { keySet: 'numbers', text: '123', classes: 'control' },
      'space': { key: ' ', text: 'Espace', width: 200 },
      'backspace': { func: 'backspace', classes: 'control backspace' },
      'accept': { func: 'accept', text: '', classes: 'control featured fa fa-lg fa-keyboard-o' },
      'next': { func: 'next', text: 'Suiv.', classes: 'featured' },
      'specials1': { keySet: 'specials1', text: '? é', classes: 'control' },
      'specials1Back': { keySet: 'specials1', text: '', classes: 'btn-warning fa fa-chevron-left fa-lg' },
      'specials2': { keySet: 'specials2', text: '', classes: 'btn-warning fa fa-chevron-right fa-lg' },
      'specials2Back': { keySet: 'specials2', text: '', classes: 'btn-warning fa fa-chevron-left fa-lg' },
      'specials3': { keySet: 'specials3', text: '', classes: 'btn-warning fa fa-chevron-right fa-lg' },
      'specials3Back': { keySet: 'specials3', text: '', classes: 'btn-warning fa fa-chevron-left fa-lg' },
      'specials4': { keySet: 'specials4', text: '', classes: 'btn-warning fa fa-chevron-right fa-lg' },

      'search': { keySet: 'search', text: 'abc', classes: 'control' },
      'searchShift': { keySet: 'searchShift', text: 'ABC', classes: 'control' },
      'searchSpecial': { keySet: 'searchSpecial', text: '123', classes: 'control' },
      'hide': { func: 'cancel', text: '', classes: 'btn-warning hideKeyboard' },
      'doSearch': { func: 'accept', text: ' Rechercher', classes: 'btn-warning fa fa-lg fa-search' },

      '0': { key: '0', classes: 'numeric' },
      '1': { key: '1', classes: 'numeric' },
      '2': { key: '2', classes: 'numeric' },
      '3': { key: '3', classes: 'numeric' },
      '4': { key: '4', classes: 'numeric' },
      '5': { key: '5', classes: 'numeric' },
      '6': { key: '6', classes: 'numeric' },
      '7': { key: '7', classes: 'numeric' },
      '8': { key: '8', classes: 'numeric' },
      '9': { key: '9', classes: 'numeric' }
    },

    default: [
      '{1} {2} {3} {4} {5} {6} {7} {8} {9} {0}',
      'a z e r t y u i o p',
      'q s d f g h j k l m',
      '{shift} {specials1} w x c v b n {backspace}'
    ],

    specials1: [
      '& @ é è ê à â ù û ç',
      '+ - / * , ; : ! ? .',
      '( ) " _ % € $ = \\ \'',
      '{alpha} [ ] {space} < > {backspace} {specials2}'
    ],

    specials2: [
      'É È Ê Ë À Â Á Ù Û Ç',
      'ì í î ï ã ä á å æ ë',
      'Ì Í Î Ï Ã Ä Å Æ | ~',
      '{specials1Back} {alpha} { } {space} # {backspace} {specials3}'
    ],

    specials3: [
      'ñ ò ó ô õ ö ú ü ý ÿ',
      'Ñ Ò Ó Ô Õ Ö Ú Ü Ý §',
      'ª ° ² ³ ¹ º ¼ ½ ¾ ´',
      '{specials2Back} {alpha} « » {space} ^ {backspace} {specials4}'
    ],

    specials4: [
      'ø þ ð µ ¢ £ ¥ ÷ × ±',
      'Ø Þ Ð ß ¶ ¤ © ® ¬ ¦',
      '¯ ` ¨ · ¸ ¡ ¿',
      '{specials3Back} {alpha} {space} {backspace}'
    ],

    shifted: [
      '{1} {2} {3} {4} {5} {6} {7} {8} {9} {0}',
      'A Z E R T Y U I O P',
      'Q S D F G H J K L M',
      '{default} {specials1} W X C V B N {backspace}'
    ],

    search: [
      'a z e r t y u i o p',
      'q s d f g h j k l m',
      'w x c v b n {doSearch}',
      '{searchShift} {searchSpecial} {space} {backspace} {hide}'
    ],

    searchShift: [
      'A Z E R T Y U I O P',
      'Q S D F G H J K L M',
      'W X C V B N {doSearch}',
      '{search} {searchSpecial} {space} {backspace} {hide}'
    ],

    searchSpecial: [
      '{1} {2} {3} {4} {5} {6} {7} {8} {9} {0}',
      'é è ê à â ç',
      '- / {doSearch}',
      '{search} {space} {backspace} {hide}'
    ]
  }
};

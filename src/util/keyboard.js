const KEYCODES_NUM = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57]
const KEYCODE_BACKSPACE = 8
const KEYCODE_TAB = 9
const KEYCODE_ENTER = 13
const KEYCODE_DEL = 46
const KEYCODE_LEFT = 37
const KEYCODE_RIGHT = 39

export default {
  hide() {
    if (document.activeElement && document.activeElement.blur && typeof document.activeElement.blur === 'function') {
      document.activeElement.blur()
      let keyboardElt = document.getElementById('xrxKeyboard')
      if (keyboardElt) {
        keyboardElt.style.display = 'none'
      }
    }
  },
  numericKeyChecker({ key, keyCode }) {
    let isValid = false
    switch (key) {
      case '0':
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
        isValid = true
        break
      default:
        isValid = KEYCODES_NUM.indexOf(keyCode) >= 0
        break
    }
    return isValid
  },
  alphaKeyChecker({ keyCode }) {
    return (keyCode >= 65 && keyCode <= 90) || (keyCode >= 97 && keyCode <= 122) // a-z and A-Z
    // return keyCode >= 65 && keyCode <= 90 // a-z
  },
  getKeyFromKeycode({ keyCode, doNotShift = false }) {
    let shift = 0
    if (!doNotShift && keyCode >= 96) {
      shift = 48
    }
    return String.fromCharCode(keyCode - shift)
  },
  KEYCODES_NUM,
  KEYCODE_BACKSPACE,
  KEYCODE_TAB,
  KEYCODE_ENTER,
  KEYCODE_DEL,
  KEYCODE_LEFT,
  KEYCODE_RIGHT
}

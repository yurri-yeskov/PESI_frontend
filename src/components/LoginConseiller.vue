<template>
  <div>
    <form method="post" action="#" v-on:submit.prevent="formInterceptor">
      <input type="hidden" ref="hiddenInput" @keydown="virtualKeydown($event)" />
      <div class="form-group" v-bind:class="{ 'has-error': errors.has('formPeId_EIP_DoNotShowEmbeddedKeyboard') }">
        <label for="IdPoleEmploi">Code utilisateur</label>
        <input type="text" name="formPeId_EIP_DoNotShowEmbeddedKeyboard" v-model="formPeId" ref="formPeId" id="IdPoleEmploi" class="form-control" placeholder="4 lettres / 4 chiffres"
               autocomplete="off" v-validate.disable="{ required: true, regex: /[A-Za-z]{4}(\d){4}/ }" autofocus
               title="L'identifiant Pôle Emploi doit être composé de 4 lettres suivies de 4 chiffres." @focus="onShow($refs.formPeId, $refs.hiddenInput, true)" v-on:blur="restoreFocus($refs.formPeId)" @keydown.prevent="inputReplacer('formPeId', false, 8, $refs.formPassword, $event)" @input.prevent="inputReplacer('formPeId', false, 8, $refs.formPassword, $event)" />
        <span class="help-block">Ex. ABCD1234</span>
      </div>

      <div class="form-group" v-bind:class="{ 'has-error': errors.has('formPassword_EIP_DoNotShowEmbeddedKeyboard') }">
        <label for="password">Mot de passe</label>
        <input type="password" name="formPassword_EIP_DoNotShowEmbeddedKeyboard" v-model="formPassword" ref="formPassword" id="password" class="form-control" placeholder="Mot de passe"
               autocomplete="off" v-validate="{ required: true }"
               title="Veuillez rentrer un mot de passe" @focus="onShow($refs.formPassword, $refs.formPassword)" v-on:blur="restoreFocus($refs.formPassword)" />
        <span v-show="errors.has('formPassword')" class="help-block">Champ obligatoire</span>
      </div>

      <xerox-button class="btn-nav btn-success" type="submit">OK</xerox-button>
      <xerox-button class="btn-nav btn-warning" v-on:pushed="selfExit"><i class="fa fa-home fa-lg"></i></xerox-button>
    </form>

    <wait-modal v-on:waitNegative="modalConnect.show = false" v-on:waitPositive="modalConnect.show = false" v-bind="modalConnect" v-if="modalConnect.show"></wait-modal>
    <vue-touch-keyboard layout="PE-CONSEILLER" :input="keyboardInput" :options="options" />
  </div>
</template>

<script>
import keyboard from '../util/keyboard'
export default {
  name: 'Login',
  data() {
    return {
      input: null,
      keyboardInput: null,
      formPeId: '________',
      formPassword: '',
      oldId: '________',
      modalConnect: {
        show: false,
        showWarning: false,
        showProgress: false,
        showNegativeButton: false,
        showPositiveButton: false,
        bodyLabel: '',
        bodyLabelDefault: 'Identification en cours...',
        errorLabelDefault: 'Nous ne parvenons pas à vous identifier. Merci de vérifier les données que vous avez saisies.'
      },
      initialData: {
        formPeId: '________'
      },
      options: {
        useKbEvents: true,
        preventClickEvent: true
      }
    }
  },
  methods: {
    formInterceptor() {
      this.$validator.validateAll().then((result) => {
        if (result) {
          this.proceedLogin()
        }
      })
    },
    proceedLogin() {
      this.modalConnect.showWarning = false
      this.modalConnect.show = true
      this.modalConnect.showPositiveButton = false
      this.modalConnect.showProgress = true
      this.modalConnect.bodyLabel = this.modalConnect.bodyLabelDefault

      var login = this.formPeId
      var password = this.formPassword
      this.$store.dispatch('login', { login, password }).then(() => {
        this.$router.push('/LoginNext')
      }).catch(() => {
        this.modalConnect.showProgress = false
        this.modalConnect.showWarning = false
        this.modalConnect.showPositiveButton = true
        this.modalConnect.bodyLabel = this.modalConnect.errorLabelDefault
      })
    },
    selfExit() {
      this.$scanner.exitApplication()
    },
    handleSuspend() {
      this.formPeId = this.initialData.formPeId
      this.oldId = this.formPeId
      this.formPassword = ''
    },

    onShow(newTarget, keyboardTarget, underlineMode) {
      this.input = newTarget
      this.keyboardInput = keyboardTarget
      if (this.input && underlineMode) {
        let carretPos = 0
        for (let c of this.input.value) {
          if (c === '_') {
            break
          }
          ++carretPos
        }
        this.$nextTick(() => {
          this.input.selectionStart = carretPos
          this.input.selectionEnd = carretPos
        })
      }
    },
    restoreFocus(element) {
      setTimeout(() => {
        if (this.input === element) {
          element.focus()
        }
      }, 100)
    },
    virtualKeydown(event) {
      let e = document.createEvent('Event')
      e.initEvent('keydown', true, true)
      e.which = e.keyCode = event.keyCode
      this.input.dispatchEvent(e)
      event.preventDefault()
      return false
    },
    inputReplacer(model, onlyDigits, maxCharCount, next, event) {
      let pos = event.target.selectionStart
      let matchingModel = this[model]

      if (event.keyCode === keyboard.KEYCODE_LEFT) {
        --pos
        if (matchingModel[pos] === '/') {
          --pos
        }
      } else if (event.keyCode === keyboard.KEYCODE_RIGHT) {
        ++pos
        if (matchingModel[pos] === '/') {
          ++pos
        }
      } else if (event.keyCode === keyboard.KEYCODE_BACKSPACE) {
        if (pos > 0) {
          if (matchingModel[pos - 1] === '/') {
            --pos
          }
          this[model] = matchingModel.slice(0, pos - 1) + '_' + matchingModel.slice(pos, matchingModel.length)
          --pos
        }
      } else if (event.keyCode === keyboard.KEYCODE_DEL) {
        if (matchingModel[pos] !== '/') {
          this[model] = matchingModel.slice(0, pos) + '_' + matchingModel.slice(pos + 1, matchingModel.length)
        }
      } else if (keyboard.numericKeyChecker(event) || (!onlyDigits && keyboard.alphaKeyChecker(event))) {
        if (pos >= maxCharCount) {
          this.oldId = this[model]
          return false
        }

        event.doNotShift = true
        this[model] = matchingModel.slice(0, pos) + keyboard.getKeyFromKeycode(event) + matchingModel.slice(pos + 1, matchingModel.length)
        ++pos

        if (matchingModel[pos] === '/') {
          ++pos
        }
      } else {
        this.oldId = this[model]
        return false
      }

      this.oldId = this[model]
      if (pos === maxCharCount && next) {
        next.focus()
      } else {
        pos = Math.max(0, pos)
        this.$nextTick(() => {
          event.target.selectionStart = pos
          event.target.selectionEnd = pos
        })
      }
      return false
    }
  },
  mounted() {
    document.addEventListener('suspend', this.handleSuspend, false)
  },
  beforeDestroy() {
    document.removeEventListener('suspend', this.handleSuspend, false)
  }
}
</script>

<style scoped lang="scss">
  form {
    text-align: center;
    div, button {
      display: inline-block;
      vertical-align: top;
      margin-right: 20px;
    }
    button {
      margin-top: 20px;
    }
    .form-group {
      text-align: left;
    }
    .has-error {
      font-weight: bold;
    }
  }

  .no-padding {
    padding: 0;
  }

  .help-message {
    position: absolute;
    left: 0;
    top: 180px;
    text-align: left;
    width: 100%;
  }

    .help-message span {
      font-weight: bold;
    }

  .has-error {
    font-weight: bold;
  }

  $char-w: 14px;
  $gap: .5*$char-w;
  $padding: 7px;

  @mixin def-input($n-char) {
    $in-w: $n-char*($char-w + $gap);
    width: $in-w + 2*$padding + $gap;
    /*background: repeating-linear-gradient(90deg, dimgrey 0, dimgrey $char-w, transparent 0, transparent $char-w + $gap) $padding 100%/100% 2px no-repeat;*/
    background-color: white;
  }

  #IdPoleEmploi {
    letter-spacing: $gap;
    padding-left: $padding;
    padding-right: $padding;
    font: 24px 'Avenir', Helvetica, Arial, sans-serif;
    font-family: monospace;
    text-align: center;
    &:focus {
      outline: none;
      font-weight: bold;
    }
    @include def-input(8);
  }
  
  .vue-touch-keyboard {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
    width: 100%;
    max-width: 1000px;
    margin: 0 auto;
    padding: 1em;
    background-color: #EEE;
    box-shadow: 0px -3px 10px rgba(black, 0.3);
    border-radius: 10px;
    padding: 3px 20px 15px 20px;
  }
</style>

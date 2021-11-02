<template>
  <div v-on:keyup="cheat" style="position: relative;">
    <form method="post" action="#" v-on:submit.prevent="formInterceptor">
      <input type="hidden" ref="hiddenInput" @keydown="virtualKeydown($event)"/>
      <div class="form-group" v-bind:class="{ 'has-error': errors.has('formPeId_EIP_DoNotShowEmbeddedKeyboard') }">
        <label for="IdPoleEmploi">Identifiant</label>
        <input type="text" name="formPeId_EIP_DoNotShowEmbeddedKeyboard" v-model="formPeId" ref="formPeId" id="IdPoleEmploi" class="form-control" placeholder="7 chiffres/1 lettre" autocomplete="off"
               maxlength="8" v-validate.disable="{ required: true, regex: /(\d){7}[a-zA-Z0-9]/ }"
               title="L'identifiant Pôle Emploi doit être composé de 8 lettres ou chiffres." @focus="onShow($refs.formPeId)" v-on:blur="restoreFocus($refs.formPeId)" autofocus @keydown.prevent="inputReplacer('formPeId', false, 8, $refs.formDateNaissance, $event)" />
        <span class="help-block">Ex. 1234567A</span>
      </div>

      <div class="form-group" v-bind:class="{ 'has-error': errors.has('formDateNaissance_EIP_DoNotShowEmbeddedKeyboard') }">
        <label for="dateNaissance">Date naissance</label>
        <input type="text" name="formDateNaissance_EIP_DoNotShowEmbeddedKeyboard" v-model="formDateNaissance" ref="formDateNaissance" id="dateNaissance" class="form-control" placeholder="JJ/MM/AAAA" autocomplete="off"
               v-validate.disable="{ required: true, date_format: 'DD/MM/YYYY' }"
               title="Veuillez rentrer votre date de naissance" maxlength="10" @focus="onShow($refs.formDateNaissance)" v-on:blur="restoreFocus($refs.formDateNaissance)" @keydown.prevent="inputReplacer('formDateNaissance', true, 10, $refs.formCodePostal, $event)" />
        <span class="help-block">Ex. 31/12/1918</span>
      </div>

      <div class="form-group" v-bind:class="{ 'has-error': errors.has('formCodePostal_EIP_DoNotShowEmbeddedKeyboard') }">
        <label for="codePostal">Code postal</label>
        <input type="text" name="formCodePostal_EIP_DoNotShowEmbeddedKeyboard" v-model="formCodePostal" ref="formCodePostal" id="codePostal" class="form-control" placeholder="5 chiffres" autocomplete="off"
               v-validate.disable="{ required: true, regex: /\d{5}/ }"
               title="Veuillez rentrer votre code postal" maxlength="5" @focus="onShow($refs.formCodePostal)" v-on:blur="restoreFocus($refs.formCodePostal)" @keydown.prevent="inputReplacer('formCodePostal', true, 5, null, $event)" />
        <span class="help-block">Ex. 07450</span>
      </div>

      <xerox-button id="connect-btn" class="btn-nav btn-success" type="submit">OK</xerox-button>
    </form>

    <wait-modal v-on:waitNegative="modalConnect.show = false" v-on:waitPositive="modalConnect.show = false" v-bind="modalConnect" v-if="modalConnect.show"></wait-modal>
    <wait-modal v-on:waitNegative="modalCheat.show = false" v-on:waitPositive="selfExit" v-bind="modalCheat" v-if="modalCheat.show"></wait-modal>
    <vue-touch-keyboard layout="PE-DE" :input="$refs.hiddenInput" :options="options" />
  </div>
</template>

<script>
import keyboard from '../util/keyboard'
import { Validator } from 'vee-validate'

Validator.extend('cpChecker', value => value.length === 5 && /(\d){5}/.test(value))

export default {
  name: 'Login',
  data() {
    return {
      input: null,
      formPeId: '________',
      formDateNaissance: '__/__/____',
      formCodePostal: '_____',
      cheatPushed: 0,
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
      modalCheat: {
        show: false,
        showProgress: false,
        showNegativeButton: true,
        showPositiveButton: true,
        bodyLabel: 'Attention, vous allez sortir de l\'application'
      },
      initialData: {
        formPeId: '________',
        formDateNaissance: '__/__/____',
        formCodePostal: '_____'
      },
      options: {
        useKbEvents: true,
        preventClickEvent: true
      }
    }
  },
  methods: {
    onShow(newTarget) {
      this.input = newTarget
      if (this.input) {
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
    formInterceptor() {
      this.$validator.validateAll().then((result) => {
        if (result) {
          this.proceedLogin()
        }
      });
    },
    proceedLogin() {
      this.modalConnect.showWarning = false
      this.modalConnect.show = true
      this.modalConnect.showPositiveButton = false
      this.modalConnect.showProgress = true
      this.modalConnect.bodyLabel = this.modalConnect.bodyLabelDefault

      let login = this.formPeId
      let birthDate = this.formDateNaissance
      let postalCode = this.formCodePostal

      this.$store.dispatch('login', { login, birthDate, postalCode }).then(() => {
        this.$router.push('/LoginNext')
      }).catch(() => {
        this.modalConnect.showProgress = false
        this.modalConnect.showWarning = true
        this.modalConnect.showPositiveButton = true
        this.modalConnect.bodyLabel = this.modalConnect.errorLabelDefault
      })
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
          return false
        }

        this[model] = matchingModel.slice(0, pos) + keyboard.getKeyFromKeycode(event) + matchingModel.slice(pos + 1, matchingModel.length)
        ++pos

        if (matchingModel[pos] === '/') {
          ++pos
        }
      } else {
        return false
      }

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
    },
    cheat(event) {
      if (event.key === '*' || event.keyIdentifier === 'U+002A' || event.keyIdentifier === 'Multiply') {
        ++this.cheatPushed
        if (this.cheatPushed >= 10) {
          this.cheatPushed = 0
          this.modalCheat.show = true
        }
      } else if (event.keyIdentifier !== 'U+1000020' && event.keyIdentifier !== 'Shift' && event.keyIdentifier !== 'U+0038') {
        this.cheatPushed = 0
      }
    },
    selfExit() {
      this.$scanner.exitApplication()
    },
    handleSuspend() {
      this.formPeId = this.initialData.formPeId
      this.formDateNaissance = this.initialData.formDateNaissance
      this.formCodePostal = this.initialData.formCodePostal
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
    }
    div {
      margin-right: 20px;
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
  #connect-btn {
    vertical-align: top;
    margin-top: 20px;
  }  

  $char-w: 14px;
  $gap: .5*$char-w;
  $padding: 7px;

  input {
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
  }

  @mixin def-input($n-char) {
    $in-w: $n-char*($char-w + $gap);
    width: $in-w + 2*$padding + $gap;
    /*background: repeating-linear-gradient(90deg, dimgrey 0, dimgrey $char-w, transparent 0, transparent $char-w + $gap) $padding 100%/100% 2px no-repeat;*/
    background-color: white;
  }

  #IdPoleEmploi {
    @include def-input(8);
  }

  #dateNaissance {
    @include def-input(10);
  }

  #codePostal {
    @include def-input(5);
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

    /deep/ .line:first-child button {
      background: #E7E7E7;
    }
  }
</style>

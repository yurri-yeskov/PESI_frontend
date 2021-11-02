<template>
  <div>
    <form id="loginForm" method="post" action="#" v-on:submit.prevent="formInterceptor">
      <input type="hidden" ref="hiddenInput" @keydown="virtualKeydown($event)" />

      <div class="form-group" role="group" aria-label="DR">
        <xerox-button class="btn btn-primary btn-dr" v-bind:class="{active: currentDr.codeAssedic === drZone1.codeAssedic}" v-bind:disabled="drZone1.codeAssedic === null" v-on:pushed="currentDr.codeAssedic = drZone1.codeAssedic"><span v-html="libelleZone1"></span></xerox-button>
        <xerox-button class="btn btn-primary btn-dr" v-bind:class="{active: currentDr.codeAssedic === drZone2.codeAssedic}" v-bind:disabled="drZone2.codeAssedic === null" v-on:pushed="currentDr.codeAssedic = drZone2.codeAssedic"><span v-html="libelleZone2"></span></xerox-button>
      </div>

      <div class="form-group" v-bind:class="{ 'has-error': errors.has('formPeId_EIP_DoNotShowEmbeddedKeyboard') }" style="margin-left: 30px;">
        <label for="IdPoleEmploi">Identifiant DE</label>
        <input type="text" name="formPeId_EIP_DoNotShowEmbeddedKeyboard" v-model="formPeId" id="IdPoleEmploi" ref="formPeId" class="form-control" placeholder="7 chiffres / 1 lettre " autocomplete="off"
               maxlength="8" v-validate.disable="{ required: true, regex: /(\d){7}[a-zA-Z0-9]/ }"
               title="L'identifiant Pôle Emploi doit être composé de 7 chiffres puis une lettre." autofocus
               @focus="onShow($refs.formPeId)" v-on:blur="restoreFocus($refs.formPeId)" @keydown.prevent="inputReplacer('formPeId', false, 8, $refs.formPassword, $event)" @input.prevent="inputReplacer('formPeId', false, 8, $refs.formPassword, $event)" />
        <span class="help-block">Ex. 1234567A</span>
      </div>

      <xerox-button id="connect-btn" class="btn-large btn-success" type="submit" v-bind:disabled="currentDr.codeAssedic === null">Valider</xerox-button>
      <xerox-button id="update-regions-btn" class="btn-large btn-danger" type="button" v-on:pushed="updateRegions">Modifier les régions</xerox-button>
      <vue-touch-keyboard layout="PE-DE" :input="$refs.hiddenInput" :options="options" />
    </form>
    <wait-modal v-on:waitNegative="modal.show = false" v-on:waitPositive="modal.show = false" v-bind="modal" v-if="modal.show"></wait-modal>
  </div>
</template>

<script>
  import keyboard from '../util/keyboard'
  export default {
    name: 'DESelection',
    props: {
      prefilledDE: {
        type: String,
        default: null
      }
    },
    data() {
      return {
        formPeId: '________',
        currentDr: { codeAssedic: null },
        oldId: '________',
        modal: {
          show: false,
          showWarning: false,
          showProgress: false,
          showNegativeButton: false,
          showPositiveButton: false,
          bodyLabel: '',
          bodyLabelDefault: 'Recherche en cours...',
          errorLabelDefault: 'Nous ne parvenons pas à identifier le DE. Merci de vérifier les données que vous avez saisies'
        },
        options: {
          useKbEvents: true,
          preventClickEvent: true
        }
      }
    },
    computed: {
      drZone1() {
        let z = this.$store.getters.drZone1;
        if (!z || !z.codeAssedic || z.codeAssedic.length === 0) {
          z = { codeAssedic: null, libelleAssedic: 'Région à modifier' }
        }
        return z
      },
      drZone2() {
        let z = this.$store.getters.drZone2;
        if (!z || !z.codeAssedic || z.codeAssedic.length === 0) {
          z = { codeAssedic: null, libelleAssedic: 'Région à modifier' }
        }
        return z
      },
      libelleZone1() {
        let z = this.drZone1
        return this.splitLine(z.libelleAssedic + (z.codeAssedic ? ' - ' + z.codeAssedic : ' #1'))
      },
      libelleZone2() {
        let z = this.drZone2
        return this.splitLine(z.libelleAssedic + (z.codeAssedic ? ' - ' + z.codeAssedic : ' #2'))
      }
    },
    methods: {
      formInterceptor() {
        this.$validator.validateAll().then((result) => {
          if (result) {
            this.proceedSearch()
          }
        });
      },
      proceedSearch() {
        this.modal.showWarning = false
        this.modal.show = true
        this.modal.showPositiveButton = false
        this.modal.showProgress = true
        this.modal.bodyLabel = this.modal.bodyLabelDefault

        var de = this.formPeId
        this.$store.dispatch('updateDR', this.currentDr)
        this.$store.dispatch('updateDE', { de }).then(() => {
          this.$router.push('/DocumentTypeList')
        }).catch(() => {
          this.modal.showProgress = false
          this.modal.showWarning = false
          this.modal.showPositiveButton = true
          this.modal.bodyLabel = this.modal.errorLabelDefault
        })
      },

      onShow(newTarget) {
        if (newTarget) {
          let carretPos = 0
          for (let c of newTarget.value) {
            if (c === '_') {
              break
            }
            ++carretPos
          }
          this.$nextTick(() => {
            newTarget.selectionStart = carretPos
            newTarget.selectionEnd = carretPos
          })
        }
      },
      restoreFocus(element) {
        setTimeout(() => {
          element.focus()
        }, 100)
      },
      virtualKeydown(event) {
        let e = document.createEvent('Event')
        e.initEvent('keydown', true, true)
        e.which = e.keyCode = event.keyCode
        this.$refs.formPeId.dispatchEvent(e)
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
      },
      updateRegions() {
        this.$router.push({ name: 'DRList', params: { prefilledDE: this.formPeId } })
      },
      splitLine(line) {
        let rebuiltLine = ''
        let word = ''
        let advance = 0
        for (let i = 0; i < line.length; ++i) {
          switch (line[i]) {
            case ' ':
            case '-':
            case ',':
              if (word.length > 0) {
                if (advance > 16) {
                  rebuiltLine += '<br/>'
                  advance = 0
                }
                rebuiltLine += word
              }
              rebuiltLine += line[i]
              ++advance
              word = ''
              break
            default:
              word += line[i]
              ++advance
              break
          }
        }
        if (advance + word.length + 1 > 18) {
          rebuiltLine += '<br/>'
        }
        rebuiltLine += word
        return rebuiltLine
      }
    },
    beforeMount() {
      this.currentDr.codeAssedic = this.$store.getters.drZone1 ? this.$store.getters.drZone1.codeAssedic : null
      if (this.prefilledDE && this.prefilledDE.length > 0) {
        let cleanedDe = this.prefilledDE
        while (cleanedDe.length < 8) {
          cleanedDe += '_'
        }
        this.formPeId = cleanedDe
      }
    },
    mounted() {
      this.$refs.formPeId.focus()
    }
  }
</script>

<style scoped lang="scss">
  @import "../assets/sass/definitions.scss";

  .no-dr {
    width: 100%;
    font-size: $font-size-base * 2.2;
    text-align: center;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    margin-top: 0;
  }

  .no-padding {
    padding: 0;
  }

  #connect-btn {
    position: absolute;
    top: 0;
    right: 10px;
  }

  #update-regions-btn {
    position: absolute;
    top: 90px;
    right: 10px;
  }

  #loginForm div {
    display: inline-block;
    vertical-align: top;
  }

  .btn-dr {
    width: 250px;
    margin-bottom: 10px;
    display: block;
    height: $btn-list-height;
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
    width: 200px;
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

    $key-height: 1.7em;
    /deep/ .line:first-child button {
      background: #E7E7E7;
    }
    /deep/ .key, .placeholder {
      height: $key-height;
      line-height: $key-height;
    }
  }
</style>

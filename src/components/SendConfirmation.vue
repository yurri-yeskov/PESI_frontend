<template>
  <div style="padding-top: 5px;">
    <div>
      <i class="fa fa-check fa-4x" style="display: inline-block; vertical-align: middle; color: green;"></i>
      <span class="info-text" style="display: inline-block; max-width: 650px; vertical-align: middle;" v-html="confirmationMessage"></span>
    </div>

    <div class="info-text" style="margin-top: 30px; margin-left: 25px;">
      <span class="counter">Attention</span>, sans aucune action de votre part, vous allez être déconnecté automatiquement dans
      <span class="counter">
        {{timeDisplay}}
      </span>
    </div>

    <div>
      <template v-if="isDe">
        <xerox-button to="/Logout" class="btn-large btn-de btn-danger btn-text-icon" style="left: 60px;"><i class="fa fa-power-off fa-lg"></i> Se déconnecter</xerox-button>
        <xerox-button to="/DocumentTypeList" class="btn-large btn-de btn-success btn-text-icon" style="right: 60px;"><img src="../assets/plus-icon-white.png" style="vertical-align: middle; margin-top: -6px;" /> &nbsp;&nbsp;&nbsp;Numériser un &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;autre document</xerox-button>
      </template>

      <template v-else>
        <xerox-button to="/DESelection" class="btn-large btn-conseiller btn-danger btn-text-icon" style="left: 60px; bottom: 100px;"><img src="../assets/user-icon-white.png" style="vertical-align: middle; margin-top: -6px;" /> Changer le DE</xerox-button>
        <div v-if="folder && folder.length > 0">
          <xerox-button v-on:pushed="newScan(true)" class="btn-large btn-conseiller btn-success btn-text-icon" style="right: 60px; bottom: 100px;"><img src="../assets/plus-icon-white.png" style="vertical-align: middle; margin-top: -6px;" /> &nbsp;Continuer avec &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ce DE</xerox-button>
        </div>
        <div v-else>
          <xerox-button v-on:pushed="newScan(true)" class="btn-large btn-conseiller btn-success btn-text-icon" style="right: 60px; bottom: 100px;"><img src="../assets/plus-icon-white.png" style="vertical-align: middle; margin-top: -6px;" /> &nbsp;Numériser un &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;document non lié</xerox-button>
          <xerox-button v-on:pushed="newScan(false)" class="btn-large btn-conseiller btn-success btn-text-icon" style="right: 60px;"><i class="fa fa-paperclip fa-lg"></i> &nbsp;&nbsp;Numériser un &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;document lié</xerox-button>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'SendConfirmation',
    props: {
      type: {
        type: String,
        default: null
      },
      label: {
        type: String,
        default: null
      },
      folder: {
        type: String,
        default: null
      },
      folderDocumentCount: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        intervalId: null,
        timeRemaining: 15,
        defaultTimeRemaining: 15
      }
    },
    computed: {
      isDe() {
        return this.$store.getters.isDe
      },
      timeDisplay() {
        let display = ''
        let minutes = Math.floor(this.timeRemaining / 60)
        let seconds = this.timeRemaining % 60
        if (minutes > 0) {
          display = `${minutes} minute `
        }
        display += `${seconds}s`
        return display
      },
      confirmationMessage() {
        let message = null
        if (this.folder && this.folder.length > 0) {
          message = `Votre dossier <b>${this.folder}</b> comportant ${this.folderDocumentCount} document${this.folderDocumentCount > 1 ? 's' : ''}${this.type} a bien été envoyé.
            <br />
            N'oubliez pas de ${this.folderDocumentCount > 1 ? 'les' : 'le'} récupérer.`
        } else {
          message = `Votre document <b>${this.label}</b> a bien été envoyé${this.isDe ? ' et est disponible dans votre espace personnel' : this.type}.
            <br />
            N'oubliez pas de récupérer votre original papier.`
        }
        return message
      }
    },
    methods: {
      newScan(createGroup) {
        if (createGroup) {
          this.$store.dispatch('finishCurrentGroup').finally(() => {
            this.$store.dispatch('resetGroupId')
          })
        }
        this.$router.push('/DocumentTypeList')
      },
      resetCounter() {
        this.timeRemaining = this.defaultTimeRemaining
      }
    },
    watch: {
      timeRemaining(val) {
        if (val < 0) {
          this.$log.debug('SendConfirmation - Automatic logout')
          this.$router.push('/Logout')
        }
      }
    },
    beforeMount() {
      this.defaultTimeRemaining = this.isDe ? 15 : 150
      this.timeRemaining = this.defaultTimeRemaining
      this.intervalId = setInterval(() => {
        --this.timeRemaining
      }, 1000)
    },
    beforeDestroy() {
      if (this.intervalId) {
        clearInterval(this.intervalId)
        this.intervalId = null
      }
    }
  }
</script>

<style scoped lang="scss">
@import "../assets/sass/definitions.scss";

.info-text {
  font-size: $font-size-base * 1.2;
}

.btn-large {
  width: 320px;
}

.btn-de {
  position: absolute;
  bottom: 30px;
}

.btn-conseiller {
  position: absolute;
  bottom: 5px;
}

.counter {
  color: #ff4c42;
  font-weight: bold;
  font-size: $font-size-base * 1.5;
}
</style>

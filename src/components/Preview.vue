<template>
  <div style="position: relative; height: 100%;">
    <p style="font-weight: bold; max-width: 500px;">{{currentType.libelle}}</p>
    <div style="display: inline-block; vertical-align: top; width: 285px;">
      <xerox-button class="btn-large btn-danger" v-on:pushed="changeDocumentType">Modifier le type de document</xerox-button>
      <xerox-button id="retry-btn" class="btn-large btn-primary" v-on:pushed="rescan">Recommencer la numérisation</xerox-button>
    </div>

    <div style="display: inline-block; height: 340px;">
      <img id="pdfDisplay" :src="imageContent" style="border:1px solid black;" />
    </div>

    <div id="document-pager">
      <div v-if="isFolderMode" style="margin-bottom: 10px; font-weight: bold;"><i class="fa fa-lg fa-folder-open"></i> {{folderName}}</div>
      <xerox-button class="btn-nav" style="float: left" aria-label="Précédent" v-on:pushed="showPrevious" v-bind:disabled="!canPrevious" v-bind:class="{ 'btn-warning': canPrevious}">
        <i class="fa fa-chevron-left fa-2x" aria-hidden="true"></i>
      </xerox-button>
      <span>Page <br />{{currentPage}} / {{scan.pageCount}}</span>
      <xerox-button class="btn-nav" style="float: right" aria-label="Suivant" v-on:pushed="showNext" v-bind:disabled="!canNext" v-bind:class="{ 'btn-warning': canNext}">
        <i class="fa fa-chevron-right fa-2x" aria-hidden="true"></i>
      </xerox-button>
    </div>
    <div id="send-zone">
      <xerox-button v-if="isDe" class="btn-large btn-success" v-on:pushed="sendDocument(true)"><i class="fa fa-upload fa-lg"></i> Transmettre</xerox-button>
      <template v-else>
        <template v-if="isFolderMode">
          <xerox-button class="btn-large btn-success btn-submit-top" v-on:pushed="sendFolder(false)"><img src="../assets/folderWithPage.png"> Ajouter au dossier courant</xerox-button>
          <p></p>
          <xerox-button class="btn-large btn-success" v-on:pushed="sendFolder(true)"><i class="fa fa-lg fa-upload" style="padding-top: 12px;"></i> Envoyer le dossier</xerox-button>
        </template>
        <template v-else>
          <xerox-button class="btn-large btn-success btn-submit-top" v-on:pushed="sendDocument(true)">Archiver</xerox-button>
          <p></p>
          <xerox-button class="btn-large btn-success" v-on:pushed="sendDocument(false)" v-bind:disabled="!canSendForProcessing">Envoyer pour traitement</xerox-button>
        </template>
      </template>
    </div>
    <wait-modal v-on:waitNegative="modal.show = false" v-on:waitPositive="modal.show = false" v-bind="modal" v-if="modal.show"></wait-modal>
  </div>
</template>

<script>
  import imageScan from '../api/imageScan'
  import docApi from '../api/document'

  export default {
    name: 'Preview',
    data() {
      return {
        currentPage: 0,
        imageContent: '',
        modal: {
          show: false,
          showWarning: false,
          showProgress: true,
          showAlternateBody: false,
          showNegativeButton: false,
          showPositiveButton: false,
          bodyLabel: 'Envoi en cours...',
          alternateBodyLabel: 'Une erreur est survenue au cours de l\'envoi'
        }
      }
    },
    computed: {
      currentType() {
        return this.$store.getters.currentDocType
      },
      scan() {
        return this.$store.getters.currentScan
      },
      imageUrl() {
        return imageScan.getPageUrl(this.scan.fileName, this.currentPage)
      },
      canPrevious() {
        return this.currentPage > 1
      },
      canNext() {
        return this.currentPage < this.scan.pageCount
      },
      isDe() {
        return this.$store.getters.isDe
      },
      isFolderMode() {
        let folder = this.$store.getters.currentFolder.label
        return folder && !this.isDe && folder.length > 0
      },
      folderName() {
        return this.$store.getters.currentFolder.label
      },
      canSendForProcessing() {
        return ['ARL', 'CHQ', 'PPAE'].indexOf(this.currentType.code) < 0
      }
    },
    methods: {
      showPrevious() {
        if (this.canPrevious) {
          --this.currentPage
        }
      },
      showNext() {
        if (this.canNext) {
          ++this.currentPage
        }
      },
      sendFolder(finish) {
        this.modal.show = true
        this.modal.showWarning = false
        this.modal.showProgress = true
        this.modal.showPositiveButton = false
        this.modal.showAlternateBody = false
        this.$store.dispatch('addDocumentToFolder')
        let groupPromise = Promise.resolve()
        if (this.$store.getters.currentGroupId === null) {
          groupPromise = this.$store.dispatch('generateGroupId')
        }
        let archive = this.$store.getters.currentFolder.archive
        groupPromise.then(() => {
          docApi.sendDocument(this.currentType, this.scan, this.$store.getters.currentGroupId, this.$store.getters.deRci, this.isDe ? null : this.$store.getters.userId, this.isDe ? null : archive).then(() => {
            this.$log.info(`Document has been sent to GED : ${this.scan.fileName} / ${this.currentType.code} / ${this.$store.getters.currentGroupId} / ${this.$store.getters.deRci} / archive=${archive} / ${this.scan.pageCount} / ${this.scan.size}`)
            this.$store.dispatch('resetScanState')
            if (finish) {
              let label = this.currentType.libelle
              let type = archive ? ' pour archivage' : ' pour traitement'
              let folder = this.folderName
              let folderDocumentCount = this.$store.getters.currentFolder.length
              this.$store.dispatch('finishCurrentGroup')
              this.$store.dispatch('resetFolder')
              this.$router.push({ name: 'SendConfirmation', params: { label, type, folder, folderDocumentCount } })
            } else {
              this.$router.push('/DocumentTypeList')
            }
            this.modal.showProgress = false
          }).catch(error => {
            this.$log.warn('Could not send document : ' + error)
            this.modal.showProgress = false
            this.modal.showWarning = true
            this.modal.showPositiveButton = true
            this.modal.showAlternateBody = true
          })
        })
      },
      sendDocument(archive) {
        this.modal.show = true
        this.modal.showWarning = false
        this.modal.showProgress = true
        this.modal.showPositiveButton = false
        this.modal.showAlternateBody = false
        let groupPromise = Promise.resolve()
        if (this.isDe || this.$store.getters.currentGroupId === null) {
          groupPromise = this.$store.dispatch('generateGroupId')
        }
        groupPromise.then(() => {
          docApi.sendDocument(this.currentType, this.scan, this.$store.getters.currentGroupId, this.$store.getters.deRci, this.isDe ? null : this.$store.getters.userId, this.isDe ? null : archive).then(() => {
            this.$log.info(`Document has been sent to GED : ${this.scan.fileName} / ${this.currentType.code} / ${this.$store.getters.currentGroupId} / ${this.$store.getters.deRci} / archive=${archive} / ${this.scan.pageCount} / ${this.scan.size}`)
            let type = archive ? ' pour archivage' : ' pour traitement'
            let label = this.currentType.libelle
            this.$store.dispatch('resetScanState')
            this.$router.push({ name: 'SendConfirmation', params: { label, type } })
            this.modal.showProgress = false
          }).catch(error => {
            this.$log.warn('Could not send document : ' + error)
            this.modal.showProgress = false
            this.modal.showWarning = true
            this.modal.showPositiveButton = true
            this.modal.showAlternateBody = true
          }).finally(() => {
            if (this.isDe) {
              this.$store.dispatch('finishCurrentGroup')
            }
          })
        })
      },
      rescan() {
        this.$store.dispatch('cancelScan')
        this.$router.push('/ScanLauncher')
      },
      changeDocumentType() {
        this.$router.push({ name: 'DocumentTypeList', params: { nextScreen: 'Preview' } });
      }
    },
    watch: {
      currentPage() {
        imageScan.getPage(this.scan.fileName, this.currentPage).then(data => {
          this.imageContent = `data:image/jpeg;base64,${data}`
        })
      }
    },
    beforeMount() {
      this.currentPage = 1
    }
  }
</script>

<style scoped lang="scss">
  @import "../assets/sass/definitions.scss";
  #pdfDisplay {
    max-height: 300px;
  }
  #document-pager {
    position: absolute;
    top: 0;
    right: 0;
    text-align: center;
    width: $btn-width-large;
  }
    #document-pager span {
      width: 90px;
      float: left;
      text-align: center;
    }

  #send-zone {
    position: absolute;
    bottom: 0;
    right: 0;
    margin-bottom: $padding-outer + $margin-outer;
  }
  #retry-btn {
    position: absolute;
    bottom: 0;
    left: 0;
    margin-bottom: $padding-outer + $margin-outer;
  }
  .btn-submit-top {
    bottom: 90px;
  }
</style>

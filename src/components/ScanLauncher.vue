<template>
  <div style="height: 100%;">
    <div v-if="scans.length === 0">
      <img class="instructions" v-bind:src="helpIconPath" style="min-width: 250px;" />
      <ol>
        <li>Déposez votre <b>{{currentType.libelle}}</b> {{currentType.isCharger ? 'dans le bac de chargement, face vers le haut' : 'sur la glace, face vers le bas'}}</li>
        <li>Appuyez sur le bouton "Numériser"</li>
      </ol>

      <xerox-button v-on:pushed="changeDocType" class="btn-large btn-danger back-button"><img src="../assets/back-arrow-white.png" /> Retour</xerox-button>
      <xerox-button v-on:pushed="startScan" class="btn-large btn-success start-button">Numériser</xerox-button>
    </div>


    <div v-if="scans.length > 0 && !showNextPage" style="text-align: center;">
      <p class="instructions">Avez-vous numérisé toutes les pages pour votre <br /> <b>{{currentType.libelle}}</b> ?</p>

      <xerox-button v-on:pushed="showNextPage = true" class="btn-large btn-primary back-button" style="text-align: center;">Non</xerox-button>
      <xerox-button v-on:pushed="mergeScans" class="btn-large btn-success start-button">Oui</xerox-button>
    </div>

    <div v-if="scans.length > 0 && showNextPage">
      <img class="instructions" v-bind:src="helpIconPath" />
      <ol>
        <li>Récupérez la page de votre <b>{{currentType.libelle}}</b></li>
        <li>Remplacez-la par la page suivante</li>
      </ol>

      <xerox-button v-on:pushed="showNextPage = false" class="btn-large btn-danger back-button"><img src="../assets/back-arrow-white.png" /> Retour</xerox-button>
      <xerox-button v-on:pushed="startScan" class="btn-large btn-success start-button">Numériser</xerox-button>
    </div>

    <div id="folder-info" v-if="isFolderMode"><i class="fa fa-lg fa-folder-open"></i> {{folderName}}</div>

    <wait-modal v-on:waitNegative="modal.show = false" v-on:waitPositive="modal.show = false" v-bind="modal" v-if="modal.show"></wait-modal>
  </div>
</template>

<script>
  import imageScan from '../api/imageScan'
  import imgCharger from '../assets/chargeur_1.gif'
  import imgGlass from '../assets/glace_1.gif'

  export default {
    name: 'ScanLauncher',
    data() {
      return {
        scanStartDate: null,
        scans: [],
        isForeground: true,
        jobId: null,
        isError: false,
        showNextPage: false,
        modal: {
          show: false,
          showProgress: true,
          showAlternateBody: false,
          showNegativeButton: false,
          showPositiveButton: false,
          showWarning: false,
          bodyLabel: 'Numérisation en cours, veuillez patienter.\nVous pourrez vérifier votre document avant transmission à l\'étape suivante...',
          alternateBodyLabel: 'Une erreur est survenue au cours de la numérisation',
          defaultAlternateBodyLabel: 'Une erreur est survenue au cours de la numérisation',
          error05_501_00: 'Le capot du bac de chargement est ouvert. Merci de bien vouloir le refermer',
          error05_502_00: 'Le capot du bac de chargement est ouvert. Merci de bien vouloir le refermer',
          error05_506_00: 'Un bourrage papier a été détecté. Merci de bien vouloir ouvrir le capot du bac de chargement puis de suivre les instructions à l\'écran',
          error05_510_00: 'Un bourrage papier a été détecté. Merci de bien vouloir ouvrir le capot du bac de chargement puis de suivre les instructions à l\'écran',
          error16_544_00: 'Le câble réseau semble déconnecté. Merci de bien vouloir vérifier les branchements'
        }
      }
    },
    computed: {
      currentType() {
        return this.$store.getters.currentDocType
      },
      helpIconPath() {
        return this.$store.getters.currentDocType.isCharger ? imgCharger : imgGlass
      },
      isFolderMode() {
        let folder = this.$store.getters.currentFolder.label
        return folder && !this.isDe && folder.length > 0
      },
      folderName() {
        return this.$store.getters.currentFolder.label
      }
    },
    methods: {
      onScanUploaded(infos) {
        if (infos.pageCount <= 0) { // Empty document
          this.$log.info('Received 0 page for document {0}', infos.fileName)
          this.modal.alternateBodyLabel = 'Le document ne contient aucune page. Merci de relancer la numérisation'
          this.modal.showProgress = false
          this.modal.showPositiveButton = true
          this.modal.showAlternateBody = true
          this.modal.showWarning = true
        } else if ((infos.pageCount === 1 && this.currentType.code !== 'BDS' && this.currentType.isMultidoc) || this.scans.length > 0) { // One page read : probably a glass scan. If we are in multidoc mode, we stay in in this mode
          this.scans.push(infos)
          this.modal.show = false
          this.showNextPage = false
        } else { // Several page read : probably charger
          this.$store.dispatch('updateCurrentScan', infos)
          this.$router.push('/Preview')
        }
      },
      check(checkCount) {
        let statusPromise = this.$scanner.checkStatus(this.jobId)
        let errorPromise = this.$scanner.checkErrors()
        Promise.all([statusPromise, errorPromise]).then(values => {
          if (values[0]) {
            this.$log.trace(`Job ${this.jobId} is running, check count = ${checkCount}`)
            setTimeout(() => this.check(checkCount + 1), 2000)
          } else {
            // Get scan informations. We first retrieve it based on current date (more reliable : less than 5 seconds between upload and this call)
            let splitJob = this.jobId.split(':')
            imageScan.searchScan(splitJob[splitJob.length - 1], this.$store.getters.deviceInformations.serial, new Date())
              .then(this.onScanUploaded)
              .catch(() => {
                this.$log.debug(`Retrying scan retrieval at scan start date for ${this.jobId} / ${this.currentType.libelle}`)
                imageScan.searchScan(splitJob[splitJob.length - 1], this.$store.getters.deviceInformations.serial, this.scanStartDate)
                  .then(this.onScanUploaded)
                  .catch(error => {
                    this.$log.warn(`Could not retrieve scan for ${this.jobId} : ${error} / ${this.currentType.libelle}`)
                    this.modal.showProgress = false
                    this.modal.showPositiveButton = true
                    this.modal.showAlternateBody = true
                    this.modal.showWarning = true
                    this.isError = false
                  })
              })
          }
        }).catch(error => {
          this.$log.info(`Job ${this.jobId} has failed : ${error} / ${this.currentType.libelle}`)
          this.modal.showProgress = false
          this.modal.showPositiveButton = true
          this.modal.showAlternateBody = true
          this.modal.showWarning = true
          this.isError = true
          // Network error : cancel job
          if (error.message === '16-544-00') {
            this.$scanner.cancelJob(this.jobId).catch(error => {
              this.$log.debug(`Could not cancel job ${this.jobId} : ${error}`)
            })
          }
        })
      },
      startScan() {
        this.modal.alternateBodyLabel = this.modal.defaultAlternateBodyLabel
        this.modal.show = true
        this.modal.showProgress = true
        this.modal.showAlternateBody = false
        this.modal.showPositiveButton = false
        this.modal.showWarning = false
        this.isError = false
        // Check printer errors, load template and start scan
        this.$scanner.checkErrors().then(() => {
          this.$scanner.createOrReplaceTemplate(this.currentType.template, this.currentType.templateContent).then(() => {
            this.scanStartDate = new Date()
            return this.$scanner.launchScan(this.currentType.template)
              .then(receivedJobId => {
                this.jobId = receivedJobId
                this.$log.info(`Job id received : ${receivedJobId} / ${this.currentType.libelle}`)
                this.check(0)
              }).catch(error => {
                this.$log.warn(`Job launch error : ${error} / ${this.currentType.libelle}`)
                this.modal.showProgress = false
                this.modal.showWarning = true
                this.modal.showPositiveButton = true
                this.modal.showAlternateBody = true
              })
          }).catch(error => {
            this.$log.info(`Scan error : ${error} / ${this.currentType.libelle}`)
            this.modal.showProgress = false
            this.modal.showWarning = true
            this.modal.showPositiveButton = true
            this.modal.showAlternateBody = true
          })
        }).catch(error => {
          this.$log.debug(`Pre-check printer internal error : code ${error.message} / ${this.currentType.libelle}`)
          switch (error.message) {
            case '05-501-00':
              this.modal.alternateBodyLabel = this.modal.error05_501_00
              break
            case '05-502-00':
              this.modal.alternateBodyLabel = this.modal.error05_502_00
              break
            case '05-506-00':
              this.modal.alternateBodyLabel = this.modal.error05_506_00
              break
            case '05-510-00':
              this.modal.alternateBodyLabel = this.modal.error05_510_00
              break
            case '16-544-00':
              this.modal.alternateBodyLabel = this.modal.error16_544_00
              break
          }
          this.modal.showProgress = false
          this.modal.showWarning = true
          this.modal.showPositiveButton = true
          this.modal.showAlternateBody = true
        })
      },
      changeDocType() {
        this.$router.push('/DocumentTypeList')
        this.$store.dispatch('resetScanState')
      },
      mergeScans() {
        this.modal.alternateBodyLabel = 'Assemblage en cours'
        this.modal.show = true
        this.modal.showProgress = true
        this.modal.showAlternateBody = true
        this.modal.showPositiveButton = false
        this.modal.showWarning = false
        // Do not merge if only one element
        if (this.scans.length === 1) {
          this.$store.dispatch('updateCurrentScan', this.scans[0])
          this.$router.push('/Preview')
        } else {
          let scanFiles = []
          for (let i = 0; i < this.scans.length; ++i) {
            scanFiles.push(this.scans[i].fileName)
          }
          imageScan.mergeScans(scanFiles).then(infos => {
            this.$store.dispatch('updateCurrentScan', infos)
            this.$router.push('/Preview')
          }).catch(error => {
            this.$log.info(`Merge error : ${error} / ${this.currentType.libelle}`)
            this.modal.showProgress = false
            this.modal.alternateBodyLabel = 'Une erreur est survenue au cours de l\'assemblage'
            this.modal.showPositiveButton = true
            this.modal.showAlternateBody = true
            this.modal.showWarning = true
          })
        }
      },
      handleSuspend() {
        this.isForeground = false
      },
      handleResume() {
        this.isForeground = true
        // Cancel job if it has been suspended and is in error
        if (this.jobId !== null && this.isError) {
          setTimeout(() => {
            // TODO Check if printer is in error state
            if (this.isForeground) {
              this.$scanner.cancelJob(this.jobId).catch(error => {
                this.$log.debug(`Could not cancel job ${this.jobId} : ${error}`)
              })
            }
          }, 2000)
        }
      }
    },
    mounted() {
      document.addEventListener('suspend', this.handleSuspend, false);
      document.addEventListener('resume', this.handleResume, false);
    },
    beforeDestroy() {
      document.removeEventListener('suspend', this.handleSuspend, false);
      document.removeEventListener('resume', this.handleResume, false);
    }
  }
</script>

<style scoped lang="scss">
  @import '../assets/sass/definitions.scss';

  .back-button {
    position: absolute;
    bottom: 30px;
    left: 60px;
    text-align: left;
  }
    .back-button img {
      vertical-align: middle;
      padding-left: 10px;
      padding-right: 30px;
      margin-top: -10px;
    }
  .start-button {
    position: absolute;
    bottom: 30px;
    right: 60px;
  }

  img.instructions {
    display: inline-block;
    vertical-align: top;
  }
  p.instructions {
    margin-top: 75px;
    font-size: $font-size-base*1.2;
  }

  ol {
    display: inline-block;
    max-width: 450px;
    li {
      margin-top: 42px;
      font-size: $font-size-base*1.2;
    }
  }

  #folder-info {
    width: 250px;
    text-align: center;
    font-weight: bold;
    position: absolute;
    top: 0;
    right: 0;
  }
</style>

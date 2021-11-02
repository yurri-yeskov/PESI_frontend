<template>
  <div>
    <div>
      <table style="width: 100%" v-if="types.length > 0">
        <tbody>
          <tr v-for="item in displayTypes" v-bind:key="item.code">
            <td style="text-align: left">
              <xerox-button class="btn-list-element" v-on:pushed="changeCurrentType(item)" v-bind:class="{'btn-list-element-selected': item === currentType}">{{item.libelle}} <i class="fa fa-lg fa-star doc-maitre" v-if="item.maitre && isFolderMode"></i></xerox-button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="types.length === 0" style="text-align: center;">
        <i class="fa fa-spinner fa-pulse fa-4x fa-fw"></i>
      </div>
    </div>

    <div id="document-pager">
      <div style="margin-bottom: 10px; font-weight: bold;"><i class="fa fa-lg fa-folder-open" v-if="isFolderMode"></i> {{isFolderMode ? folderName : 'Plus de documents'}}</div>
      <xerox-button class="btn-nav" style="float: left" aria-label="Précédent" v-on:pushed="showPrevious" v-bind:disabled="!canPrevious" v-bind:class="{ 'btn-warning': canPrevious}">
        <i class="fa fa-chevron-left fa-2x" aria-hidden="true"></i>
      </xerox-button>
      <span style="margin-top: 20px;">{{currentPage}} / {{pageCount}}</span>
      <xerox-button class="btn-nav" style="float: right" aria-label="Suivant" v-on:pushed="showNext" v-bind:disabled="!canNext" v-bind:class="{ 'btn-warning': canNext}">
        <i class="fa fa-chevron-right fa-2x" aria-hidden="true"></i>
      </xerox-button>
    </div>
    <xerox-button id="search-doc-btn" class="btn-danger btn-large" v-if="!isDe" to="/DocumentTypeListSearch"><i class="fa fa-search fa-lg"></i> Rechercher</xerox-button>
    <xerox-button id="folders-btn" class="btn-success btn-large" to="/DossierList" v-if="!this.isDe && !isFolderMode" v-bind:disabled="isLinkedDocument"><i class="fa fa-folder-open fa-lg"></i> Dossiers</xerox-button>
    <xerox-button id="back-btn" class="btn-large btn-danger back-button" v-if="isFolderMode && folderSize === 0" v-on:pushed="changeFolder"><img src="../assets/back-arrow-white.png" /> Retour liste<br />&nbsp; &nbsp; &nbsp; des dossiers</xerox-button>
    <xerox-button id="submit-doc-btn" class="btn-success btn-large" v-bind:disabled="currentType === null" v-on:pushed="validateChoice">OK</xerox-button>
  </div>
</template>

<script>
  import documentApi from '../api/document'
  export default {
    name: 'DocumentTypeList',
    props: {
      nextScreen: {
        type: String,
        default: null
      }
    },
    data() {
      return {
        maxListSize: 5,
        currentIndex: 0,
        currentType: null,
        types: [],
        listLimit: -1
      }
    },
    computed: {
      displayTypes() {
        var showed = [];
        for (var i = this.currentIndex; (i < this.currentIndex + this.maxListSize) && this.types.length > i; ++i) {
          showed.push(this.types[i])
        }
        return showed;
      },
      canPrevious() {
        return this.currentIndex >= this.maxListSize
      },
      canNext() {
        return this.currentPage < this.pageCount
      },
      pageCount() {
        let tmpTypesLength = this.types.length
        return Math.trunc(tmpTypesLength / this.maxListSize) + (tmpTypesLength % this.maxListSize > 0 ? 1 : 0)
      },
      currentPage() {
        return Math.trunc(this.currentIndex / this.maxListSize) + 1
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
      folderSize() {
        return this.$store.getters.currentFolder.length
      },
      isLinkedDocument() {
        return this.$store.getters.currentGroupId !== null && this.$store.getters.currentGroupId.length > 0
      }
    },
    methods: {
      showPrevious() {
        if (this.canPrevious) {
          this.currentIndex -= this.maxListSize;
        }
      },
      showNext() {
        if (this.canNext) {
          this.currentIndex += this.maxListSize;
        }
      },
      changeFolder() {
        this.$store.dispatch('finishCurrentGroup')
        this.$store.dispatch('resetFolder')
        this.$router.push('DossierList')
      },
      changeCurrentType(clickedType) {
        this.currentType = clickedType;
      },
      validateChoice() {
        if (this.currentType !== null) {
          this.$store.dispatch('updateCurrentDocType', this.currentType)
          this.$router.push({ name: this.nextScreen === null || this.nextScreen.length === 0 ? 'ScanLauncher' : this.nextScreen })
        }
      }
    },
    beforeMount() {
      this.listLimit = this.$store.getters.isDe ? -1 : 24
      let target = this.$store.getters.isDe ? documentApi.getDEList() : documentApi.getConseillerList(this.folderName)
      target.then(docs => {
        this.types = this.listLimit > 0 ? docs.slice(0, this.listLimit) : docs
      }).catch(() => {
        alert('Une erreur est survenue lors de la récupération des documents')
      })
    }
  }
</script>

<style scoped lang="scss">
  @import "../assets/sass/definitions.scss";
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
  #search-doc-btn {
    text-align: left;
    position: absolute;
    top: $btn-height + $padding-outer + 40px;
    right: 0;
  }
  #folders-btn, #back-btn {
    text-align: left;
    position: absolute;
    top: $btn-height + $padding-outer + 130px;
    right: 0;
  }
  #submit-doc-btn {
    position: absolute;
    bottom: 0;
    right: 0;
    margin-bottom: $padding-outer + $margin-outer;
  }

  .btn-list-element {
    position: relative;
  }
  .doc-maitre {
    position: absolute;
    right: $margin-outer;
    top: ($btn-list-height - 21px) / 2;
  }
</style>

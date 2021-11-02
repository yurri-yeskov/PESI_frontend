<template>
  <div>
    <div>
      <div class="form-inline btn-list-element-search" style="background: transparent; padding: 0; margin: 0;">
        <div class="btn-group" id="search-input">
          <input type="text" ref="searchInput" class="form-control" placeholder="Saisir votre recherche" v-model="search" v-on:keypress="handleKey" @focus="showKeyboard = true">
          <xerox-button id="searchClear" v-on:pushed="clearSearch"><span class="fa fa-lg fa-times"></span></xerox-button>
        </div>
        <xerox-button id="btn-search" class="btn-danger" v-on:pushed="doSearch"><i class="fa fa-2x fa-search"></i></xerox-button>

        <br />

        <div v-if="filteredTypes.length === 0 && lastSearch.length > 0" style="text-align: center; color: #333; margin-top: 30px;">
          Aucun résultat
        </div>
      </div>
      <table style="width: 100%" v-if="filteredTypes.length > 0 && lastSearch.length > 0">
        <tbody>
          <tr v-for="item in displayTypes" v-bind:key="item.code">
            <td style="text-align: left">
              <xerox-button class="btn-list-element-search" v-on:pushed="changeCurrentType(item)" v-bind:class="{'btn-list-element-selected': item === currentType}">{{item.libelle}}</xerox-button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div id="document-pager">
      <div style="margin-bottom: 10px; font-weight: bold;"><i class="fa fa-lg fa-folder-open" v-if="isFolderMode"></i> {{isFolderMode ? folderName : 'Plus de documents'}}</div>
      <xerox-button class="btn-nav" style="float: left" aria-label="Précédent" v-on:pushed="showPrevious" v-bind:disabled="!canPrevious" v-bind:class="{ 'btn-warning': canPrevious}">
        <i class="fa fa-chevron-left fa-2x" aria-hidden="true"></i>
      </xerox-button>
      <span v-if="lastSearch.length > 0 && pageCount > 0" style="margin-top: 20px;">{{currentPage}} / {{pageCount}}</span>
      <xerox-button class="btn-nav" style="float: right" aria-label="Suivant" v-on:pushed="showNext" v-bind:disabled="!canNext" v-bind:class="{ 'btn-warning': canNext}">
        <i class="fa fa-chevron-right fa-2x" aria-hidden="true"></i>
      </xerox-button>
    </div>

    <xerox-button id="search-doc-btn" class="btn-danger btn-large" to="/DocumentTypeList"><img src="../assets/back-arrow-white.png" /> Liste initiale</xerox-button>
    <xerox-button id="submit-doc-btn" class="btn-success btn-large" v-bind:disabled="currentType === null" v-on:pushed="validateChoice">OK</xerox-button>
    <vue-touch-keyboard v-if="showKeyboard && false" layout="PE-CONSEILLER" defaultKeyset="search" :input="$refs.searchInput" :options="options" @cancel="hideKeyboard()" @accept="doSearch()" />
  </div>
</template>

<script>
  import documentApi from '../api/document'
  import stringUtils from '../util/stringUtils'
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
        maxListSize: 4,
        currentIndex: 0,
        currentType: null,
        types: [],
        filteredTypes: [],
        search: '',
        lastSearch: '',
        showKeyboard: true,
        options: {
          useKbEvents: true,
          preventClickEvent: true
        }
      }
    },
    computed: {
      displayTypes() {
        var showed = [];
        for (var i = this.currentIndex; (i < this.currentIndex + this.maxListSize) && this.filteredTypes.length > i; ++i) {
          showed.push(this.filteredTypes[i]);
        }
        return showed;
      },
      canPrevious() {
        return this.currentIndex >= this.maxListSize && this.lastSearch.length > 0
      },
      canNext() {
        return this.lastSearch.length > 0 && this.currentPage < this.pageCount
      },
      pageCount() {
        let tmpTypesLength = this.filteredTypes.length
        return Math.trunc(tmpTypesLength / this.maxListSize) + (tmpTypesLength % this.maxListSize > 0 ? 1 : 0)
      },
      currentPage() {
        return Math.trunc(this.currentIndex / this.maxListSize) + 1
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
      handleKey(event) {
        if (event.keyCode === 13) {
          this.doSearch()
        }
      },
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
      changeCurrentType(clickedType) {
        this.currentType = clickedType;
      },
      validateChoice() {
        if (this.currentType !== null) {
          this.$store.dispatch('updateCurrentDocType', this.currentType)
          this.$router.push({ name: this.nextScreen === null || this.nextScreen.length === 0 ? 'ScanLauncher' : this.nextScreen });
        }
      },
      clearSearch() {
        this.search = ''
      },
      doSearch() {
        this.filteredTypes.splice(0, this.filteredTypes.length)
        let updatedUpper = stringUtils.normalizeUpper(this.search)
        for (let tmp of this.types) {
          if (updatedUpper.length === 0 || tmp.libelleUpper.indexOf(updatedUpper) >= 0) {
            this.filteredTypes.push(tmp)
          }
        }
        this.filteredTypes.sort((doc1, doc2) => doc1.libelleUpper < doc2.libelleUpper ? -1 : (doc1.libelleUpper > doc2.libelleUpper ? 1 : 0))
        this.currentIndex = 0
        this.lastSearch = this.search
        this.hideKeyboard()
      },
      hideKeyboard() {
        this.showKeyboard = false
      }
    },
    beforeMount() {
      let target = this.$store.getters.isDe ? documentApi.getDEList() : documentApi.getConseillerList()
      target.then(docs => {
        for (let tmp of docs) {
          tmp.libelleUpper = stringUtils.normalizeUpper(tmp.libelle)
        }
        docs.sort((doc1, doc2) => doc1.libelleUpper < doc2.libelleUpper ? -1 : (doc1.libelleUpper > doc2.libelleUpper ? 1 : 0))
        this.types = docs
        for (let tmp of this.types) {
          this.filteredTypes.push(tmp)
        }
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
    position: absolute;
    top: $btn-height + $padding-outer + 40px;
    right: 0;
  }
  #submit-doc-btn {
    position: absolute;
    bottom: 0;
    right: 0;
    margin-bottom: $padding-outer + $margin-outer;
  }

  $search-height: 55px;
  #search-input {
    width: $btn-list-width-search - $search-height - 40px;
    position: relative;
  }
  #search-input input {
    width: 100%;
    height: $search-height;
    font-size: $font-size-base * 1.35;
  }
  #searchClear {
    position: absolute;
    right: 5px;
    top: 0;
    bottom: 0;
    margin: auto;
    cursor: pointer;
    color: #ccc;
    line-height: $search-height;
    background: transparent;
  }

  #btn-search {
    height: $search-height;
    float: right;
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

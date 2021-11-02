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

        <div v-if="filteredElements.length === 0 && lastSearch.length > 0" style="text-align: center; color: #333; margin-top: 30px;">
          Aucun résultat
        </div>
      </div>
      <div v-if="filteredElements.length > 0 && lastSearch.length > 0">
        <xerox-button v-for="item in displayedElements" v-bind:key="item.codeAssedic" class="btn-list-element" v-on:pushed="changeCurrent(item)" v-bind:class="{'btn-list-element-selected': item === current}" style="display: block;">{{item.libelleAssedic}} - {{item.codeAssedic}}</xerox-button>
      </div>
    </div>

    <div id="document-pager">
      <div style="margin-bottom: 10px; font-weight: bold;">Plus de régions</div>
      <xerox-button class="btn-nav" style="float: left" aria-label="Précédent" v-on:pushed="showPrevious" v-bind:disabled="!canPrevious">
        <i class="fa fa-chevron-left fa-2x" aria-hidden="true"></i>
      </xerox-button>
      <span v-if="lastSearch.length > 0 && pageCount > 0" style="margin-top: 20px;">{{currentPage}} / {{pageCount}}</span>
      <xerox-button class="btn-nav" style="float: right" aria-label="Suivant" v-on:pushed="showNext" v-bind:disabled="!canNext">
        <i class="fa fa-chevron-right fa-2x" aria-hidden="true"></i>
      </xerox-button>
    </div>

    <xerox-button id="zone1-btn" class="btn-success btn-large" v-bind:disabled="current === null" v-on:pushed="validateChoice('updateDrZone1')">Modif. région 1</xerox-button>
    <xerox-button id="zone2-btn" class="btn-success btn-large" v-bind:disabled="current === null" v-on:pushed="validateChoice('updateDrZone2')">Modif. région 2</xerox-button>
    <xerox-button id="back-btn" class="btn-danger btn-large" v-on:pushed="cancel">Retour</xerox-button>

    <vue-touch-keyboard v-if="showKeyboard && false" layout="PE-CONSEILLER" defaultKeyset="search" :input="$refs.searchInput" :options="options" @cancel="hideKeyboard()" @accept="doSearch()" />
  </div>
</template>

<script>
  import dr from '../api/drList'
  import stringUtils from '../util/stringUtils'
  export default {
    name: 'DRList',
    props: {
      nextScreen: {
        type: String,
        default: null
      },
      prefilledDE: {
        type: String,
        default: null
      }
    },
    data() {
      return {
        maxListSize: 4,
        currentIndex: 0,
        current: null,
        elements: [],
        filteredElements: [],
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
      displayedElements() {
        var showed = [];
        for (var i = this.currentIndex; (i < this.currentIndex + this.maxListSize) && this.filteredElements.length > i; ++i) {
          showed.push(this.filteredElements[i]);
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
        let tmpLength = this.filteredElements.length
        return Math.trunc(tmpLength / this.maxListSize) + (tmpLength % this.maxListSize > 0 ? 1 : 0)
      },
      currentPage() {
        return Math.trunc(this.currentIndex / this.maxListSize) + 1
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
      changeCurrent(clicked) {
        this.current = clicked;
      },
      cancel() {
        this.$router.push({ name: 'LoginNext', params: { prefilledDE: this.prefilledDE } })
      },
      validateChoice(zone) {
        if (this.current !== null) {
          this.$store.dispatch(zone, this.current)
          this.$router.push({ name: 'LoginNext', params: { prefilledDE: this.prefilledDE } })
        }
      },
      clearSearch() {
        this.search = ''
      },
      doSearch() {
        this.filteredElements.splice(0, this.filteredElements.length)
        let updatedUpper = stringUtils.normalizeUpper(this.search)
        for (let tmp of this.elements) {
          if (updatedUpper.length === 0 || tmp.libelleUpper.indexOf(updatedUpper) >= 0 || tmp.codeAssedic.indexOf(updatedUpper) >= 0) {
            this.filteredElements.push(tmp)
          }
        }
        this.filteredElements.sort((doc1, doc2) => doc1.libelleUpper < doc2.libelleUpper ? -1 : (doc1.libelleUpper > doc2.libelleUpper ? 1 : 0))
        this.currentIndex = 0
        this.lastSearch = this.search
        this.hideKeyboard()
      },
      hideKeyboard() {
        this.showKeyboard = false
      }
    },
    beforeMount() {
      dr.getDrList().then(drList => {
        for (let tmp of drList) {
          tmp.libelleUpper = stringUtils.normalizeUpper(tmp.libelleAssedic)
        }
        drList.sort((dr1, dr2) => dr1.libelleUpper < dr2.libelleUpper ? -1 : (dr1.libelleUpper > dr2.libelleUpper ? 1 : 0))
        this.elements.push(...drList)
        this.filteredElements.push(...drList)
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
  #zone1-btn {
    position: absolute;
    bottom: 180px;
    right: 0;
    margin-bottom: $padding-outer + $margin-outer;
  }
  #zone2-btn {
    position: absolute;
    bottom: 90px;
    right: 0;
    margin-bottom: $padding-outer + $margin-outer;
  }
  #back-btn {
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

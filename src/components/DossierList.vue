<template>
  <div style="position: relative; height: 100%;">
    <div id="subtitle">
      <i class="fa fa-folder-open fa-2x"></i> Sélection du dossier 
    </div>

    <div>
      <xerox-button v-for="item in types" v-bind:key="item" class="btn-list-element" v-on:pushed="changeCurrent(item)" v-bind:class="{'btn-list-element-selected': item === currentType}" style="display: block;">{{item}}</xerox-button>
    </div>

    <xerox-button id="back-btn" class="btn-large btn-danger back-button" v-on:pushed="backChoice"><img src="../assets/back-arrow-white.png" /> Retour</xerox-button>
    <xerox-button v-if="false" id="edit-btn" class="btn-success btn-large" v-on:pushed="validateChoice('traitement')" v-bind:disabled="currentType === null"><i class="fa fa-pencil-square-o fa-lg"></i> Numériser pour traitement</xerox-button>
    <xerox-button id="archive-btn" class="btn-success btn-large" v-on:pushed="validateChoice('archive')" v-bind:disabled="currentType === null"><i class="fa fa-archive fa-lg"></i> Numériser pour archivage</xerox-button>
  </div>
</template>

<script>
  import document from '../api/document';
  export default {
    name: 'DossierList',
    props: {
      nextScreen: {
        type: String,
        default: null
      }
    },
    data() {
      return {
        currentType: null,
        types: []
      }
    },
    computed: {
      isDe() {
        return this.$store.getters.isDe
      }
    },
    methods: {
      changeCurrent(clicked) {
        this.currentType = clicked;
      },
      backChoice() {
        this.$store.dispatch('resetFolder')
        this.$router.push({ name: 'DocumentTypeList' })
      },
      validateChoice(archive) {
        if (this.currentType !== null) {
          this.$store.dispatch('setFolder', this.currentType)
          this.$store.dispatch('setFolderAction', archive)
          this.$router.push({ name: 'DocumentTypeList' })
        }
      }
    },
    beforeMount() {
      this.types = document.getFolders()
    }
  }
</script>

<style scoped lang="scss">
  @import "../assets/sass/definitions.scss";
  #subtitle {
    font-size: $font-size-base * 1.2;
    padding-top: $padding-outer;
    height: 75px;
    i {
      vertical-align: middle;
    }
  }
  #back-btn {
    text-align: center;
    position: absolute;
    top: 0;
    right: 0;
  }
  #edit-btn {
    text-align: left;
    position: absolute;
    bottom: $btn-height + $padding-outer + 20px;
    right: 0;
  }
  #archive-btn {
    text-align: left;
    position: absolute;
    bottom: $padding-outer;
    right: 0;
  }
</style>

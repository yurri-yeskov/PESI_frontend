<template>
  <div class="navbar navbar-default">
    <div class="container-fluid">
      <div class="navbar-header">
        <xerox-button class="navbar-brand"><img src="../assets/brand.png" /></xerox-button>
        <p class="navbar-text" v-if="de === null">{{title}}</p>
        <xerox-button v-else to="/DESelection" class="btn btn-default btn-log-off nav-de"><span>{{de}}</span>&nbsp;<img src="../assets/user-icon.png" style="text-align: left; vertical-align: middle; margin-top: -6px;" /></xerox-button>
      </div>
      <div class="nav navbar navbar-right" v-if="isAuthenticated">
        <xerox-button v-on:pushed="modal.show = true" class="btn btn-default btn-log-off nav-user">{{user}}&nbsp;<i class="fa fa-lg fa-power-off log-off-img"></i></xerox-button>
      </div>
    </div>
    <wait-modal v-on:waitNegative="modal.show = false" v-on:waitPositive="onSignOut()" v-bind="modal" v-if="modal.show" :body-label="confirmationMessage"></wait-modal>
  </div>
</template>

<script>
  export default {
    name: 'NavBar',
    computed: {
      user() {
        return this.$store.getters.userName
      },
      isAuthenticated() {
        return this.$store.getters.isAuthenticated
      },
      de() {
        let tmp = this.$store.getters.deInfos
        return tmp === null ? null : `${tmp.firstName} ${tmp.lastName}`
      },
      confirmationMessage() {
        return 'Voulez-vous vraiment vous déconnecter ?' + (this.$store.getters.currentDocType.code === null ? '' : ' Vos actions en cours seront perdues.')
      }
    },
    data() {
      return {
        title: '',
        modal: {
          show: false,
          showProgress: false,
          showAlternateBody: false,
          showNegativeButton: true,
          showPositiveButton: true,
          negativeButtonLabel: 'Non',
          positiveButtonLabel: 'Oui'
        }
      }
    },
    methods: {
      onSignOut() {
        this.$router.push('/logout')
        this.modal.show = false
      },
      onHomeClicked() {
        if (this.isAuthenticated && (this.$store.getters.isDe || this.de !== null)) {
          this.$router.push('/DocumentTypeList')
        }
      }
    },
    mounted() {
      this.title = this.$router.currentRoute.meta.title
    },
    watch: {
      '$route'(to, from) {
        this.title = to.meta.title
        document.title = this.title + ' - Scan Intelligent'
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../assets/sass/definitions.scss";

  .navbar {
    height: 60px;
    margin-bottom: 0px;
    margin-top: 0px;
  }

  .navbar-header {
    min-width: 400px;
  }

  .navbar-default .navbar-brand {
    color: rgb(60, 60, 60);
  }

  .navbar-brand {
    height: 60px;
    max-width: 500px;
    padding-top: 0;
    padding-bottom: 0;
    background: transparent;
  }

  .navbar-text {
    font-size: $font-size-base * 1.2;
  }

  .btn-log-off {
    height: 50px;
    margin-top: 3px;
    border: none;
  }

  .nav-de {
    float: left;
    max-width: 360px;
  }

  .nav-de span {
    float: left;
    text-align: left;
    max-width: 300px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-top: 2px;
  }

  .nav-user {
    float: right;
    max-width: 305px;
    text-align: right;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>

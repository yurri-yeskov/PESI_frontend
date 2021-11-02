<template>
  <h1 class="maintenance"><i class="fa fa-exclamation-triangle fa-3x"></i> <br /> L'application "{{title}}" est en cours de maintenance. Merci de réessayer ultérieurement</h1>
</template>

<script>
  export default {
    name: 'Maintenance',
    props: {
      type: {
        type: String,
        default: null
      }
    },
    computed: {
      title() {
        return this.$store.getters.isDe ? 'Demandeurs d\'emploi - Envoi de documents' : 'Conseillers'
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '../assets/sass/definitions.scss';

  .maintenance {
    font-size: $font-size-base * 2.2;
    text-align: center;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    margin-top: 0;
  }
</style>

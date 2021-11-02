<template>
  <div id="app">
    <nav-bar></nav-bar>
    <div id="content" class="container-fluid">
      <router-view />
    </div>
  </div>
</template>

<script>
  import NavBar from './components/NavBar.vue'
  export default {
    name: 'app',
    components: {
      NavBar
    }
  }
</script>

<style lang="scss">
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    color: #2c3e50;
    height: 100%;
    /*margin-top: 60px;*/
  }
  #content {
    position: relative;
    margin-top: 10px;
    min-height: 410px;
  }
</style>

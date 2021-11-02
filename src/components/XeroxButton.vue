<template>
  <button type="button" ondragstart="return false;" draggable="false" v-on:mousedown="handleClick($event)" v-on:touchdown="handleClick($event)">
    <slot>OK</slot>
  </button>
</template>

<script>
  import keyboard from '../util/keyboard'
  export default {
    name: 'XeroxButton',
    props: {
      to: {
        type: String,
        default: ''
      }
    },
    methods: {
      handleClick(event) {
        keyboard.hide()
        if (this.to && this.to.length > 0) {
          this.$router.push(this.to)
        } else {
          this.$emit('pushed')
        }
        if (event) {
          event.preventDefault()
          event.stopPropagation()
        }
        return false
      }
    }
  }
</script>

<style scoped lang="scss">
  
</style>

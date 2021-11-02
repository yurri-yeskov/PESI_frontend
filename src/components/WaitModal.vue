<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header" v-if="headerLabel.length > 0">
            <slot name="header">
              <h3>{{headerLabel}}</h3>
            </slot>
          </div>

          <div class="modal-body">
            <slot name="body">
              <i class="fa fa-spinner fa-pulse fa-4x fa-fw" v-if="showProgress"></i>
              <i class="fa fa-exclamation-triangle fa-4x fa-fw" v-if="showWarning"></i>
              <h4>{{bodyText}}</h4>
            </slot>
          </div>

          <div class="modal-footer row-fluid form-inline" v-if="showNegativeButton || showPositiveButton">
            <slot name="footer">
              <xerox-button class="btn-large btn-warning" v-on:pushed="$emit('waitNegative')" v-if="showNegativeButton">
                {{negativeButtonLabel}}
              </xerox-button>
              <xerox-button class="btn-large btn-success" v-on:pushed="$emit('waitPositive')" v-if="showPositiveButton">
                {{positiveButtonLabel}}
              </xerox-button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  export default {
    name: 'WaitModal',
    props: {
      showProgress: {
        type: Boolean,
        default: true
      },
      showWarning: {
        type: Boolean,
        default: false
      },
      showNegativeButton: {
        type: Boolean,
        default: true
      },
      showPositiveButton: {
        type: Boolean,
        default: true
      },
      showAlternateBody: {
        type: Boolean,
        default: false
      },
      headerLabel: {
        type: String,
        default: ''
      },
      bodyLabel: {
        type: String,
        default: ''
      },
      alternateBodyLabel: {
        type: String,
        default: ''
      },
      negativeButtonLabel: {
        type: String,
        default: 'Annuler'
      },
      positiveButtonLabel: {
        type: String,
        default: 'OK'
      }
    },
    computed: {
      bodyText() {
        return this.showAlternateBody ? this.alternateBodyLabel : this.bodyLabel
      }
    }
  }
</script>

<style scoped lang="scss">
  /* https://fr.vuejs.org/v2/examples/modal.html */
  .modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    display: table;
    transition: opacity .3s ease;
  }

  .modal-wrapper {
    display: table-cell;
    vertical-align: middle;
  }

  .modal-container {
    max-width: 600px;
    margin: 0px auto;
    padding: 10px;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
    transition: all .3s ease;
    font-family: Helvetica, Arial, sans-serif;
  }

  .modal-header h3 {
    margin-top: 0;
    color: #42b983;
  }

  .modal-body {
    margin: 20px 0;
    text-align: center;
  }

  .modal-enter {
    opacity: 0;
  }

  .modal-leave-active {
    opacity: 0;
  }

  .modal-enter .modal-container,
  .modal-leave-active .modal-container {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
  }

  .modal-footer {
    text-align: center;
  }
  .modal-footer button {
    display: inline-block;
  }
</style>

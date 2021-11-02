<template>
  <div class="vue-touch-keyboard">
    <div class="keyboard">
      <div class="line" v-for="(line, index) in keySet" :key="index">
        <xerox-button v-for="(key, index) in line" :key="index" :class="getClassesOfKey(key)" v-text="getCaptionOfKey(key)" @pushed="clickKey(key)" :style="getKeyStyle(key)" onfocus="this.blur()"></xerox-button>
      </div>
    </div>
  </div>
</template>

<script>
  // Based on https://github.com/icebob/vue-touch-keyboard, heavily modified

  // The MIT License (MIT)
  //
  // Copyright (c) 2016 Icebob
  //
  // Permission is hereby granted, free of charge, to any person obtaining a copy
  // of this software and associated documentation files (the "Software"), to deal
  // in the Software without restriction, including without limitation the rights
  // to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  // copies of the Software, and to permit persons to whom the Software is
  // furnished to do so, subject to the following conditions:
  //
  // The above copyright notice and this permission notice shall be included in all
  // copies or substantial portions of the Software.
  //
  // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  // IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  // FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  // AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  // LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  // OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  // SOFTWARE.

  import Layouts from '../util/layouts';
  import isString from 'lodash/isString';
  import isObject from 'lodash/isObject';

  export default {
    props: {
      input: HTMLInputElement,
      layout: [String, Object],
      defaultKeyset: String,
      change: Function,
      options: {
        type: Object,
        default() {
          return {};
        }
      }
    },
    data() {
      return {
        currentKeySet: 'default',
        inputScrollLeft: 0
      };
    },
    computed: {
      keySet() {
        let layout = this.getLayout();
        if (!layout) return;
        let keySet = layout[this.currentKeySet];
        if (!keySet) return;

        let res = [];

        let meta = layout['_meta'] || {};

        keySet.forEach((line) => {
          let row = [];
          line.split(' ').forEach((item) => {
            if (isObject(item)) {
              row.push(item);
            } else if (isString(item)) {
              if (item.length > 2 && item[0] === '{' && item[item.length - 1] === '}') {
                let name = item.substring(1, item.length - 1);
                if (meta[name]) {
                  row.push(meta[name]);
                } else {
                  console.warn('Missing named key from meta: ' + name);
                }
              } else {
                if (item === '') {
                  // Placeholder
                  row.push({
                    placeholder: true
                  });
                } else {
                  // Normal key
                  row.push({
                    key: item,
                    text: item
                  });
                }
              }
            }
          });
          res.push(row);
        });

        return res;
      }
    },

    watch: {
      layout() {
        console.log('Layout changed');
        this.currentKeySet = 'default';
      }
    },

    methods: {
      getLayout() {
        if (isString(this.layout)) return Layouts[this.layout];
        return this.layout;
      },
      changeKeySet(name) {
        let layout = this.getLayout();
        if (layout[name] != null) this.currentKeySet = name;
      },
      toggleKeySet(name) {
        this.currentKeySet = this.currentKeySet === name ? 'default' : name;
      },
      getCaptionOfKey(key) {
        return key.text || key.key || '';
      },
      getClassesOfKey(key) {
        if (key.placeholder) {
          return 'placeholder';
        } else {
          let classes = 'key ' + (key.func || '') + ' ' + (key.classes || '');
          if (key.keySet && this.currentKeySet === key.keySet) {
            classes += ' activated';
          }

          classes = classes.trim()
          if (classes === 'key') {
            classes += ' basic'
          }

          return classes;
        }
      },
      getKeyStyle(key) {
        if (key.width) {
          return {
            width: key.width + 'px'
          };
        }
      },
      supportsSelection() {
        return (/text|password|search|tel|url/).test(this.input.type);
      },
      getCaret() {
        if (this.supportsSelection()) {
          let pos = {
            start: this.input.selectionStart || 0,
            end: this.input.selectionEnd || 0
          };

          if (pos.end < pos.start) pos.end = pos.start;

          return pos;
        } else {
          let val = this.input.value;
          return {
            start: val.length,
            end: val.length
          };
        }
      },
      backspace(caret, text) {
        text = text.substring(0, caret.start - 1) + text.substring(caret.start);
        caret.start -= 1;
        caret.end = caret.start;

        if (this.options.useKbEvents) {
          let e = document.createEvent('Event');
          e.initEvent('keydown', true, true);
          e.which = e.keyCode = 8;
          this.input.dispatchEvent(e);
        }
        return text;
      },
      insertChar(caret, text, ch) {
        text = text.substr(0, caret.start) + ch.toString() + text.substr(caret.start);
        caret.start += ch.length;
        caret.end = caret.start;
        return text;
      },
      clickKey(key) {
        if (!this.input) return;

        let caret = this.getCaret();
        let text = this.input.value;
        let addChar = null;
        if (typeof key === 'object') {
          if (key.keySet) {
            this.toggleKeySet(key.keySet);
          } else if (key.func) {
            switch (key.func) {
              case 'backspace': {
                text = this.backspace(caret, text);
                break;
              }

              case 'accept': {
                this.$emit('accept', text)
                return;
              }

              case 'cancel': {
                this.$emit('cancel')
                return;
              }

              case 'next': {
                this.$emit('next', text)
                return;
              }
            }
          } else {
            addChar = key.key;
          }
        } else {
          addChar = key;
        }

        if (addChar) {
          if (this.input.maxLength <= 0 || text.length < this.input.maxLength) {
            if (this.options.useKbEvents) {
              let e = document.createEvent('Event');
              e.initEvent('keydown', true, true);
              e.which = e.keyCode = addChar.charCodeAt();
              if (this.input.dispatchEvent(e)) {
                text = this.insertChar(caret, text, addChar);
              }
            } else {
              text = this.insertChar(caret, text, addChar);
            }
          }

          if (this.currentKeySet === 'shifted') {
            this.changeKeySet('default');
          }
        }

        this.input.value = text;
        this.setFocusToInput(caret);

        if (this.change) {
          this.change(text, addChar);
        }

        if (this.input.maxLength > 0 && text.length >= this.input.maxLength) {
          // The value reached the maxLength
          if (this.next) {
            this.next();
          }
        }

        // trigger 'input' Event
        this.input.dispatchEvent(new Event('input', { bubbles: true }));
      },
      setFocusToInput(caret) {
        this.input.focus();
        if (caret && this.supportsSelection()) {
          this.input.selectionStart = caret.start;
          this.input.selectionEnd = caret.end;
        }
      }
    },

    mounted() {
      if (this.defaultKeyset && this.defaultKeyset != null) {
        this.currentKeySet = this.defaultKeyset
      }
      if (this.input) {
        this.setFocusToInput();
      }
    }
  };
</script>

<style lang="scss">
  $width: 60px;
  $height: 2.2em;
  $margin: 0.5em;
  $radius: 0.35em;

  .vue-touch-keyboard {

    .keyboard {
      width: 100%;
      margin: 0;
      
      .line {
        padding-bottom: 7px;
        text-align: center;
      }
      
      .key {
        &:not(:last-child) {
          margin-right: $margin;
        }
        min-width: $width;
        height: $height;
        line-height: $height;
        overflow: hidden;
        padding-top: 2px;

        vertical-align: middle;
        border: 1px solid #ccc;
        
        box-shadow: 0px 2px 2px rgba(0, 0, 0, .6);
        border-radius: $radius;

        font-size: 1.25em;
        text-align: center;
        white-space: nowrap;
        user-select: none;
        cursor: pointer;


        &.backspace {
          background-image: url("../assets/backspace.svg");
          background-position: center center;
          background-repeat: no-repeat;
          background-size: 35%;
        }

        &.control {
          color: #fff;
          background-color: #7d7d7d;
          border-color: #656565;
        }
              
        &.featured {
          color: #fff;
          background-color: #337ab7;
          border-color: #2e6da4;
        }

        &.activated {
          color: #fff;
          background-color: #5bc0de;
          border-color: #46b8da;
        }

        &.multiline {
          white-space: normal;
          line-height: 0.5em;
        }

        &.width-small {
          max-width: $width*1.2;
        }

        &.numeric {
          background: #E7E7E7;
        }

        &.basic {
          background: white;
        }

        &.hideKeyboard {
          background-image: url("../assets/keyboardDown.png");
          background-position: center center;
          background-repeat: no-repeat;
        }
      }

      .placeholder {
        height: $height;
        line-height: $height;
        
        &:not(:last-child) {
          margin-right: $margin;
        }
      }
      
      
      &:before,
      &:after {
        content: "";
        display: table;
      }
      &:after {
        clear: both;
      }  
    }

  }
</style>

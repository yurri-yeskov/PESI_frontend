import Vue from 'vue'
import store from '@/store'
import DocumentTypeList from '@/components/DocumentTypeList'

describe('DocumentTypeList.vue', () => {
  it('should render correct contents', () => {
    const Constructor = Vue.extend(DocumentTypeList)
    const vm = new Constructor({ store }).$mount()
    expect(vm.$el.querySelector('#submit-doc-btn').textContent).to.equal('OK')
  })
})

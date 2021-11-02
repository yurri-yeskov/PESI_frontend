import moxios from 'moxios'
import sinon from 'sinon'
import { equal } from 'assert'
import scanServices from '@/plugins/VueScanner/scanServices'
import * as templateManagement from './mock/templateManagement'
import * as jobManagement from './mock/job'

describe('scanServices.js', () => {
  beforeEach(() => {
    moxios.install()
  })
  afterEach(() => {
    moxios.uninstall()
  })

  it('should launch a scan operation', (done) => {
    let onFulfilled = sinon.spy()
    scanServices.launchScan('localhost', 'scanIntelligent.xst').then(onFulfilled)
    moxios.wait(() => {
      let request = moxios.requests.mostRecent()
      request.respondWith({
        status: 200,
        response: jobManagement.LAUNCH
      }).then(() => {
        let result = onFulfilled.getCall(0).args[0]
        equal(result, 'job:941')
        done()
      }).catch(error => {
        done(error)
      })
    })
  })

  it('should list templates', (done) => {
    let onFulfilled = sinon.spy()
    scanServices.listTemplates('localhost').then(onFulfilled)
    moxios.wait(() => {
      let request = moxios.requests.mostRecent()
      request.respondWith({
        status: 200,
        response: templateManagement.LIST
      }).then(() => {
        let result = onFulfilled.getCall(0).args[0]
        equal(result.length, 2)
        equal(result[0].name, 'scanIntelligent.xst')
        equal(result[0].checksum, '301164250')
        equal(result[1].name, 'Carte.XST')
        equal(result[1].checksum, '330104028')
        done()
      }).catch(error => {
        done(error)
      })
    })
  })

  it('should delete template', (done) => {
    let onFulfilled = sinon.spy()
    scanServices.deleteTemplate('localhost', 'Carte.XST', '301164250').then(onFulfilled)
    moxios.wait(() => {
      let request = moxios.requests.mostRecent()
      request.respondWith({
        status: 200,
        response: templateManagement.DELETE
      }).then(() => {
        done()
      }).catch(error => {
        done(error)
      })
    })
  })
})

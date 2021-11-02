import Vue from 'vue'
import moxios from 'moxios'
import sinon from 'sinon'
import { equal } from 'assert'
import * as job from './mock/job'

const vue = new Vue();

describe('VueScanner', () => {
  beforeEach(() => {
    moxios.install()
  })
  afterEach(() => {
    moxios.uninstall()
  })

  it('should return job status', (done) => {
    let onFulfilled = sinon.spy()
    vue.$scanner.checkStatus('job:858').then(onFulfilled)
    moxios.wait(() => {
      let request = moxios.requests.mostRecent()
      request.respondWith({
        status: 200,
        response: job.JOB_DETAILS
      }).then(() => {
        let result = onFulfilled.getCall(0).args[0]
        equal(result, false)
        done()
      }).catch(error => {
        done(error)
      })
    })
  })
})

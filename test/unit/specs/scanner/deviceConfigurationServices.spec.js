import moxios from 'moxios'
import sinon from 'sinon'
import { equal } from 'assert'
import deviceConfigurationServices from '@/plugins/VueScanner/deviceConfigurationServices'
import * as deviceConfiguration from './mock/deviceConfiguration'

describe('deviceConfigurationServices.js', () => {
  beforeEach(() => {
    moxios.install()
  })
  afterEach(() => {
    moxios.uninstall()
  })

  it('should return correct configuration', (done) => {
    let onFulfilled = sinon.spy()
    deviceConfigurationServices.getDeviceInformation('localhost').then(onFulfilled)
    moxios.wait(() => {
      let request = moxios.requests.mostRecent()
      request.respondWith({
        status: 200,
        response: deviceConfiguration.DEVICE_INFORMATION
      }).then(() => {
        let result = onFulfilled.getCall(0).args[0]
        equal(result.deviceName, 'I22322')
        equal(result.serial, '3350230237')
        equal(result.systemSoftware, '072.060.165.14201')
        equal(result.mac, '9c:93:4e:49:b6:5e')
        done()
      }).catch(error => {
        done(error)
      })
    })
  })
})

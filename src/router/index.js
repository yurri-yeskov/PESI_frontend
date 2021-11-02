import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'

// Screens
import Login from '@/components/Login'
import SendConfirmation from '@/components/SendConfirmation'
import DocumentTypeList from '@/components/DocumentTypeList'
import ScanLauncher from '@/components/ScanLauncher'
import Preview from '@/components/Preview'

Vue.use(Router)

let intervalId = -1

export default new Router({
  routes: [
    {
      path: '/',
      alias: ['/Login'],
      name: 'Login',
      component: Login,
      meta: {
        title: 'Connexion Demandeur d\'emploi'
      },
      beforeEnter: (to, from, next) => {
        store.dispatch('resetScanState')
        store.dispatch('logout')
        store.dispatch('setDeviceInfos')
        store.dispatch('authScanner').then(() => {
          if (intervalId !== -1) {
            clearInterval(intervalId)
          }
          intervalId = setInterval(() => {
            store.dispatch('authScanner')
          }, 10 * 60 * 1000)
        }).catch(error => {
          alert('Impossible d\'authentifier l\'application. Merci de contacter un conseiller')
          console.debug(error)
        })
        next()
      }
    },
    {
      path: '/Logout',
      name: 'Logout',
      component: Login,
      meta: {
        title: 'Connexion Demandeur d\'emploi'
      },
      beforeEnter: (to, from, next) => {
        location.reload(false)
      }
    },
    {
      path: '/DocumentTypeList',
      alias: '/LoginNext',
      name: 'DocumentTypeList',
      component: DocumentTypeList,
      props: true,
      meta: {
        title: 'Sélectionner un document',
        requiresAuth: true
      }
    },
    {
      path: '/ScanLauncher',
      name: 'ScanLauncher',
      component: ScanLauncher,
      meta: {
        title: 'Préparer le document',
        requiresAuth: true
      }
    },
    {
      path: '/Preview',
      name: 'Preview',
      component: Preview,
      meta: {
        title: 'Vérifier la numérisation',
        requiresAuth: true
      }
    },
    {
      path: '/SendConfirmation/:label/:type',
      name: 'SendConfirmation',
      component: SendConfirmation,
      props: true,
      meta: {
        title: '',
        requiresAuth: true
      }
    }
  ]
})

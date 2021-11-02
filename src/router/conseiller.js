import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'

// Screens
import Login from '@/components/LoginConseiller'
import DESelection from '@/components/DESelection'
import SendConfirmation from '@/components/SendConfirmation'
import DocumentTypeList from '@/components/DocumentTypeList'
import DossierList from '@/components/DossierList'
import DocumentTypeListSearch from '@/components/DocumentTypeListSearch'
import ScanLauncher from '@/components/ScanLauncher'
import Preview from '@/components/Preview'
import DRList from '@/components/DRList'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      alias: ['/Login'],
      name: 'Login',
      component: Login,
      meta: {
        title: 'Connexion Conseiller'
      },
      beforeEnter: (to, from, next) => {
        store.dispatch('resetScanState')
        store.dispatch('resetDE')
        store.dispatch('resetGroupId')
        store.dispatch('resetFolder')
        store.dispatch('logout')
        store.dispatch('setDeviceInfos')
        next()
      }
    },
    {
      path: '/Logout',
      name: 'Logout',
      component: Login,
      meta: {
        title: 'Connexion Conseiller'
      },
      beforeEnter: (to, from, next) => {
        location.reload(false)
      }
    },
    {
      path: '/LoginNext',
      name: 'LoginNext',
      component: DESelection,
      props: true,
      meta: {
        title: 'Sélectionner un DE',
        requiresAuth: true
      },
      beforeEnter: (to, from, next) => {
        store.dispatch('resetScanState')
        next()
      }
    },
    {
      path: '/DESelection',
      name: 'DESelection',
      component: DESelection,
      props: true,
      meta: {
        title: 'Sélectionner un DE',
        requiresAuth: true
      },
      beforeEnter: (to, from, next) => {
        store.dispatch('resetScanState')
        store.dispatch('resetDE')
        store.dispatch('resetGroupId')
        next()
      }
    },
    {
      path: '/DRList',
      name: 'DRList',
      component: DRList,
      props: true,
      meta: {
        title: 'Sélectionner une DR',
        requiresAuth: true
      }
    },
    {
      path: '/DocumentTypeList',
      name: 'DocumentTypeList',
      component: DocumentTypeList,
      props: true,
      meta: {
        title: 'Sélectionner un document',
        requiresAuth: true
      }
    },
    {
      path: '/DocumentTypeListSearch',
      name: 'DocumentTypeListSearch',
      component: DocumentTypeListSearch,
      props: true,
      meta: {
        title: 'Sélectionner un document',
        requiresAuth: true
      }
    },
    {
      path: '/DossierList',
      name: 'DossierList',
      component: DossierList,
      props: true,
      meta: {
        title: 'Sélectionner un dossier',
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

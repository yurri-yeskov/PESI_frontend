import Vue from 'vue'
import Router from 'vue-router'

// Screens
import Maintenance from '@/components/Maintenance'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Maintenance',
      component: Maintenance,
      meta: {
        title: 'Maintenance en cours'
      }
    }
  ]
})

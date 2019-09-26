import Vue from 'vue'
import Router from 'vue-router'
import editer from '@/view/editer'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'editer',
      component: editer
    }
  ]
})

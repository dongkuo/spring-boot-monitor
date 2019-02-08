import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import ServiceInfo from './components/ServiceInfo'
import ServiceLog from './components/ServiceLog'
import Login from './views/Login'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: Home,
      children: [
        {
          path: '/',
          redirect: '/infos',
        },
        {
          path: '/infos',
          name: 'Info',
          component: ServiceInfo
        },
        {
          path: '/logs/:serviceName',
          name: 'Login',
          component: ServiceLog
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import(/* webpackChunkName: "about" */ './views/Login.vue')
    }
  ]
})

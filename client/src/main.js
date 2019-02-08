import Vue from 'vue'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import http from 'axios'
import store from './store'
import App from './App.vue'
import router from './router'
import filters from './filter'
import './prototype'

Vue.config.productionTip = false

Vue.use(iView, {size: 'large'})

Vue.prototype.$http = http

for (let filter in filters) {
  Vue.filter(filter, filters[filter])
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

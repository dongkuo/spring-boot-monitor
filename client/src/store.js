import Vue from 'vue'
import Vuex from 'vuex'
import io from 'socket.io-client'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    serviceInfos: [],
    socket: null
  },
  getters: {
    serviceNames: state => {
      return state.serviceInfos.map(({name}) => name)
    }
  },
  mutations: {
    setServiceInfos(state, serviceInfos) {
      serviceInfos.forEach((serviceInfo) => serviceInfo.isServiceRestarting = false)
      state.serviceInfos = serviceInfos
    },
    updateServiceInfo(state, serviceInfo) {
      for (let info of state.serviceInfos) {
        if (info.name === serviceInfo.name) {
          info.status = serviceInfo.status
          info.info = serviceInfo.info
          return
        }
      }
      state.serviceInfos.push(serviceInfo)
    },
    socketConnect(state, uri) {
      state.socket = io(uri)
    }
  }
})


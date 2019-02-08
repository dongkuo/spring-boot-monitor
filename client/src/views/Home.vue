<!---------------------
 * 首页
 *
 * @author
 * @date 2019-01-14 23:39
 *----------------------->
<template>
  <div class="home">
    <Header></Header>
    <div class="wrapper">
      <Sidebar></Sidebar>
      <router-view class="main"></router-view>
    </div>
  </div>
</template>

<script>
  import Header from '../components/Header'
  import Sidebar from '../components/Sidebar'
  import {mapState} from 'vuex'

  export default {
    name: 'home',
    components: {
      Header,
      Sidebar
    },
    data() {
      return {
      }
    },
    computed: {
      ...mapState(['socket'])
    },
    created() {
      this.$store.commit('socketConnect', '')

      this.socket.on('connect', () => {
        console.log('connected')
      })

      this.socket.on('forbidden', (data) => {
        this.$router.push('/login')
        this.$Message.warning(data)
      })

      this.socket.on('all-service-info', (data) => {
        this.$store.commit('setServiceInfos', data)
      })

      this.socket.on('service-info', (data) => {
        this.$store.commit('updateServiceInfo', data)
      })

      this.socket.on('disconnect', () => {
        console.log('connect disconnect')
      })
    }
  }
</script>

<style scoped>
  .home {
    height: 100%;
  }


  .wrapper {
    width: 100%;
    display: flex;
    position: absolute;
    top: 40px;
    bottom: 0;
    overflow: hidden;
  }


  .main {
    flex: 1;
    overflow-y: scroll;
    position: relative;
  }

</style>

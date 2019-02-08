<!---------------------
 * 侧边栏
 *
 * @author 
 * @date 2019-01-14 23:39
 *----------------------->
<template>
  <div class="sidebar">
    <Menu ref="menu" :active-name="activeMenuName" :open-names="openSubmenus">
      <MenuItem name="/infos" to="/infos">
        <Icon type="md-pulse" size="16"/>
        Infos
      </MenuItem>
      <Submenu name="/logs">
        <template slot="title">
          <Icon type="md-stats" size="16"/>
          Logs
        </template>
        <MenuItem :name="'/logs/' + serviceName" v-for="serviceName in serviceNames"
                  :to="'/logs/' + serviceName"
                  :key="serviceName">
          {{serviceName}}
        </MenuItem>
      </Submenu>
    </Menu>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'

  export default {
    name: "Sidebar",
    data() {
      return {
        activeMenuName: '/logs/cloud-biz-enterprise',
        openSubmenus: []
      }
    },
    computed: mapGetters(['serviceNames']),
    mounted() {
      this.updateMenu()
    },
    methods: {
      updateMenu() {
        this.$nextTick(() => {
          this.activeMenuName = this.$route.path
          let parentPath = this.$route.path.substring(0, this.$route.path.indexOf('/', 1))
          if (parentPath) {
            this.openSubmenus.pushIfAbsent(parentPath)
          }
          this.$refs.menu.updateActiveName()
          this.$refs.menu.updateOpened()
        })
      }
    },
    watch: {
      serviceNames() {
        this.updateMenu()
      },
      $route(to) {
        this.updateMenu()
      }
    }
  }
</script>

<style scoped>
  .sidebar {
    flex: 0 0 240px
  }

  .ivu-menu {
    height: 100%
  }

</style>
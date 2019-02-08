<!---------------------
 * 服务表格
 *
 * @author 
 * @date 2019-01-14 23:59
 *----------------------->
<template>
  <div>
    <Table :columns="tableHead" :data="serviceInfos">
      <template slot-scope="{ row, index }" slot="name">
        <span>{{ row.name }}</span>
      </template>

      <template slot-scope="{ row, index }" slot="status">
        <span :class="row.status === 'UP' ? 'status-up' : 'status-down'">{{ row.status }}</span>
      </template>

      <template slot-scope="{ row, index }" slot="commitID">
        <span>{{ row.info && row.info.git.commit.id.abbrev || '-'}}</span>
      </template>

      <template slot-scope="{ row, index }" slot="commitUser">
        <span>{{ row.info && row.info.git.commit.user.name || '-'}}</span>
      </template>

      <template slot-scope="{ row, index }" slot="buildTime">
        <span>{{ row.info && row.info.build.time || '-'  | date }}</span>
      </template>

      <template slot-scope="{ row, index }" slot="action">
        <Button size="small" class="btn-action" @click="goToLogPage(row.name)">日志</Button>
        <Button size="small" type="warning" class="btn-action"
                :loading="row.isServiceRestarting"
                @click="restartService(row)">
          重启
        </Button>
      </template>
    </Table>
  </div>
</template>

<script>
  import {mapState} from 'vuex'

  export default {
    name: "ServiceInfo",
    props: ['data'],
    data() {
      return {
        tableHead: [
          {
            title: '#',
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title: 'Name',
            slot: 'name',
            align: 'center'
          },
          {
            title: 'Status',
            slot: 'status',
            width: 80,
            align: 'center',
          },
          {
            title: 'Commit ID',
            slot: 'commitID',
            align: 'center'
          },
          {
            title: 'Commit User',
            slot: 'commitUser',
            align: 'center'
          },
          {
            title: 'Build Time',
            slot: 'buildTime',
            align: 'center'
          },
          {
            title: 'Action',
            slot: 'action',
            align: 'center'
          }
        ],
      }
    },
    computed: {
      ...mapState(['serviceInfos', 'socket'])
    },
    methods: {
      goToLogPage(serviceName) {
        this.$router.push(`/logs/${serviceName}`)
      },
      restartService(row) {
        this.socket.emit('restart-service', row.name)
        row.isServiceRestarting = true
      }
    }
  }
</script>

<style scoped>
  .btn-action {
    margin: 0 4px;
  }

  .status-up {
    color: #19be6b;
  }

  .status-down {
    color: #ed4014;
  }

</style>
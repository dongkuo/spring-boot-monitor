<!---------------------
 * 日志显示组件
 *
 * @author 
 * @date 2019-02-05 15:40
 *----------------------->
<template>
  <div class="log" ref="log" @scroll="onScroll">
    <Spin size="large" fix v-if="isLoading"></Spin>
    <Button class="scroll-bottom-btn" shape="circle" icon="md-arrow-down" @click="scrollToBottom"/>
    <ul class="line-number-wrapper">
      <li class="line-number" v-for="(_, i) in log">{{i + 1}}</li>
    </ul>
    <ul class="line-content-wrapper">
      <li class="line-content" v-for="line in log">
        <span v-html="$options.filters.nbsp(line)"></span>
      </li>
    </ul>
  </div>
</template>

<script>
  import {mapState} from 'vuex'

  export default {
    name: "ServiceLog",
    data() {
      return {
        isLoading: true,
        isLockingToBottom: true,
        log: []
      }
    },
    computed: {
      ...mapState(['socket'])
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.subscribeLog()
      })
    },
    beforeRouteUpdate(to, from, next) {
      this.unsubscribeLog()
      next()
      this.subscribeLog()
    },
    beforeRouteLeave(to, from, next) {
      this.unsubscribeLog()
      next()
    },
    methods: {
      subscribeLog() {
        this.log = []
        this.isLoading = true
        this.socket.emit('subscribe-service-log', this.$route.params['serviceName'])

        this.socket.on('all-service-log', (data) => {
          this.log = data
          this.isLoading = false
          if (this.isLockingToBottom) {
            this.scrollToBottom()
          }
        })

        this.socket.on('service-log', (data) => {
          this.log.push(data)
          this.isLoading = false

          this.$nextTick(function () {
            if (this.isLockingToBottom) {
              this.scrollToBottom()
            }
          })
        })
      },
      unsubscribeLog() {
        this.socket.emit('unsubscribe-service-log', this.$route.params['serviceName'])
      },
      onScroll() {
        let logDOM = this.$refs['log']
        this.isLockingToBottom = logDOM.scrollTop + logDOM.clientHeight === logDOM.scrollHeight
      },
      scrollToBottom() {
        this.$nextTick(function () {
          let logDOM = this.$refs['log']
          logDOM.scrollTop = logDOM.scrollHeight - logDOM.clientHeight
        })
      },
    }
  }
</script>

<style scoped>

  ul {
    list-style: none;
  }

  .log {
    font-family: Consolas, Menlo, Courier, monospace;
  }

  .scroll-bottom-btn {
    position: fixed;
    right: 24px;
    bottom: 16px;
    z-index: 999999;
  }

  .line-number-wrapper {
    display: inline-block;
    background: #f0fafe;
    text-align: center;
    position: sticky;
    top: 0;
    left: 0;
    width: 36px;
    z-index: 999;
    padding: 8px 0;
    border-right: 1px solid #eee;
  }

  .line-content-wrapper {
    white-space: nowrap;
    position: absolute;
    left: 36px;
    top: 0;
    padding: 8px 0;
  }

  .line-content {
    padding: 0 8px;
  }

  .line-content:hover {
    background: #f0fafe;
  }
</style>
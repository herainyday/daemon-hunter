<template>
  <div class="app-container">
    <!-- <div class="app-container">
      <el-progress :percentage="percentage"></el-progress>
    </div> -->
    <el-table :key='tableKey' :data="list" v-loading="listLoading" border fit highlight-current-row
      style="width: 100%;min-height:1000px;">
      <el-table-column align="center" :label="$t('metrics.id')" width="65">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" :label="$t('metrics.poolName')">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" :label="$t('metrics.runningNormal')">
        <template slot-scope="scope">
          <el-tag :type="scope.row.normal == scope.row.total ? 'success' : 'danger'"> {{scope.row.normal}} / {{scope.row.total}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" :label="$t('metrics.lostConnection')">
        <template slot-scope="scope">
          <el-tag :type="scope.row.connection == 0 ? 'success' : 'danger'"> {{scope.row.connection}} / {{scope.row.total}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" :label="$t('metrics.powerLoss')">
        <template slot-scope="scope">
          <el-tag :type="scope.row.power == 0 ? 'success' : 'danger'"> {{scope.row.power}} / {{scope.row.total}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" :label="$t('metrics.temperatureAbnormal')">
        <template slot-scope="scope">
          <el-tag :type="scope.row.temperature == 0 ? 'success' : 'danger'"> {{scope.row.temperature}} / {{scope.row.total}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('metrics.operation')" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" @click="goto(scope.row)" size="mini">{{$t('metrics.showDetails')}}</el-button>
          <el-button type="danger" @click="doDelete(scope.row)" size="mini">{{$t('metrics.delete')}}</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { fetchOverview } from '@/api/metrics'
import { deletePool } from '@/api/pools'
import waves from '@/directive/waves' // 水波纹指令

export default {
  name: 'overview',
  directives: {
    waves
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      listLoading: true,
      percentage: 0
    }
  },
  created() {
    var timestamp = this.getTimestamp()
    this.percentage = Math.round(timestamp % 60 / 60 * 100)
    this.getList(Math.round(timestamp / 60) * 60)
    // this.getList(1531374900)
  },
  mounted: function() {
    this.$nextTick(function() {
      setInterval(this.timer, 1000)
    })
  },
  methods: {
    getTimestamp() {
      return Math.round(new Date().getTime() / 1000) - 120
    },
    timer() {
      var current = this.getTimestamp()
      this.percentage = Math.round(current % 60 / 60 * 100)
      if (current % 60 === 0) {
        this.getList(current)
      }
    },
    getList(timestamp) {
      this.listLoading = true
      fetchOverview(timestamp, this.$store.getters.userID).then(response => {
        this.list = []
        if (response.data.error !== undefined) {
          this.listLoading = false
          this.$notify({
            title: this.$t('metrics.fail'),
            message: response.data.error,
            type: 'error',
            duration: 2000
          })
          return
        }

        response.data.pools.forEach(e => {
          this.list.push({
            id: e.id,
            name: e.name,
            owner_id: e.owner_id,
            normal: e.status_0,
            connection: e.status_1,
            temperature: e.status_2,
            power: e.status_3,
            total: e.status_0 + e.status_1 + e.status_2 + e.status_3
          })
        })

        this.list.sort(function(a, b) {
          if (a.connection !== b.connection) {
            return b.connection - a.connection
          }
          if (a.power !== b.power) {
            return b.power - a.power
          }
          if (a.temperature !== b.temperature) {
            return b.temperature - a.temperature
          }
          return a.id - b.id
        })

        this.listLoading = false
      })
    },
    goto(row) {
      this.$router.push({
        path: '/metrics/poolview',
        query: {
          owner_id: row.owner_id,
          pool_id: row.id
        }
      })
    },
    gotoRackWrongView(row) {
      this.$notify({
        title: this.$t('metrics.fail'),
        message: this.$t('metrics.notImplemented'),
        type: 'error',
        duration: 2000
      })
    },
    doDelete(row) {
      this.$confirm(this.$t('pools.deleteMsg')).then(_ => {
        deletePool(row.id, row.owner_id).then(response => {
          this.getList(Math.round(this.getTimestamp() / 60) * 60)
        })
      }).catch(_ => {
        // do nothing
      })
    }
  }
}
</script>

<template>
  <div class="app-container">
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
      <el-table-column width="150px" align="center" :label="$t('metrics.temperatureAbnormal')">
        <template slot-scope="scope">
          <el-tag :type="scope.row.temperature == 0 ? 'success' : 'danger'"> {{scope.row.temperature}} / {{scope.row.total}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" :label="$t('metrics.powerLoss')">
        <template slot-scope="scope">
          <el-tag :type="scope.row.power == 0 ? 'success' : 'danger'"> {{scope.row.power}} / {{scope.row.total}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('metrics.operation')" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" @click="goto(scope.row)" size="mini">{{$t('metrics.showDetails')}}</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { fetchOverview } from '@/api/metrics'
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
      listLoading: true
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchOverview(1531374900, this.$store.getters.userID).then(response => {
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

        this.listLoading = false
      })
    },
    goto(row) {
      this.$router.push({
        name: 'poolview',
        params: {
          owner_id: row.owner_id,
          pool_id: row.id
        }
      })
    }
  }
}
</script>

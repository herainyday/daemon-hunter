<template>
  <div class="app-container">
    <el-table :key='tableKey' :data="list" v-loading="listLoading" border fit highlight-current-row
      style="width: 100%;">
      <el-table-column align="center" :label="$t('pools.id')" width="65px">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" :label="$t('pools.poolName')">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column width="400px" align="center" :label="$t('pools.token')">
        <template slot-scope="scope">
          <span>{{scope.row.token}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" :label="$t('pools.minerCount')">
        <template slot-scope="scope">
          <el-tag :type="scope.row.miner_count == 0 ? 'danger' : 'primary'"> {{scope.row.miner_count}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('pools.operation')" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="success" @click="gotoUpload(scope.row)" size="mini">{{$t('pools.upload')}}</el-button>
          <el-button type="danger" @click="doDelete(scope.row)" size="mini">{{$t('pools.delete')}}</el-button>
          <el-button type="primary" @click="gotoPoolview(scope.row)" size="mini">{{$t('pools.showDetails')}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button type="primary" @click="gotoInit" style="margin:20px;">{{$t('pools.init')}}</el-button>
  </div>
</template>

<script>
import { fetchPools, deletePool } from '@/api/pools'
import waves from '@/directive/waves' // 水波纹指令

export default {
  name: 'farmlist',
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
      fetchPools().then(response => {
        this.list = []
        if (response.data.error !== undefined) {
          this.listLoading = false
          this.$notify({
            title: this.$t('pools.fail'),
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
            token: e.token,
            miner_count: e.miner_count
          })
        })

        this.listLoading = false
      })
    },
    gotoPoolview(row) {
      this.$router.push({
        path: '/metrics/poolview',
        query: {
          owner_id: row.owner_id,
          pool_id: row.id
        }
      })
    },
    gotoUpload(row) {
      this.$router.push({
        path: '/pools/uploadminer',
        query: {
          owner_id: row.owner_id,
          pool_id: row.id,
          pool_name: row.name
        }
      })
    },
    gotoInit() {
      this.$router.push({
        path: '/pools/initfarm'
      })
    },
    doDelete(row) {
      this.$confirm(this.$t('pools.deleteMsg')).then(_ => {
        deletePool(row.id, row.owner_id).then(response => {
          this.getList()
        })
      }).catch(_ => {
        // do nothing
      })
    }
  }
}
</script>

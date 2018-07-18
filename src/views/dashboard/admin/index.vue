<template>
  <div class="dashboard-editor-container">
    <panel-group @handleSetLineChartData="handleSetLineChartData" :panel-data="selectedPanelData"></panel-group>

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="seletedChartData"></line-chart>
    </el-row>

    <!-- <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <raddar-chart></raddar-chart>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart></pie-chart>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <bar-chart></bar-chart>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="8">
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}" style="padding-right:8px;margin-bottom:30px;">
        <transaction-table></transaction-table>
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">
        <todo-list></todo-list>
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">
        <box-card></box-card>
      </el-col>
    </el-row> -->

  </div>
</template>


<script>
import GithubCorner from '@/components/GithubCorner'
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import RaddarChart from './components/RaddarChart'
import PieChart from './components/PieChart'
import BarChart from './components/BarChart'
import TransactionTable from './components/TransactionTable'
import TodoList from './components/TodoList'
import BoxCard from './components/BoxCard'
import { fetchOverview, fetchPeriod } from '@/api/metrics'

export default {
  name: 'dashboard-admin',
  components: {
    GithubCorner,
    PanelGroup,
    LineChart,
    RaddarChart,
    PieChart,
    BarChart,
    TransactionTable,
    TodoList,
    BoxCard
  },
  data() {
    return {
      lineChartData: {
        normal: [],
        connection: [],
        temperature: [],
        power: []
      },
      seletedChartData: {},
      selected: 'normal',
      selectedPanelData: {
        normal: '-',
        connection: '-',
        power: '-',
        temperature: '-'
      }
    }
  },
  created() {
    this.selected = 'normal'
    var timestamp = this.getTimestamp()
    this.percentage = Math.round(timestamp % 60 / 60 * 100)
    this.getListPeriod(Math.round(timestamp / 60) * 60)
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
    getListPeriod(timestamp) {
      fetchPeriod(timestamp, this.$store.getters.userID).then(response => {
        if (response.data.error !== undefined) {
          this.$notify({
            title: this.$t('metrics.fail'),
            message: response.data.error,
            type: 'error',
            duration: 2000
          })
          return
        }
        var chartData = {
          normal: [],
          connection: [],
          temperature: [],
          power: []
        }
        response.data.forEach(e => {
          var normalCount = 0
          var connectionCount = 0
          var temperatureCount = 0
          var powerCount = 0
          e.pools.forEach(p => {
            normalCount += p.status_0
            connectionCount += p.status_1
            temperatureCount += p.status_2
            powerCount += p.status_3
          })
          chartData.normal.push({
            actual: normalCount,
            expected: normalCount + connectionCount + temperatureCount + powerCount,
            timestamp: e.time
          })
          chartData.connection.push({
            actual: connectionCount,
            expected: 0,
            timestamp: e.time
          })
          chartData.temperature.push({
            actual: temperatureCount,
            expected: 0,
            timestamp: e.time
          })
          chartData.power.push({
            actual: powerCount,
            expected: 0,
            timestamp: e.time
          })
          this.selectedPanelData = {
            normal: normalCount,
            connection: connectionCount,
            temperature: temperatureCount,
            power: powerCount
          }
        })
        this.lineChartData = chartData
        this.seletedChartData = this.toLineChartData(this.selected)
      })
    },
    getList(timestamp) {
      fetchOverview(timestamp, this.$store.getters.userID).then(response => {
        if (response.data.error !== undefined) {
          this.$notify({
            title: this.$t('metrics.fail'),
            message: response.data.error,
            type: 'error',
            duration: 2000
          })
          return
        }

        var length = this.lineChartData.normal.length
        if (length === 0) {
          return
        }
        if (timestamp <= this.lineChartData.normal[length - 1].timestamp) {
          return
        }
        var chartData = {
          normal: [],
          connection: [],
          temperature: [],
          power: []
        }
        if (length > 6) {
          chartData.normal = this.lineChartData.normal.slice(length - 6)
          chartData.connection = this.lineChartData.connection.slice(length - 6)
          chartData.temperature = this.lineChartData.temperature.slice(length - 6)
          chartData.power = this.lineChartData.power.slice(length - 6)
        }
        var normalCount = 0
        var connectionCount = 0
        var temperatureCount = 0
        var powerCount = 0
        response.data.pools.forEach(e => {
          normalCount += e.status_0
          connectionCount += e.status_1
          temperatureCount += e.status_2
          powerCount += e.status_3
        })
        chartData.normal.push({
          actual: normalCount,
          expected: normalCount + connectionCount + temperatureCount + powerCount,
          timestamp: timestamp
        })
        chartData.connection.push({
          actual: connectionCount,
          expected: 0,
          timestamp: timestamp
        })
        chartData.temperature.push({
          actual: temperatureCount,
          expected: 0,
          timestamp: timestamp
        })
        chartData.power.push({
          actual: powerCount,
          expected: 0,
          timestamp: timestamp
        })
        this.lineChartData = chartData
        this.seletedChartData = this.toLineChartData(this.selected)
        this.selectedPanelData = {
          normal: normalCount,
          connection: connectionCount,
          temperature: temperatureCount,
          power: powerCount
        }
      })
    },
    toLineChartData(type) {
      var result = {
        expectedData: [],
        actualData: [],
        timestamps: []
      }
      this.lineChartData[type].forEach(e => {
        result.expectedData.push(e.expected)
        result.actualData.push(e.actual)
        var time = new Date(e.timestamp * 1000).toLocaleString()
        result.timestamps.push(time)
      })
      return result
    },
    handleSetLineChartData(type) {
      this.selected = type
      this.seletedChartData = this.toLineChartData(type)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}
</style>

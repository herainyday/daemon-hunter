<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item :label="$t('pools.poolName')">
        <el-input v-model="form.name" :disabled="isDisable"></el-input>
      </el-form-item>
      <el-form-item :label="$t('pools.uploadFile')">
        <el-upload
        class="upload-demo"
        :action="url"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        :on-success="handleSuccess"
        multiple
        :limit="1"
        :on-exceed="handleExceed"
        :file-list="form.fileList">
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">不超过500kb</div>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-table :data="ipList" height="250">
            <el-table-column
            prop="id"
            label="ID"
            width="180">
            </el-table-column>
            <el-table-column
            prop="ip"
            label="IP"
            width="180">
            </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit()">{{$t('pools.uploadBtn')}}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { uploadMinerInfo } from '@/api/pools'
export default {
  name: 'uploadminer',
  data() {
    return {
      form: {
        name: '',
        fileList: []
      },
      payload: [],
      ipList: [],
      isDisable: true,
      url: '/site/api/v1.0/pool/uploadFile'
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      if (this.$route.query.owner_id === undefined || this.$route.query.pool_id === undefined || this.$route.query.pool_name === undefined) {
        this.gotoFarmlist()
        return false
      }
      this.form.name = this.$route.query.pool_name
    },
    onSubmit() {
      if (this.form.name === '') {
        this.$notify({
          title: this.$t('pools.fail'),
          message: this.$t('pools.paramMissing'),
          type: 'error',
          duration: 2000
        })
        return false
      }

      uploadMinerInfo(this.$route.query.pool_id, this.$route.query.owner_id, this.payload).then(response => {
        if (response.data.error !== undefined) {
          this.$notify({
            title: this.$t('pools.fail'),
            message: response.data.error,
            type: 'error',
            duration: 2000
          })
          return
        }

        this.$notify({
          title: this.$t('pools.success'),
          message: response.data.error,
          type: 'success',
          duration: 2000
        })

        this.gotoFarmlist()
      })
    },
    gotoFarmlist() {
      this.$router.push({
        path: '/pools/farmlist'
      })
    },
    handleRemove(file, fileList) {
      // do nothing
    },
    handlePreview(file) {
      // do nothing
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove(file, fileList) {
      this.$confirm(`确定移除 ${file.name} ？`).then(_ => {
        this.ipList = []
        this.payload = []
      }).catch(_ => {
        // do nothing
      })
    },
    handleSuccess(response, file, fileList) {
      this.ipList = []
      this.payload = []
      if (response.payload === undefined || response.payload === '') {
        return
      }
      var i = 1
      response.payload.forEach(e => {
        this.ipList.push({
          id: i,
          ip: e.ip
        })
        i++
      })
      this.payload = response.payload
    }
  }
}
</script>


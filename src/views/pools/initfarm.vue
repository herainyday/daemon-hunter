<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item :label="$t('pools.poolName')">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit()">{{$t('pools.init')}}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { initPool } from '@/api/pools'
export default {
  name: 'initfarm',
  data() {
    return {
      form: {
        name: ''
      }
    }
  },
  methods: {
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

      initPool(this.form.name).then(response => {
        console.log(response)
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

        this.$router.push({
          name: 'uploadminer',
          params: {
            owner_id: response.data.owner_id,
            pool_id: response.data.pool_id
          }
        })
      })
    }
  }
}
</script>


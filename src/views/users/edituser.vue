<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item :label="$t('users.oldPassword')">
        <el-input type="password" v-model="form.oldPwd"></el-input>
      </el-form-item>
      <el-form-item :label="$t('users.newPassword')">
        <el-input type="password" v-model="form.newPwd"></el-input>
      </el-form-item>
      <el-form-item :label="$t('users.repeatPassword')">
        <el-input type="password" v-model="form.repeatPwd"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit()">{{$t('users.reset')}}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { resetPassword } from '@/api/login'
export default {
  name: 'edituser',
  data() {
    return {
      form: {
        oldPwd: '',
        newPwd: '',
        repeatPwd: ''
      }
    }
  },
  methods: {
    onSubmit() {
      if (this.form.oldPwd === '' || this.form.newPwd === '' || this.form.repeatPwd) {
        this.$notify({
          title: this.$t('users.fail'),
          message: this.$t('users.paramMissing'),
          type: 'error',
          duration: 2000
        })
        return false
      }

      if (this.form.newPwd === this.form.oldPwd) {
        this.$notify({
          title: this.$t('users.fail'),
          message: this.$t('users.pwdNotChange'),
          type: 'error',
          duration: 2000
        })
        return false
      }

      if (this.form.newPwd !== this.form.repeatPwd) {
        this.$notify({
          title: this.$t('users.fail'),
          message: this.$t('users.pwdNotEqual'),
          type: 'error',
          duration: 2000
        })
        return false
      }

      resetPassword(this.form.oldPwd, this.form.newPwd).then(response => {
        if (response.data.error !== undefined) {
          this.$notify({
            title: this.$t('users.fail'),
            message: response.data.error,
            type: 'error',
            duration: 2000
          })
          return
        }

        this.$notify({
          title: this.$t('users.success'),
          message: response.data.error,
          type: 'success',
          duration: 2000
        })

        this.$router.push({
          path: '/metrics'
        })
      })
    }
  }
}
</script>


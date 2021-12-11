<template>
  <div class="app-container u-center">
    <el-form :model="dialogForm">
      <el-form-item label="用户名" label-width="120px">
        <el-input v-model="username" disabled style="width: 300px" autocomplete="off" />
      </el-form-item>
      <el-form-item label="旧密码" label-width="120px">
        <el-input v-model="dialogForm.oldPassword" style="width: 300px" autocomplete="off" />
      </el-form-item>
      <el-form-item label="新密码" label-width="120px">
        <el-input v-model="dialogForm.newPassword" type="password" style="width: 300px" autocomplete="off" />
      </el-form-item>
      <el-form-item label="重复新密码" label-width="120px">
        <el-input v-model="repeatPwd" style="width: 300px" type="password" autocomplete="off" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submit">修 改</el-button>
    </span>
  </div>
</template>

<script>
import { getUserInfo, changePwd } from '@/api/userCenter'
import store from '@/store'

export default {
  data() {
    return {
      id: this.$store.state.user.id,
      dialogForm: {},
      username: '',
      repeatPwd: ''
    }
  },
  created() {
    this.userInfo()
  },
  methods: {
    async submit() {
      if (this.repeatPwd !== this.dialogForm.newPassword) {
        this.$message.error('两次密码不一样')
        this.dialogForm.newPassword = ''
        this.repeatPwd = ''
        return
      }
      this.dialogForm.id = this.id
      console.log(this.dialogForm)
      const res = await changePwd(this.dialogForm)
      if (res.success) {
        try {
          await this.$confirm(
            '密码已修改成功，请重新登录',
            '系统提示',
            {
              confirmButtonText: '重新登录',
              cancelButtonText: '取消',
              type: 'warning'
            })
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        } catch (e) {
          this.$message.error(e)
        }
      }
    },
    async userInfo() {
      const res = await getUserInfo(this.id)
      this.username = res.data.username
    }
  }
}
</script>

<style scoped>
.u-center {
  margin: 50px 600px;
}
.dialog-footer  {
  margin-left: 345px;
}

el-form-item {
  margin-right: 20px;
}
</style>

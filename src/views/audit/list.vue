<template>
  <div class="app-container">
    <div>
      <el-table
        :data="tableData"
        border
        stripe
        width="100%"
      >
        <el-table-column
          type="index"
          prop="ID"
          label="序号"
          width="80"
        />
        <el-table-column
          prop="teacherName"
          label="教师姓名"
          width="120"
        />
        <el-table-column
          prop="welfareName"
          label="福利名称"
          width="180"
        />
        <el-table-column
          prop="gmtCreate"
          label="申请时间"
          width="300"
        />
        <el-table-column
          prop="gmtModified"
          label="更新时间"
          width="200"
        />
        <el-table-column
          prop="status"
          label="进度"
          width="200"
        >
          <template slot-scope="scope">
            <el-button v-if="scope.row.status === 'applying'" size="mini" type="primary" round>校区负责人审核中</el-button>
            <el-button v-else-if="scope.row.status === 'next'" size="mini" type="warning" round>领导审核中</el-button>
            <el-button v-else-if="scope.row.status === 'rejected'" size="mini" type="danger" round>未通过审核</el-button>
            <el-button v-else-if="scope.row.status === 'resolved'" size="mini" type="success" round>通过</el-button>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="140"
        >
          <template v-if="role === 'LEADER' || role === 'MANAGER'" slot-scope="scope">
            <el-button type="text" size="small" @click="resolvedFun(scope.row)">通过</el-button>
            <el-button type="text" size="small" @click="rejectedFun(scope.row)">拒绝</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

  </div>
</template>
<script>
import { getAllApply, changeStatus } from '@/api/applyWelfare'

export default {
  data() {
    return {
      role: this.$store.state.user.role,
      tableData: []
    }
  },
  created() {
    console.log(this.role)
    this.getAll()
  },
  methods: {
    async getAll() {
      const res = await getAllApply()
      this.tableData = res.data
    },
    async resolvedFun(row) {
      if (this.role === 'MANAGER') {
        const res = await changeStatus(row.id, 'next')
        if (res.success) {
          this.$message({
            type: 'success',
            message: res.message
          })
          await this.getAll()
        }
      }
      if (this.role === 'LEADER') {
        const res = await changeStatus(row.id, 'resolved')
        if (res.success) {
          this.$message({
            type: 'success',
            message: res.message
          })
          await this.getAll()
        }
      }
    },
    rejectedFun(row) {
      this.$confirm('此操作将拒绝福利发放, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 删除
        const that = this
        changeStatus(row.id, 'rejected').then(resp => {
          if (resp.success) {
            this.$message({
              type: 'success',
              message: resp.message
            })
            that.getAll()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style scoped>
el-form-item {
  margin-right: 20px;
}
</style>

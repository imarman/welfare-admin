<template>
  <div class="app-container">
    <el-form ref="queryForm" :inline="true" :model="queryForm" class="demo-form-inline">
      <el-form-item label="福利名称" prop="categoryName">
        <el-input v-model="queryForm.categoryName" placeholder="请输入名称" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
        <el-button @click="resetForm('queryForm')">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-if="isAdmin" type="success" style="margin-left: 100px" @click="addBtn">新增</el-button>
      </el-form-item>
    </el-form>
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
          prop="categoryName"
          label="类别名称"
          width="300"
        />
        <el-table-column
          prop="gmtModified"
          label="更新时间"
          width="300"
        />
        <el-table-column
          prop="gmtCreate"
          label="创建时间"
          width="300"
        />
        <el-table-column
          v-if="isAdmin"
          label="操作"
          width="140"
        >
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="handleClick(scope.row)">编辑</el-button>
            <el-button type="text" size="mini" @click="deleteItem(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="30%"
      center
    >
      <el-form :model="dialogForm">
        <el-form-item v-if="dialogForm.id" label="ID" label-width="120px">
          <el-input v-model="dialogForm.id" disabled style="width: 300px" autocomplete="off" />
        </el-form-item>
        <el-form-item label="教师名称" label-width="120px">
          <el-input v-model="dialogForm.categoryName" style="width: 300px" autocomplete="off" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>

import { getAll, save, deleteById } from '@/api/welfareCategory'

export default {
  data() {
    return {
      isAdmin: this.$store.state.user.role.split(',').indexOf('ADMIN' +
        '') !== -1,
      title: '修改福利类别信息',
      dialogVisible: false,
      queryForm: {
        categoryName: ''
      },
      tableData: [],
      categoriesList: [],
      dialogForm: {}
    }
  },
  created() {
    this.getAllCategories()
  },
  methods: {
    async getAllCategories() {
      const response = await getAll(this.queryForm)
      this.categoriesList = response.data
      this.tableData = this.categoriesList
    },
    search() {
      this.getAllCategories()
    },
    handleClick(row) {
      this.title = '修改福利类别信息'
      this.dialogForm = { ...row }
      this.dialogVisible = true
    },
    deleteItem(row) {
      this.$confirm('此操作将永久删除【' + row.categoryName + '】的信息吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 删除
        const that = this
        deleteById(row.id).then(resp => {
          if (resp.success) {
            this.$message({
              type: 'success',
              message: resp.message
            })
            that.getAllCategories()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    async submit() {
      const res = await save(this.dialogForm)
      if (res.success) {
        await this.getAllCategories()
        this.dialogVisible = false
        this.resetDialogForm()
        this.$message({
          type: 'success',
          message: '操作成功'
        })
      }
    },
    addBtn() {
      this.title = '新增福利类别'
      this.resetDialogForm()
      this.dialogVisible = true
    },
    resetDialogForm() {
      this.dialogForm = { }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.getAllCategories()
    }
  }
}
</script>

<style scoped>

el-form-item {
  margin-right: 20px;
}
</style>

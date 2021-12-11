<template>
  <div class="app-container">
    <el-form ref="queryForm" :inline="true" :model="queryForm" class="demo-form-inline">
      <el-form-item label="福利" prop="name">
        <el-input v-model="queryForm.name" placeholder="请输入名称" clearable />
      </el-form-item>
      <el-form-item label="福利类别" prop="categoryId">
        <el-select v-model="queryForm.categoryId" placeholder="请选择福利类别" clearable>
          <el-option v-for="category in categoryList" :key="category.id" :label="category.categoryName" :value="category.id" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
        <el-button @click="resetForm('queryForm')">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="success" style="margin-left: 100px" @click="addBtn">新增</el-button>
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
        >
          <template slot-scope="scope">
            <span>{{ (current - 1) * limit + scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="福利名称"
          width="200"
        />
        <el-table-column
          prop="categoryName"
          label="福利类别"
          width="200"
        >
          <template slot-scope="scope">
            <span style="color: #ee4c4c">{{ scope.row.categoryName }}</span>
          </template>
        </el-table-column>
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
        <el-form-item label="福利名称" label-width="120px">
          <el-input v-model="dialogForm.name" style="width: 300px" autocomplete="off" />
        </el-form-item>
        <el-form-item label="福利类别" label-width="120px">
          <el-select v-model="dialogForm.categoryId" placeholder="请选择类别" clearable>
            <el-option v-for="item in categoryList" :key="item.id" :label="item.categoryName" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">保 存</el-button>
      </span>
    </el-dialog>

    <el-pagination
      style="margin-top: 20px"
      :current-page.sync="current"
      :page-size="pages"
      :page-sizes="[5, 10, 20, 50]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      :hide-on-single-page="hidePage"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      />

    </el-pagination></div>
</template>
<script>

import { getWelfareListByPage, save, deleteById } from '@/api/welfare'
import { getAll } from '@/api/welfareCategory'

export default {
  data() {
    return {
      isManager: this.$store.state.user.role.split(',').indexOf('MANAGER' +
        '') !== -1,
      title: '修改福利信息',
      dialogVisible: false,
      hidePage: false,
      current: 1,
      limit: 10,
      total: 10,
      pages: 10,
      queryForm: {
        name: '',
        categoryId: ''
      },
      tableData: [],
      dialogForm: {},
      categoryList: []
    }
  },

  created() {
    this.getAllCampus()
    this.getAllCategories()
  },
  methods: {
    async getAllCategories() {
      const resp = await getAll()
      this.categoryList = resp.data
    },
    handleSizeChange(val) {
      this.limit = val
      this.getAllCampus()
    },
    handleCurrentChange(val) {
      this.current = val
      this.getAllCampus()
    },
    async getAllCampus() {
      const response = await getWelfareListByPage(this.current, this.limit, this.queryForm)
      this.tableData = response.data.welfareList
      this.total = Number(response.data.total)
      if (this.pages <= 1 && this.total <= 5) {
        this.hidePage = true
      }
    },
    search() {
      this.queryForm.current = this.current
      this.queryForm.limit = this.limit
      this.getAllCampus()
    },
    handleClick(row) {
      this.title = '修改福利信息'
      this.dialogForm = { ...row }
      this.dialogVisible = true
    },
    deleteItem(row) {
      this.$confirm('此操作将永久删除【' + row.name + '】的信息吗, 是否继续?', '提示', {
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
            that.getAllCampus()
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
        await this.getAllCampus()
        this.dialogVisible = false
        this.resetDialogForm()
        this.$message({
          type: 'success',
          message: '操作成功'
        })
      }
    },
    addBtn() {
      this.title = '新增福利'
      this.resetDialogForm()
      this.dialogVisible = true
    },
    resetDialogForm() {
      this.dialogForm = {}
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.getAllCampus()
    }
  }
}
</script>

<style scoped>
el-form-item {
  margin-right: 20px;
}
</style>

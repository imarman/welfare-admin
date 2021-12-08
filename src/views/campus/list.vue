<template>
  <div class="app-container">
    <el-form ref="queryForm" :inline="true" :model="queryForm" class="demo-form-inline">
      <el-form-item label="校区名称" prop="name">
        <el-input v-model="queryForm.name" placeholder="请输入名称" clearable />
      </el-form-item>
      <el-form-item label="负责人" prop="manager">
        <el-select v-model="queryForm.manager" placeholder="请选择负责人" clearable>
          <el-option v-for="manager in managerList" :key="manager.id" :label="manager.username" :value="manager.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="建造时间" prop="timeRange">
        <div class="block">
          <el-date-picker
            v-model="timeRange"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </div>
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
          label="姓名"
          width="120"
        />
        <el-table-column
          prop="manager"
          label="负责人"
          width="180"
        >
          <template slot-scope="scope">
            <el-button v-if="scope.row.managerName" size="mini" type="danger" round>{{ scope.row.managerName }}</el-button>
            <el-button v-if="!scope.row.managerName" size="mini" type="default" round>暂未负责人</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="address"
          label="地址"
          width="300"
        />
        <el-table-column
          prop="buildTime"
          label="建造时间"
          width="200"
        />
        <el-table-column
          prop="gmtModify"
          label="更新时间"
          width="200"
        />
        <el-table-column
          prop="gmtCreate"
          label="创建时间"
          width="200"
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
        <el-form-item label="校区名称" label-width="120px">
          <el-input v-model="dialogForm.name" style="width: 300px" autocomplete="off" />
        </el-form-item>
        <el-form-item label="负责人" label-width="120px">
          <el-select v-model="dialogForm.manager" placeholder="请选择负责人" clearable>
            <el-option v-for="item in avoidManagerList" :key="item.id" :label="item.username" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="建造时间" label-width="120px">
          <div class="block">
            <el-date-picker
              v-model="dialogForm.buildTime"
              type="date"
              placeholder="选择日期"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd HH:mm:ss"
            />
          </div>
        </el-form-item>
        <el-form-item label="地址" label-width="120px">
          <el-input v-model="dialogForm.address" style="width: 300px" autocomplete="off" />
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

import { getCampusListByPage, save, deleteById } from '@/api/campus'
import { allManagers, avoidManager } from '@/api/manager'

export default {
  data() {
    return {
      timeRange: [],
      isManager: this.$store.state.user.role.split(',').indexOf('MANAGER' +
        '') !== -1,
      title: '修改校区信息',
      imageUrl: '',
      dialogVisible: false,
      hidePage: false,
      current: 1,
      limit: 10,
      total: 10,
      pages: 10,
      queryForm: {
        name: '',
        manager: '',
        timeRange: []
      },
      tableData: [],
      dialogForm: {},
      managerList: [],
      avoidManagerList: []
    }
  },

  created() {
    this.getAllCampus()
    this.getAllManager()
  },
  methods: {
    async getAllManager() {
      const resp = await allManagers()
      this.managerList = resp.data
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
      const response = await getCampusListByPage(this.current, this.limit, this.queryForm)
      this.tableData = response.data.campusList
      this.tableData.forEach(item => {
        this.managerList.forEach(i => {
          if (i.id === item.manager) {
            item['managerName'] = i.username
          }
        })
      })
      this.total = Number(response.data.total)
      if (this.pages <= 1 && this.total <= 5) {
        this.hidePage = true
      }
    },
    search() {
      this.queryForm.timeRange = this.timeRange.join(',')
      this.queryForm.current = this.current
      this.queryForm.limit = this.limit
      this.getAllCampus()
    },
    async getAllAvoidManager(manager) {
      const resp = await avoidManager(manager)
      this.avoidManagerList = resp.data
    },
    handleClick(row) {
      this.title = '修改校区信息'
      this.dialogForm = { ...row }
      this.dialogVisible = true
      console.log(this.dialogForm)
      this.getAllAvoidManager(this.dialogForm.manager)
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
      this.title = '新增校区'
      this.resetDialogForm()
      this.dialogVisible = true
      this.getAllAvoidManager()
    },
    resetDialogForm() {
      this.dialogForm = {}
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.timeRange = []
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

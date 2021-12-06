<template>
  <div class="app-container">
    <el-form ref="queryForm" :inline="true" :model="queryForm" class="demo-form-inline">
      <el-form-item label="名称" prop="name">
        <el-input v-model="queryForm.name" placeholder="请输入姓名" clearable />
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
        >
          <template slot-scope="scope">
            <span>{{ (current - 1) * limit + scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="username"
          label="姓名"
          width="120"
        />
        <!--        <el-table-column-->
        <!--          prop="gender"-->
        <!--          label="性别"-->
        <!--          width="120"-->
        <!--        />-->
        <el-table-column
          prop="manageCampus"
          label="学院"
          width="300"
        >
          <template slot-scope="scope">
            <el-button v-if="scope.row.manageCampus" size="mini" type="info" round>{{ scope.row.manageCampus }}</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="手机号"
          width="120"
        />
        <el-table-column
          prop="email"
          label="邮箱"
          width="120"
        />
        <el-table-column
          prop="gmtModified"
          label="更新时间"
          width="200"
        />
        <el-table-column
          prop="gmtCreate"
          label="创建时间"
          width="200"
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
        <el-form-item label="名称" label-width="120px">
          <el-input v-model="dialogForm.username" style="width: 300px" autocomplete="off" />
        </el-form-item>
        <el-form-item label="头像" label-width="120px">
          <el-upload
            class="avatar-uploader"
            action="http://localhost:8090/api/upload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" alt="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item v-if="!dialogForm.id" label="初始密码" label-width="120px">
          <el-input v-model="dialogForm.password" style="width: 300px" autocomplete="off" />
        </el-form-item>
        <el-form-item v-if="dialogForm.id" label="管理校区" label-width="120px">
          <el-input v-model="dialogForm.manageCampus" disabled style="width: 300px" autocomplete="off" />
        </el-form-item>
        <el-form-item label="手机号" label-width="120px">
          <el-input v-model="dialogForm.mobile" type="number" style="width: 300px" autocomplete="off" />
        </el-form-item>
        <el-form-item label="邮箱" label-width="120px">
          <el-input v-model="dialogForm.email" style="width: 300px" autocomplete="off" />
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
import { getAll, deleteById, save } from '@/api/manager'

export default {
  name: 'TeacherList',
  data() {
    return {
      isAdmin: this.$store.state.user.role.split(',').indexOf('ADMIN' +
        '') !== -1,
      title: '修改管理者信息',
      imageUrl: '',
      dialogVisible: false,
      hidePage: false,
      current: 1,
      limit: 10,
      total: 10,
      pages: 10,
      queryForm: {
        name: ''
      },
      tableData: [],
      dialogForm: {}
    }
  },
  created() {
    this.getAllManager()
  },
  methods: {
    handleSizeChange(val) {
      this.limit = val
      this.getAllManager()
    },
    handleCurrentChange(val) {
      this.current = val
      this.getAllManager()
    },
    async getAllManager() {
      const response = await getAll(this.current, this.limit, this.queryForm.name)
      this.tableData = response.data.managerList
      this.total = Number(response.data.total)
      if (this.pages <= 1 && this.total <= 5) {
        this.hidePage = true
      }
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
      this.dialogForm.avatar = res.data.picUrl
    },
    beforeAvatarUpload(file) {
      const testMsg = file.name.substring(file.name.lastIndexOf('.') + 1)
      const extension =
        testMsg === 'jpg' ||
        testMsg === 'JPG' ||
        testMsg === 'png' ||
        testMsg === 'PNG'
      if (!extension) {
        this.$message({
          message: '上传图片只能是jpg / png 格式!',
          type: 'error'
        })
        return false // 必须加上return false; 才能阻止
      }
      const isLt2M = file.size / 1024 / 1024 < 20
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isLt2M
    },
    search() {
      this.getAllManager()
    },
    handleClick(row) {
      this.title = '修改管理者信息'
      this.dialogForm = { ...row }
      this.imageUrl = this.dialogForm.avatar
      this.dialogVisible = true
    },
    deleteItem(row) {
      this.$confirm('此操作将永久删除【' + row.username + '】的信息吗, 是否继续?', '提示', {
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
            that.getAllManager()
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
        await this.getAllManager()
        this.dialogVisible = false
        this.resetDialogForm()
        this.$message({
          type: 'success',
          message: '操作成功'
        })
      }
    },
    addBtn() {
      this.title = '新增管理人员'
      this.resetDialogForm()
      this.dialogVisible = true
    },
    resetDialogForm() {
      this.imageUrl = ''
      this.dialogForm = { }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.getAllManager()
    }
  }
}
</script>

<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.avatar-uploader-icon {
  border: 1px dashed #d9d9d9;
}
.avatar-uploader-icon:hover {
  border-color: #409EFF;
}
el-form-item {
  margin-right: 20px;
}
</style>

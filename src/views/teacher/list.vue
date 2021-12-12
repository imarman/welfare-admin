<template>
  <div class="app-container">
    <el-form ref="queryForm" :inline="true" :model="queryForm" class="demo-form-inline">
      <el-form-item label="教师名称" prop="name">
        <el-input v-model="queryForm.name" placeholder="请输入姓名" clearable />
      </el-form-item>
      <el-form-item label="职称" prop="level">
        <el-select v-model="queryForm.level" placeholder="请选择职称" clearable>
          <el-option label="高级教师" value="1" />
          <el-option label="中级教师" value="2" />
          <el-option label="初级教师" value="3" />
        </el-select>
      </el-form-item>
      <el-form-item label="所在校区" prop="campus">
        <el-select v-model="queryForm.campus" placeholder="请选择校区" clearable>
          <el-option v-for="item in campusList" :key="item.id" :label="item.name" :value="item.id" />
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
          label="姓名"
          width="120"
        />
        <el-table-column
          prop="gender"
          label="性别"
          width="120"
        />
        <el-table-column
          prop="campusName"
          label="所在校区"
          width="120"
        />
        <el-table-column
          prop="college"
          label="学院"
          width="300"
        />
        <el-table-column
          prop="degree"
          label="最高学历"
          width="120"
        />
        <el-table-column
          prop="level"
          label="等级"
          width="120"
        >
          <template slot-scope="scope">
            <el-button v-if="scope.row.level === '1'" size="mini" type="info" round>高级教师</el-button>
            <el-button v-if="scope.row.level === '2'" size="mini" type="info" round>中级教师</el-button>
            <el-button v-if="scope.row.level === '3'" size="mini" type="info" round>初级教师</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="手机号"
          width="120"
        />
        <el-table-column
          prop="address"
          label="地址"
          width="300"
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
          label="操作"
          width="200"
        >
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="openWelfareDialog(scope.row)">发放福利</el-button>
            <el-button type="text" size="small" @click="handleClick(scope.row)">编辑</el-button>
            <el-button type="text" size="mini" @click="deleteItem(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      title="申请福利"
      :visible.sync="welfareDialogVisible"
      width="30%"
      center
    >
      <el-form :model="welfareForm">
        <el-form-item label="教师名称" label-width="120px">
          <el-input v-model="welfareForm.teacherName" disabled style="width: 300px" autocomplete="off" />
        </el-form-item>
        <el-form-item label="福利选项" label-width="120px">
          <el-select v-model="welfareForm.welfareId" placeholder="请选择福利" clearable>
            <el-option v-for="item in welfareList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="welfareDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sendWelfare">保 存</el-button>
      </span>
    </el-dialog>

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
          <el-input v-model="dialogForm.name" style="width: 300px" autocomplete="off" />
        </el-form-item>
        <el-form-item label="教师头像" label-width="120px">
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
        <el-form-item label="校区" label-width="120px">
          <el-select v-model="dialogForm.campus" placeholder="请选择校区" clearable>
            <el-option v-for="item in campusList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="性别" label-width="120px">
          <el-radio v-model="dialogForm.gender" label="男">男</el-radio>
          <el-radio v-model="dialogForm.gender" label="女">女</el-radio>
        </el-form-item>
        <el-form-item label="学院" label-width="120px">
          <el-input v-model="dialogForm.college" style="width: 300px" autocomplete="off" />
        </el-form-item>
        <el-form-item label="学历" label-width="120px">
          <el-input v-model="dialogForm.degree" style="width: 300px" autocomplete="off" />
        </el-form-item>
        <el-form-item label="职级" label-width="120px">
          <el-select v-model="dialogForm.level" placeholder="请选择职称" clearable>
            <el-option label="高级教师" value="1" />
            <el-option label="中级教师" value="2" />
            <el-option label="初级教师" value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="手机号" label-width="120px">
          <el-input v-model="dialogForm.mobile" type="number" style="width: 300px" autocomplete="off" />
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
import { getAll, deleteById, save } from '@/api/teacher'
import { getCampusList } from '@/api/campus'
import { allWelfare } from '@/api/welfare'
import { saveWelfare } from '@/api/applyWelfare'

export default {
  name: 'TeacherList',
  data() {
    return {
      welfareForm: {},
      isManager: this.$store.state.user.role.split(',').indexOf('MANAGER' +
        '') !== -1,
      title: '修改教师信息',
      imageUrl: '',
      dialogVisible: false,
      welfareDialogVisible: false,
      hidePage: false,
      current: 1,
      limit: 10,
      total: 10,
      pages: 10,
      queryForm: {
        name: '',
        level: '',
        campus: ''
      },
      tableData: [],
      campusList: [],
      welfareList: [],
      dialogForm: {
        gender: '男'
      }
    }
  },
  created() {
    this.getAllCampus()
    this.getAllTeacher()
  },
  methods: {
    sendWelfare() {
      const temp = this.welfareList.filter(item => item.id === this.welfareForm.welfareId)
      this.welfareForm.welfareName = temp[0].name
      console.log(this.welfareForm)
      saveWelfare(this.welfareForm).then(resp => {
        if (resp.success) {
          this.$message.success(resp.message)
        }
      })
    },
    openWelfareDialog(row) {
      this.getAllWelfare()
      this.welfareDialogVisible = true
      this.welfareForm.teacherName = row.name
      this.welfareForm.teacherId = row.id
    },
    async getAllWelfare() {
      const res = await allWelfare()
      this.welfareList = res.data
    },
    handleSizeChange(val) {
      this.limit = val
      this.getAllTeacher()
    },
    handleCurrentChange(val) {
      this.current = val
      this.getAllTeacher()
    },
    async getAllCampus() {
      const response = await getCampusList()
      this.campusList = response.data
    },
    async getAllTeacher() {
      const response = await getAll(this.current, this.limit, this.queryForm)
      this.tableData = response.data.teacherList
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
      this.getAllTeacher()
    },
    handleClick(row) {
      this.title = '修改教师信息'
      this.dialogForm = { ...row }
      this.imageUrl = this.dialogForm.avatar
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
            that.getAllTeacher()
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
      const campus = this.campusList.find(item => {
        return this.dialogForm.campus === item.id
      })
      this.dialogForm.campusName = campus.name
      const res = await save(this.dialogForm)
      if (res.success) {
        await this.getAllTeacher()
        this.dialogVisible = false
        this.resetDialogForm()
        this.$message({
          type: 'success',
          message: '操作成功'
        })
      }
    },
    addBtn() {
      this.title = '新增教师'
      this.resetDialogForm()
      this.dialogVisible = true
    },
    resetDialogForm() {
      this.imageUrl = ''
      this.dialogForm = { gender: '男' }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.getAllTeacher()
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

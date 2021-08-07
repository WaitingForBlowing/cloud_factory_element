<template>
  <div class="container">
    <div class="header">
      <!--面包屑导航-->
      <el-breadcrumb
          separator-class="el-icon-arrow-right"
          class="bread-crumb">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>系统设置</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      </el-breadcrumb>

      <span class="user-manage-title">用户管理</span>
    </div>
    <div class="main">
      <el-card class="box-card">
        <el-form class="query-form" :model="queryInfo.query" :inline="true" size="small" ref="queryForm">
          <el-form-item class="left" label="账号" prop="account">
            <el-input v-model="queryInfo.query.account"></el-input>
          </el-form-item>
          <el-form-item label="名字" prop="name">
            <el-input v-model="queryInfo.query.name"></el-input>
          </el-form-item>
          <el-form-item label="角色" prop="roleName">
            <el-input v-model="queryInfo.query.roleName"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="tel">
            <el-input v-model="queryInfo.query.tel"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="mail">
            <el-input v-model="queryInfo.query.mail"></el-input>
          </el-form-item>
          <el-form-item class="submit-btn">
            <el-button type="primary" @click="getUserList()">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button @click="resetForm()">重置</el-button>
          </el-form-item>
        </el-form>
        <el-button class="new-btn" type="primary" size="small" icon="el-icon-plus" @click="addDialogVisible = true">新增
        </el-button>
        <!--表格区域-->
        <el-table
            :data="userList"
            stripe
            border
            fit
            highlight-current-row
        >
          <el-table-column
              type="index"
              width="50"
              align="center"
              :resizable="false"/>
          <el-table-column
              prop="account"
              label="用户名"
              width="260"
              :resizable="false"/>
          <el-table-column
              prop="name"
              label="名字"
              width="260"
              :resizable="false"/>
          <el-table-column
              prop="roleName"
              label="角色"
              width="260"
              :resizable="false"/>
          <el-table-column
              prop="tel"
              label="手机号"
              width="260"
              :resizable="false"/>
          <el-table-column
              prop="mail"
              label="邮箱"
              width="260"
              :resizable="false"/>
          <el-table-column
              label="操作"
              :resizable="false">
            <template slot-scope="scope">
              <!-- 修改 -->
              <el-button type="primary" size="mini" icon="el-icon-edit"
                         @click="showEditDialog(scope.row.id)"></el-button>
              <!-- 删除 -->
              <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeUser(scope.row.id)"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pageNumber"
            :page-sizes="[1, 2, 5, 10]"
            :page-size="queryInfo.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
      </el-card>
      <!--添加用户对话框-->
      <el-dialog
          title="添加用户"
          :visible.sync="addDialogVisible"
          :close-on-click-modal="false"
          @close="addDialogClosed">
        <el-form class="add-form" :model="formData" :rules="formRules" ref="addForm">
          <el-form-item prop="account">
            <el-input v-model="formData.account" placeholder="请输入账号"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="formData.password" placeholder="请输入密码" type="password" show-password></el-input>
          </el-form-item>
          <el-form-item prop="name">
            <el-input v-model="formData.name" placeholder="请输入真实姓名"></el-input>
          </el-form-item>
          <el-form-item prop="tel">
            <el-input v-model="formData.tel" placeholder="请输入电话号码" type="tel"></el-input>
          </el-form-item>
          <el-form-item prop="mail">
            <el-input v-model="formData.mail" placeholder="请输入邮箱"></el-input>
          </el-form-item>
          <el-form-item>
            <el-select v-model="formData.type" placeholder="请选择您注册的用户类型" @change="typeChange">
              <el-option label="云工厂管理员" value="0"></el-option>
              <el-option label="经销商" value="1"></el-option>
            </el-select>
          </el-form-item>
          <div class="consignee" v-if="account_type === '0'">
            <el-form-item prop="factoryName">
              <el-input v-model="formData.factoryName" placeholder="请输入工厂名称"/>
            </el-form-item>
            <el-form-item prop="factoryDesc">
              <el-input v-model="formData.factoryDesc" placeholder="请输入工厂简介" type="textarea"/>
            </el-form-item>
          </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser('addForm')">确 定</el-button>
        </div>
      </el-dialog>
      <!--修改用户对话框-->
      <el-dialog
          title="修改用户"
          :visible.sync="editDialogVisible"
          :close-on-click-modal="false"
      >
        <el-form
            :model="editForm"
            :rules="editFormRules"
            label-width="70px"
            ref="editFormRef">
          <el-form-item label="用户名">
            <el-input v-model="editForm.account"></el-input>
          </el-form-item>
          <el-form-item label="名字">
            <el-input v-model="editForm.name"></el-input>
          </el-form-item>
          <el-form-item label="角色" prop="mobile">
            <el-input v-model="editForm.roleName" disabled></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="email">
            <el-input v-model="editForm.tel"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.mail"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUser">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {getList, addUser, removeUserById, selectUserById, updateUserById} from "@/api/user";
import QS from "qs";

export default {
  name: "User",
  data() {
    return {
      queryInfo: {
        query: {
          account: '',
          name: '',
          mail: '',
          tel: '',
          roleName: ''
        },
        pageNumber: 1,
        pageSize: 5
      },
      formData: {
        account: '',
        password: '',
        name: '',
        tel: '',
        mail: '',
        type: '',
        address: '',
        factoryName: '',
        factoryDesc: ''
      },
      formRules: {
        account: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 5,
            max: 15,
            message: '长度在 5 到 15 个字符',
            trigger: 'blur'
          }
        ],
        name: [
          {
            required: true,
            message: '请输入真实姓名',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 15,
            message: '长度在 2 到 15 个字符',
            trigger: 'blur'
          }
        ],
        tel: [
          {
            pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
            required: true,
            message: '请输入正确的手机号',
            trigger: 'blur'
          }
        ],
        mail: [
          {
            type: 'email',
            required: true,
            message: '请输入正确的邮箱',
            trigger: 'blur'
          }
        ]
      },
      editForm: {},
      editFormRules: {
        email: [
          {
            type: 'email',
            message: '请输入正确的邮箱',
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
            message: '请输入正确的手机号',
            trigger: 'blur'
          }
        ]
      },
      userList: [],
      account_type: 0,
      total: 0,
      addDialogVisible: false,
      editDialogVisible: false
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const {data} = await getList(this.queryInfo)
      console.log(data)
      this.userList = data.records
      this.total = data.total
    },
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize
      this.getUserList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pageNumber = newPage
      this.getUserList()
    },
    resetForm() {
      this.$refs['queryForm'].resetFields()
      this.getUserList()
    },
    addDialogClosed() {
      this.$refs.addForm.resetFields()
      this.formData.type = '';
    },
    typeChange(checkData) {
      this.account_type = checkData
    },
    addUser(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const {code, message} = await addUser(QS.stringify(this.formData))
          if (code !== 200) {
            this.$notify.error({
              title: '错误',
              message: message
            })
          } else {
            this.$notify.success({
              title: '成功',
              message: message,
            })
          }
          await this.getUserList()
          this.addDialogVisible = false
        } else {
          return false
        }
      })
    },
    // 删除用户
    async removeUser(id) {
      // 询问用户弹窗
      const result = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        showCancelButton: true
      }).catch(err => err)
      if (result === 'confirm') {
        const {
          code
        } = await removeUserById(id)
        await this.getUserList()
        if (code === 200) {
          this.$notify.success({
            title: '成功',
            message: '删除成功'
          })
        } else {
          this.$notify.error({
            title: '失败',
            message: '删除失败'
          })
        }
      } else if (result === 'cancel') {
        this.$notify.info({
          title: '提示',
          message: '已经取消删除'
        })
      }
    },
    // 展示修改用户对话框
    async showEditDialog(id) {
      this.editDialogVisible = true
      const {
        data,
        code
      } = await selectUserById(id)
      console.log(code, data)
      if (code !== 200) {
        this.$notify.error({
          title: '失败',
          message: '请求错误'
        })
      } else {
        this.editForm = data
      }
    },
    // 修改用户
    editUser() {
      this.$refs.editFormRef.validate(async valid => {
        if (valid) {
          let data = {
            id: this.editForm.id,
            account: this.editForm.account,
            name: this.editForm.name,
            mail: this.editForm.mail,
            tel: this.editForm.tel,
            roleName: this.editForm.roleName
          }
          const {
            code
          } = await updateUserById(QS.stringify(data))
          if (code !== 200) {
            this.$notify.error({
              title: '失败',
              message: '错误'
            })
          } else {
            this.$notify.success({
              title: '成功',
              message: '修改成功'
            })
            await this.getUserList()
            this.editDialogVisible = false
          }
        } else {
          return false
        }
      })
    },
  }
}
</script>

<style scoped>
.container {
  height: 100%;
}

.header {
  width: 100%;
  height: 90px;
  background-color: #fff;
  margin-top: 2px;
  padding: 12px 24px 16px 24px;
  box-shadow: 0 1px 4px #00152914;
}

.header .bread-crumb {
  font-size: 14px;
  font-family: Avenir, 'Helvetica Neue', Arial, Helvetica, sans-serif;
  height: 21px;
  line-height: 21px;
}

.header .user-manage-title {
  display: block;
  float: left;
  font-size: 20px;
  color: rgba(0, 0, 0, .85);
  font-weight: 600;
  margin-top: 8px;
  line-height: 32px;
}

.main {
  padding: 25px;
  height: 100%;
  width: 100%;
}

.main .box-card {
  box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
  border-radius: 0;
}

.main .box-card .query-form {
  display: flex;
  align-items: center;
}

.main .box-card .new-btn {
  width: 82px;
  text-align: center;
}

.main .box-card .new-btn i {
  font-weight: 900 !important;
  margin-right: 10px !important;
}

.main .box-card .submit-btn {
  margin-left: 35px;
}
</style>

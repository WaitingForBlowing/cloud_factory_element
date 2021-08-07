<template>
  <div class="container">
    <div class="header">
      <!--面包屑导航-->
      <el-breadcrumb
          separator-class="el-icon-arrow-right"
          class="bread-crumb">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>设备管理</el-breadcrumb-item>
        <el-breadcrumb-item>我的设备</el-breadcrumb-item>
      </el-breadcrumb>

      <span class="user-manage-title">我的设备</span>
    </div>
    <div class="main">
      <el-card class="box-card">
        <el-form class="query-form" :model="queryInfo.query" :inline="true" size="small" ref="queryForm">
          <el-form-item class="left" label="产品名称" prop="name">
            <el-input v-model="queryInfo.query.name"></el-input>
          </el-form-item>
          <el-form-item label="类别名称" prop="typeName">
            <el-input v-model="queryInfo.query.typeName"></el-input>
          </el-form-item>
          <el-form-item label="角色" prop="specification">
            <el-input v-model="queryInfo.query.specification"></el-input>
          </el-form-item>
          <el-form-item class="submit-btn">
            <el-button type="primary" @click="getProductList()">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button @click="resetForm()">重置</el-button>
          </el-form-item>
        </el-form>
        <el-button class="new-btn" type="primary" size="small" icon="el-icon-plus" @click="showAddDialog">新增
        </el-button>
        <!--表格区域-->
        <el-table
            :data="productList"
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
              prop="name"
              label="产品名称"
              width="260"
              :resizable="false"/>
          <el-table-column
              prop="typeName"
              label="类别名称"
              width="260"
              :resizable="false"/>
          <el-table-column
              prop="specification"
              label="产品规格"
              width="260"
              :resizable="false"/>
          <el-table-column
              prop="description"
              label="产品描述"
              width="360"
              :resizable="false"/>
          <el-table-column
              label="操作"
              :resizable="false">
            <template slot-scope="scope">
              <!-- 修改 -->
              <el-button type="primary" size="mini" icon="el-icon-edit"
                         @click="showEditDialog(scope.row.id)"></el-button>
              <!-- 删除 -->
              <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeProduct(scope.row.id)"></el-button>
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
      <!--添加对话框-->
      <el-dialog
          title="添加产品"
          :visible.sync="addDialogVisible"
          :close-on-click-modal="false"
          @close="addDialogClosed">
        <el-form class="add-form" :model="formData" :rules="formRules" ref="addForm">
          <el-form-item prop="name">
            <el-input v-model="formData.name" placeholder="请输入产品名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-select v-model="formData.typeName" placeholder="请选择产品类型">
              <el-option v-for="item in this.typeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="specification">
            <el-input v-model="formData.specification" placeholder="请输入产品规格"></el-input>
          </el-form-item>
          <el-form-item prop="description">
            <el-input v-model="formData.description" placeholder="请输入产品描述" type="textarea"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addDialogClosed">取 消</el-button>
          <el-button type="primary" @click="addProduct('addForm')">确 定</el-button>
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
          <el-form-item label="名称" prop="name">
            <el-input v-model="editForm.name"></el-input>
          </el-form-item>
          <el-form-item label="类别">
            <el-select v-model="editForm.typeName">
              <el-option v-for="item in this.typeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="规格" prop="specification">
            <el-input v-model="editForm.specification"></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input v-model="editForm.description"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editProduct">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  getProductList,
  getAll,
  addProduct,
  selectProductById,
  updateProductById,
  removeProductById
} from "@/api/product";
import QS from "qs";

export default {
  name: "Product",
  data() {
    return {
      queryInfo: {
        query: {
          name: '',
          specification: '',
          description: '',
          typeName: ''
        },
        pageNumber: 1,
        pageSize: 5
      },
      formData: {
        name: '',
        specification: '',
        description: '',
        typeName: ''
      },
      formRules: {
        name: [
          {
            required: true,
            message: '产品名称不可为空',
            trigger: 'blur'
          }
        ],
        specification: [
          {
            required: true,
            message: '产品规格不可为空',
            trigger: 'blur'
          }
        ],
        description: [
          {
            required: true,
            message: '产品描述不可为空',
            trigger: 'blur'
          }
        ]
      },
      editForm: {},
      editFormRules: {
        name: [
          {
            required: true,
            message: '产品名称不可为空',
            trigger: 'blur'
          }
        ],
        specification: [
          {
            required: true,
            message: '产品规格不可为空',
            trigger: 'blur'
          }
        ],
        description: [
          {
            required: true,
            message: '产品描述不可为空',
            trigger: 'blur'
          }
        ]
      },
      productList: [],
      typeList: [],
      total: 0,
      addDialogVisible: false,
      editDialogVisible: false
    }
  },
  created() {
    this.getProductList()
  },
  methods: {
    async getProductList() {
      const {data} = await getProductList(this.queryInfo)
      console.log(data)
      this.productList = data.records
      this.total = data.total
    },
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize
      this.getProductList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pageNumber = newPage
      this.getProductList()
    },
    resetForm() {
      this.$refs['queryForm'].resetFields()
      this.getProductList()
    },
    addDialogClosed() {
      this.addDialogVisible = false
      this.$refs.addForm.resetFields()
      this.formData.typeName = ''
    },
    async showAddDialog() {
      this.addDialogVisible = true
      const { data } = await getAll()
      this.typeList = data
    },
    async addProduct(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const {code, message} = await addProduct(QS.stringify(this.formData))
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
          await this.getProductList()
          this.addDialogVisible = false
        } else {
          return false
        }
      })
    },
    // 删除
    async removeProduct(id) {
      // 询问用户弹窗
      const result = await this.$confirm('此操作将永久删除该产品, 是否继续?', '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        showCancelButton: true
      }).catch(err => err)
      if (result === 'confirm') {
        const {
          code
        } = await removeProductById(id)
        await this.getProductList()
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
    // 展示修改对话框
    async showEditDialog(id) {
      console.log(id)
      this.editDialogVisible = true
      const {
        data,
        code
      } = await selectProductById(id)
      const { data: res } = await getAll()
      if (code !== 200) {
        this.$notify.error({
          title: '失败',
          message: '请求错误'
        })
      } else {
        this.typeList = res
        this.editForm = data
      }
    },
    // 修改用户
    editProduct() {
      this.$refs.editFormRef.validate(async valid => {
        if (valid) {
          let data = {
            id: this.editForm.id,
            name: this.editForm.name,
            typeName: this.editForm.typeName,
            specification: this.editForm.specification,
            description: this.editForm.description
          }
          const {
            code
          } = await updateProductById(QS.stringify(data))
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
            await this.getProductList()
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


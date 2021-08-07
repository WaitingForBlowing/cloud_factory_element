<template>
  <div class="container">
    <div class="header">
      <!--面包屑导航-->
      <el-breadcrumb
          separator-class="el-icon-arrow-right"
          class="bread-crumb">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>工厂管理</el-breadcrumb-item>
        <el-breadcrumb-item>工厂信息</el-breadcrumb-item>
      </el-breadcrumb>

      <span class="user-manage-title">工厂信息</span>
    </div>
    <div class="main">
      <el-card class="box-card">
        <el-form class="query-form" :model="queryInfo.query" :inline="true" size="small" ref="queryForm">
          <el-form-item class="left" label="工厂名称" prop="name">
            <el-input v-model="queryInfo.query.name"></el-input>
          </el-form-item>
          <el-form-item label="管理人" prop="managerName">
            <el-input v-model="queryInfo.query.managerName"></el-input>
          </el-form-item>
          <el-form-item label="登录账号" prop="managerAccount">
            <el-input v-model="queryInfo.query.managerAccount"></el-input>
          </el-form-item>
          <el-form-item label="联系方式" prop="managerTel">
            <el-input v-model="queryInfo.query.managerTel"></el-input>
          </el-form-item>
          <el-form-item class="submit-btn">
            <el-button type="primary" @click="getFactoryList()">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button @click="resetForm()">重置</el-button>
          </el-form-item>
        </el-form>
        <!--表格区域-->
        <el-table
            :data="factoryList"
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
              label="工厂名称"
              width="260"
              :resizable="false"/>
          <el-table-column
              prop="desc"
              label="工厂简介"
              width="260"
              :resizable="false"/>
          <el-table-column
              prop="managerName"
              label="负责人"
              width="260"
              :resizable="false"/>
          <el-table-column
              prop="managerTel"
              label="联系方式"
              width="260"
              :resizable="false"/>
          <el-table-column
              prop="managerAccount"
              label="登录账号"
              width="260"
              :resizable="false"/>
          <el-table-column
              prop="status"
              label="工厂状态"
              width="100"
              :resizable="false">
            <template slot-scope="scope">
              <div v-if="scope.row.status === 1">
                <el-tag color="#67c23a8f">运行中</el-tag>
              </div>
              <div v-else-if="scope.row.status === 2">
                <el-tag color="#f5222d8f">已关停</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column
              label="操作"
              :resizable="false">
            <template slot-scope="scope">
              <div v-if="scope.row.status === 1">
                <el-button type="primary" size="mini" @click="changeStatus(scope.row.id)">关停</el-button>
              </div>
              <div v-else-if="scope.row.status === 2">
                <el-button type="success" size="mini" @click="changeStatus(scope.row.id)">开启</el-button>
              </div>
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
    </div>
  </div>
</template>

<script>
import {changeStatus, getFactoryList} from "@/api/factory";

export default {
  name: "FactoryInfo",
  data() {
    return {
      queryInfo: {
        query: {
          name: '',
          desc: '',
          managerName: '',
          managerTel: '',
          managerAccount: '',
          status: ''
        },
        pageNumber: 1,
        pageSize: 5
      },
      factoryList: [],
      total: 0,
    }
  },
  created() {
    this.getFactoryList()
  },
  methods: {
    async getFactoryList() {
      const {data} = await getFactoryList(this.queryInfo)
      console.log(data)
      this.factoryList = data.records
      this.total = data.total
    },
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize
      this.getFactoryList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pageNumber = newPage
      this.getFactoryList()
    },
    resetForm() {
      this.$refs['queryForm'].resetFields()
      this.getFactoryList()
    },
    async changeStatus(id) {
      const { code } = await changeStatus(id)
      if (code === 200) {
        this.$notify({
          type: "success",
          title: "成功",
          message: "操作成功"
        })
        await this.getFactoryList()
      } else {
        this.$notify({
          type: "error",
          title: "错误",
          message: "操作失败"
        })
      }
    }
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


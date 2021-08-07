<template>
  <div class="container">
    <div class="header">
      <!--面包屑导航-->
      <el-breadcrumb
          separator-class="el-icon-arrow-right"
          class="bread-crumb">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
        <el-breadcrumb-item>订单信息</el-breadcrumb-item>
      </el-breadcrumb>

      <span class="user-manage-title">订单信息</span>
    </div>
    <div class="main">
      <el-card class="box-card">
        <el-form class="query-form" :model="queryInfo.query" :inline="true" size="small" ref="queryForm">
          <el-form-item class="left" label="产品名称" prop="productName">
            <el-input v-model="queryInfo.query.productName"></el-input>
          </el-form-item>
          <el-form-item label="下单数量" prop="productAmount">
            <el-input v-model="queryInfo.query.productAmount"></el-input>
          </el-form-item>
          <el-form-item label="交货日期">
            <el-date-picker
                v-model="queryInfo.query.accomplishDeadline"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
                placeholder="选择日期时间"/>
          </el-form-item>
          <el-form-item label="竞标截止">
            <el-date-picker
                v-model="queryInfo.query.tenderDeadline"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
                placeholder="选择日期时间"/>
          </el-form-item>
          <el-form-item label="订单状态">
            <el-select v-model="queryInfo.query.orderStatus" placeholder="请选择订单状态" clearable>
              <el-option label="已发布" :value="2"></el-option>
              <el-option label="投标结束" :value="4"></el-option>
              <el-option label="已排产" :value="5"></el-option>
              <el-option label="已完工" :value="6"></el-option>
              <el-option label="已发货" :value="7"></el-option>
              <el-option label="已收获" :value="8"></el-option>
              <el-option label="已完成" :value="9"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="订单发起">
            <el-input v-model="queryInfo.query.consigneeName"></el-input>
          </el-form-item>
          <el-form-item label="生产工厂">
            <el-input v-model="queryInfo.query.factoryName"></el-input>
          </el-form-item>

          <el-form-item class="submit-btn">
            <el-button type="primary" @click="getOrderList()">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button @click="resetForm()">重置</el-button>
          </el-form-item>
        </el-form>
        <!--表格区域-->
        <el-table
            :data="orderList"
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
              prop="productName"
              label="订单产品"
              width="200"
              :resizable="false"/>
          <el-table-column
              prop="productAmount"
              label="下单数量"
              width="100"
              :resizable="false"/>
          <el-table-column
              prop="accomplishDeadline"
              label="交货日期"
              width="300"
              :resizable="false"/>
          <el-table-column
              prop="tenderDeadline"
              label="竞标截止"
              width="300"
              :resizable="false"/>
          <el-table-column
              prop="orderStatus"
              label="订单状态"
              width="100"
              :resizable="false">
            <template slot-scope="scope">
              <div v-if="scope.row.orderStatus === 2">
                <el-tag color="#96caff">发布成功</el-tag>
              </div>
              <div v-else-if="scope.row.orderStatus === 4">
                <el-tag color="#e6a23c">投标结束</el-tag>
              </div>
              <div v-else-if="scope.row.orderStatus === 5">
                <el-tag color="#f5222d">正在生产</el-tag>
              </div>
              <div v-else-if="scope.row.orderStatus === 6">
                <el-tag color="#c48bea">生产完成</el-tag>
              </div>
              <div v-else-if="scope.row.orderStatus === 7">
                <el-tag color="#F5A623">发货完成</el-tag>
              </div>
              <div v-else-if="scope.row.orderStatus === 8">
                <el-tag color="#67c23a">收货完成</el-tag>
              </div>
              <div v-else-if="scope.row.orderStatus === 9">
                <el-tag color="#909399">订单结束</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column
              prop="consigneeName"
              label="订单发起"
              width="200"
              :resizable="false"/>
          <el-table-column
              prop="consigneeTel"
              label="联系方式"
              :resizable="false"/>
          <el-table-column
              label="操作"
              :resizable="false">
            <template slot-scope="scope">
              <el-button type="primary" @click="addDialogOpen(scope.row.id)">投标</el-button>
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
          title="投标"
          :visible.sync="addDialogVisible"
          :close-on-click-modal="false"
      >
        <el-form class="add-form" :model="formData" :rules="formRules" ref="addForm">
          <el-form-item>
            <el-input v-model="formData.oid" disabled/>
          </el-form-item>
          <el-form-item>
            <el-input v-model="formData.uid" disabled/>
          </el-form-item>
          <el-form-item prop="price">
            <el-input v-model="formData.price" placeholder="请输入竞标价格（单位：元）"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="chooseTender('addForm')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {getOrderWithTenderList} from "@/api/order";
import {chooseTender} from "@/api/tender";
import ls from "@/utils/lsUtil";
import QS from "qs";

export default {
  name: "OrderTender",
  data() {
    return {
      queryInfo: {
        query: {
          productName: '',
          productAmount: '',
          accomplishDeadline: '',
          tenderDeadline: '',
          consigneeName: '',
          factoryName: ''
        },
        pageNumber: 1,
        pageSize: 5
      },
      orderList: [],
      formData: {
        oid: '',
        uid: '',
        price: ''
      },
      formRules: {
        price: [
          {
            required: true,
            message: '金额不可为空',
            trigger: 'blur'
          }
        ],
      },
      total: 0,
      addDialogVisible: false
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    async getOrderList() {
      const {data} = await getOrderWithTenderList(this.queryInfo)
      console.log(data)
      this.orderList = data.records
      this.total = data.total
    },
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize
      this.getOrderList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pageNumber = newPage
      this.getOrderList()
    },
    resetForm() {
      this.$refs['queryForm'].resetFields()
      this.getOrderList()
    },
    addDialogOpen(id) {
      this.formData.oid = id
      this.formData.uid = ls.get_value('USER_ID')
      this.formData.price = 0.0
      this.addDialogVisible = true
    },
    chooseTender(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const {code} = await chooseTender(QS.stringify(this.formData))
          if (code === 200) {
            this.$notify.success({
              title: '成功',
              message: '选标成功'
            })
            await this.getOrderList()
            this.addDialogVisible = false
          } else {
            this.$notify.error({
              title: '错误',
              message: '系统错误，暂时无法选标'
            })
          }
        }
      })
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
  flex-wrap: wrap;
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
  margin-left: 66px;
}
</style>




<template>
  <div class="container">
    <div class="header">
      <!--面包屑导航-->
      <el-breadcrumb
          separator-class="el-icon-arrow-right"
          class="bread-crumb">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
        <el-breadcrumb-item>订单排产</el-breadcrumb-item>
      </el-breadcrumb>

      <span class="user-manage-title">订单排产</span>
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
              width="150"
              :resizable="false"/>
          <el-table-column
              prop="productAmount"
              label="下单数量"
              width="100"
              :resizable="false"/>
          <el-table-column
              prop="accomplishDeadline"
              label="交货日期"
              width="200"
              :resizable="false"/>
          <el-table-column
              prop="tenderDeadline"
              label="竞标截止"
              width="200"
              :resizable="false"/>
          <el-table-column
              prop="consigneeName"
              label="订单发起人"
              width="200"
              :resizable="false"/>
          <el-table-column
              prop="consigneeTel"
              label="联系方式"
              width="200"
              :resizable="false"/>
          <el-table-column
              prop="consigneeName"
              label="发货地址"
              width="200"
              :resizable="false"/>
          <el-table-column
              prop="orderStatus"
              label="订单状态"
              width="100"
              :resizable="false">
            <template slot-scope="scope">
              <div v-if="scope.row.orderStatus === 4">
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
              label="操作"
              :resizable="false">
            <template slot-scope="scope">
              <div v-if="scope.row.orderStatus === 4">
                <el-button type="primary" size="mini" @click="arrangeOrderDialogShow(scope.row.id)">排产</el-button>
              </div>
              <div v-else-if="scope.row.orderStatus === 5">
                <el-button type="primary" size="mini" @click="endProduce(scope.row.id)">完工</el-button>
              </div>
              <div v-else-if="scope.row.orderStatus === 6">
                <el-button type="primary" size="mini" @click="deliver(scope.row.id)">发货</el-button>
              </div>
              <div v-else-if="scope.row.orderStatus === 8">
                <el-button type="primary" size="mini" @click="accomplishOrder(scope.row.id)">完成</el-button>
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
      <el-dialog
          title="排产"
          :visible.sync="planDialogVisible"
          @close="arrangeOrderDialogClose"
      >
        <el-form :model="schedulingFormData" :inline="true" size="small" ref="schedulingForm"
                 :rules="schedulingFormRules">
          <el-form-item label="设备名称" prop="equipmentName">
            <el-select v-model="schedulingFormData.equipmentName" placeholder="请选择排产设备">
              <el-option v-for="item in equipmentList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="开始时间" prop="start">
            <el-date-picker
                v-model="schedulingFormData.start"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
                placeholder="选择日期时间"/>
          </el-form-item>
          <el-form-item label="结束时间" prop="end">
            <el-date-picker
                v-model="schedulingFormData.end"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
                placeholder="选择日期时间"/>
          </el-form-item>
          <el-form-item class="submit-btn">
            <el-button type="primary" @click="addScheduling()">新增</el-button>
          </el-form-item>
        </el-form>
        <el-table
            :data="schedulingList"
            stripe
            border
            fit
            highlight-current-row
        >
          <el-table-column type="index" width="50" align="center" :resizable="false"></el-table-column>
          <el-table-column property="equipmentName" label="设备名称" width="150" :resizable="false"/>
          <el-table-column property="start" label="开始时间" width="300" :resizable="false"/>
          <el-table-column property="end" label="结束时间" width="300" :resizable="false"/>
          <el-table-column label="操作" :resizable="false">
            <template>
              <el-button type="primary">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {accomplish, deliver, endProduce, getWinOrderList} from "@/api/order";
import ls from "@/utils/lsUtil";
// import {getSchedulingList} from "@/api/plan";
import {getEquipmentList} from "@/api/equipment";
import {addScheduling, getSchedulingList} from "@/api/plan";
import QS from "qs";

export default {
  name: "OrderInfo",
  data() {
    return {
      queryInfo: {
        query: {
          id: '',
          productName: '',
          productAmount: '',
          accomplishDeadline: '',
          tenderDeadline: '',
          consigneeName: '',
          consigneeTel: '',
          consigneeAddress: '',
        },
        pageNumber: 1,
        pageSize: 5
      },
      orderList: [],
      schedulingFormData: {
        id: '',
        equipmentName: '',
        start: '',
        end: ''
      },
      schedulingFormRules: {
        equipmentName: [
          {
            required: true,
            message: '设备不可为空',
            trigger: 'blur'
          }
        ],
        start: [
          {
            required: true,
            message: '开始时间不可为空',
            trigger: 'blur'
          }
        ],
        end: [
          {
            required: true,
            message: '结束时间不可为空',
            trigger: 'blur'
          }
        ]
      },
      schedulingList: [],
      equipmentList: [],
      total: 0,
      planDialogVisible: false,
      currentOrderId: ''
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    async getOrderList() {
      this.queryInfo.query.id = ls.get_value('USER_ID')
      const {data} = await getWinOrderList(this.queryInfo)
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
    async arrangeOrderDialogShow(id) {
      this.planDialogVisible = true
      this.currentOrderId = id
      let userId = ls.get_value('USER_ID')
      const {data} = await getEquipmentList(userId)
      this.equipmentList = data
    },
    arrangeOrderDialogClose() {
      this.planDialogVisible = false
      this.currentOrderId = ''
      this.getOrderList()
    },
    addScheduling() {
      this.schedulingFormData.id = this.currentOrderId
      this.$refs['schedulingForm'].validate(async valid => {
        if (valid) {
          const {code} = await addScheduling(QS.stringify(this.schedulingFormData))
          if (code === 200) {
            this.$notify.success({
              title: '成功',
              message: '添加成功'
            })
            const {data} = await getSchedulingList(this.currentOrderId)
            this.schedulingList = data
            const {data: el} = await getEquipmentList(ls.get_value('USER_ID'))
            this.equipmentList = el
            this.schedulingFormData.equipmentName = ''
            this.schedulingFormData.start = ''
            this.schedulingFormData.end = ''
          } else {
            this.$notify.error({
              title: '错误',
              message: '请稍后再试'
            })
          }
        } else {
          return false;
        }
      })

    },
    async endProduce(id) {
      const {code} = await endProduce(id)
      if (code === 200) {
        this.$notify.success({
          title: '成功',
          message: '确认完成'
        })
        await this.getOrderList()
      } else {
        this.$notify.error({
          title: '错误',
          message: '操作失败，请稍后再试'
        })
      }
    },
    async deliver(id) {
      const {code} = await deliver(id)
      if (code === 200) {
        this.$notify.success({
          title: '成功',
          message: '发货完成'
        })
        await this.getOrderList()
      } else {
        this.$notify.error({
          title: '错误',
          message: '发货失败，请稍后再试'
        })
      }
    },
    async accomplishOrder(id) {
      const {code} = await accomplish(id)
      if (code === 200) {
        this.$notify.success({
          title: '成功',
          message: '订单结束'
        })
        await this.getOrderList()
      } else {
        this.$notify.error({
          title: '错误',
          message: '操作失败，请稍后再试'
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



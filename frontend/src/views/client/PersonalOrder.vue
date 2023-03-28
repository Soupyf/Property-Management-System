<template>
  <div class="personalOrder">
    <div class="orderQuery">
      <el-form :model="queryForm" ref="queryForm" :inline="true">
        <el-form-item prop="uuid">
          <el-input prefix-icon="el-icon-search" placeholder="订单号" v-model="queryForm.uuid" clearable>
          </el-input>
        </el-form-item>
        <el-form-item prop="keyword">
          <el-input prefix-icon="el-icon-search" placeholder="门店/地址" v-model="queryForm.keyword" clearable>
          </el-input>
        </el-form-item>
        <el-button type="primary" @click="conditionQuery">查询</el-button>
      </el-form>
    </div>

    <div class="orderTable">
      <el-table :data="tableData" border style="width: 100%"
        :header-cell-style="{ background: '#00abbe', color: '#fff', 'text-align': 'center' }" highlight-current-row>
        <el-table-column fixed prop="uuid" label="订单号"></el-table-column>
        <el-table-column prop="hotelName" label="门店"></el-table-column>
        <el-table-column prop="hotelAddress" label="门店地址"></el-table-column>
        <el-table-column prop="produceTime" label="下单时间"></el-table-column>
        <el-table-column prop="reserveCheckInTime" label="入住时间"></el-table-column>
        <el-table-column prop="reserveCheckOutTime" label="退房时间"></el-table-column>
        <el-table-column prop="roomType" label="房型"></el-table-column>
        <el-table-column prop="guestRoomID" label="房间号"></el-table-column>
        <el-table-column prop="price" label="实际付款"></el-table-column>
        <el-table-column prop="state" label="订单状态"></el-table-column>

      </el-table>
      <!--分页-->
      <el-pagination v-model:page-size="pageSize" background @size-change="handleSizeChange"
        @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-sizes="[2, 4, 6, 8]"
        layout="prev, pager, next, sizes, total, jumper" :total="total" />
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs";
export default {
  data() {
    return {
      account: this.$store.getters.getUser.id,
      //分页
      currentPage: 1,
      total: 10,//数据一共多少
      pageSize: 2,//每页显示的行数,默认为2
      //查询
      queryForm: {
        uuid: "",
        keyword: ""
      },
      queryOrNot: false,
      tableData: [],
    }
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
      this.handleCurrentChange(1);//默认更改每页多少条后重新加载第一页
    },

    handleCurrentChange() {
      if (this.queryOrNot === false) {
        this.getAllAPI(this.pageSize, this.currentPage)
      } else {
        if (this.queryForm.uuid === "" && this.queryForm.keyword !== "") {
          this.conditionQueryAPI(this.currentPage, "%", this.queryForm.keyword)
        } else if (this.queryForm.uuid !== "" && this.queryForm.keyword === "") {
          this.conditionQueryAPI(this.currentPage, this.queryForm.uuid, "%")
        } else {
          this.conditionQueryAPI(this.currentPage, this.queryForm.uuid, this.queryForm.keyword)
        }
      }
    },

    conditionQuery() {
      this.queryOrNot = true;
      if (this.queryForm.uuid === "" && this.queryForm.keyword === "") {
        this.getAllAPI(this.pageSize, 1)
        this.queryOrNot = false
      } else if (this.queryForm.uuid === "" && this.queryForm.keyword !== "") {
        this.conditionQueryAPI(1, "%", this.queryForm.keyword)
      } else if (this.queryForm.uuid !== "" && this.queryForm.keyword === "") {
        this.conditionQueryAPI(1, this.queryForm.uuid, "%")
      } else {
        this.conditionQueryAPI(1, this.queryForm.uuid, this.queryForm.keyword)
      }
      this.currentPage = 1
    },

    conditionQueryAPI(current, uuid, key) {
      const _this = this
      this.$api.orderApi.GetOrdersNumByConditionWithAccount(this.account, uuid, key, "100")
        .then(res => {
          if (res.data.code == 9000) {
            this.$message({
              message: res.data.message,
              type: "error"
            });
          } else if (res.data == 0) {
            _this.tableData = []
          } else {
            _this.total = res.data
            _this.$api.orderApi.GetOrdersByConditionWithAccount(_this.pageSize, current, _this.account, uuid, key, "100")
              .then(res => {
                _this.tableData = res.data
                for (let i = 0; i < _this.tableData.length; i++) {
                  _this.tableData[i].produceTime = dayjs(_this.tableData[i].produceTime).format("YYYY-MM-DD HH:mm:ss")
                  _this.tableData[i].reserveCheckInTime = dayjs(_this.tableData[i].reserveCheckInTime).format("YYYY-MM-DD HH:mm:ss")
                  _this.tableData[i].reserveCheckOutTime = dayjs(_this.tableData[i].reserveCheckOutTime).format("YYYY-MM-DD HH:mm:ss")
                  _this.tableData[i].price = _this.tableData[i].price / 100
                }
              }).catch(err => {
                console.log(err);
              });
          }
        }).catch(err => {
          console.log(err);
        });
    },

    getAllAPI(size, current) {
      const _this = this
      this.$api.orderApi.getOrderByUserAccountCount(this.account)
        .then(res => {
          _this.total = res.data
        }).catch(err => {
          console.log(err);
        });
      this.$api.orderApi.getOrderByUserAccount(size, current, this.account)
        .then(res => {
          _this.tableData = res.data
          for (let i = 0; i < _this.tableData.length; i++) {
            _this.tableData[i].produceTime = dayjs(_this.tableData[i].produceTime).format("YYYY-MM-DD HH:mm:ss")
            _this.tableData[i].reserveCheckInTime = dayjs(_this.tableData[i].reserveCheckInTime).format("YYYY-MM-DD HH:mm:ss")
            _this.tableData[i].reserveCheckOutTime = dayjs(_this.tableData[i].reserveCheckOutTime).format("YYYY-MM-DD HH:mm:ss")
            _this.tableData[i].price = _this.tableData[i].price / 100
          }
        }).catch(err => {
          console.log(err);
        });
    },

  },
  mounted() {
    // 初始时表格展示的数据
    this.getAllAPI(2, 1)
  },
}
</script>

<style scoped>
.orderTable {
  margin: auto;
  margin-top: 30px;
  width: 80%;
}

.orderQuery {
  text-align: right;
  margin: 10px 25px;
}
</style>
<!-- YUKI: edit12/17 -->
<!-- TableSelected不能传空值！！！ -->
<template>
  <div class="roomSelect">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item v-for="item in $route.meta">
          {{ item }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="selectBox">
      <el-form :model="Form" :inline="true">
        <el-form-item label="价格上限">
          <el-input placeholder="请选择可接受的最高价格" v-model="Form.maxCost" clearable>
          </el-input>
        </el-form-item>
        <el-form-item label="入住时间">
          <el-date-picker v-model="Form.startTime" type="datetime" placeholder="请选择您的入住时间" format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss" clearable>
          </el-date-picker>
        </el-form-item>
        <el-form-item label="退房时间" v>
          <el-date-picker v-model="Form.endTime" type="datetime" placeholder="请选择您的退房时间" format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss" clearable>
          </el-date-picker>
        </el-form-item>
        <el-button type="primary" @click="conditionQuery()">查询</el-button>
      </el-form>
    </div>


    <div class="roomTable">
      <el-table :data="tableData" border style="width: 100%"
        :header-cell-style="{ background: '#00abbe', color: '#fff', 'text-align': 'center' }" highlight-current-row>
        <el-table-column align="center" fixed prop="id" label="房间号码"></el-table-column>
        <el-table-column align="center" fixed prop="title" label="标题"></el-table-column>
        <el-table-column align="center" fixed prop="address" label="地址"></el-table-column>
        <el-table-column align="center" fixed prop="guestRoomType" label="客房类型"></el-table-column>
        <el-table-column align="center" fixed prop="price" label="价格">

        </el-table-column>
        <el-table-column align="center" fixed="right" label="操作" width="200">
          <template slot-scope="scope">

            <el-button @click="routeToNewPage(scope.row)" type="primary" size="small">查看详情</el-button>
          </template>
        </el-table-column>

      </el-table>
      <!--分页-->
      <el-pagination v-model:page-size="pageSize" background @size-change="handleSizeChange"
        @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-sizes="[2, 4, 6, 8]"
        layout="prev, pager, next, sizes, total, jumper" :total="total" />
      <el-button type="primary" @click="backToHotelInfo()">返 回</el-button>
    </div>
    <flatmap></flatmap>
  </div>
</template>

<script>
import flatmap from './MapSelect.vue'
export default {
  components: {
    flatmap
  },
  methods: {
    backToHotelInfo() {
      this.$router.push({ name: "clientHotelInfo", params: { hotelName: this.hotelName, hotelId: this.companyGroupId, hotelAddress: this.hotelAddress } });
    },
    routeToNewPage(row) {
      const roomID = row.id
      this.$router.push({
        name: "clientRoomReserve", params: {
          roomID: roomID,
          companyGroupId: this.companyGroupId, hotelName: this.hotelName
          , price: row.price, startTime: this.Form.startTime.toString(), endTime: this.Form.endTime.toString(),
          hotelAddres: this.hotelAddress
        }
      });
    },
    handleSizeChange(val) {
      // 更改每页多少条数据
      this.pageSize = val;
      this.handleCurrentChange();//默认更改每页多少条后重新加载第一页
    },
    handleCurrentChange() {
      if (this.Form.startTime == "" && this.Form.endTime == "") {
        this.getHotelRoom(this.pageSize, this.currentPage)
      } else {
        this.conditionQuery()
      }
    },
    conditionQuery() {
      if (this.Form.startTime == "" && this.Form.endTime == "") {
        this.getHotelRoom(this.pageSize, this.currentPage)
      } else {
        const _this = this
        var Form = _this.Form
        Form.maxCost = parseInt(Form.maxCost)
        this.$api.clientApi.queryRoomConditionalCount(_this.companyGroupId, _this.hotelName,
          Form.maxCost * 100, Form.startTime, Form.endTime)
          .then(res => {
            _this.total = res.data
            _this.$api.clientApi.queryRoomConditional(_this.companyGroupId, _this.hotelName,
              Form.maxCost * 100, Form.startTime, Form.endTime, _this.pageSize, _this.currentPage)
              .then(resp => {
                console.log(resp)
                _this.tableData = resp.data
                for (let i = 0; i < _this.tableData.length; i++) {
                  _this.tableData[i].guestRoomType = _this.roomType[_this.tableData[i].guestRoomType]
                  _this.tableData[i].price = _this.tableData[i].price / 100
                }
                _this.currentPage = 1
              }).catch(err => {
                console.log(err)
              })
          }).catch(err => {
            console.log(err)
          })
      }
    },
    getHotelRoom(size, current) {
      const _this = this
      this.$api.adminApi.adminGetCountConditional(this.companyGroupId, this.hotelName)
        .then(res => {
          _this.total = res.data
        }).catch(err => {
          console.log(err)
        })
      this.$api.adminApi.adminGetRoomsByCondition(size, current, this.companyGroupId, this.hotelName)
        .then(res => {
          console.log(res)
          _this.tableData = res.data
          console.log(_this.tableData)
          for (let i = 0; i < _this.tableData.length; i++) {
            _this.tableData[i].guestRoomType = _this.roomType[_this.tableData[i].guestRoomType]
            _this.tableData[i].price = _this.tableData[i].price / 100
          }
        }).catch(err => {
          console.log(err)
        })
    }
  },
  data() {
    return {
      companyGroupId: this.$route.params.hotelId,
      hotelName: this.$route.params.hotelName,
      hotelAddress: this.$route.params.hotelAddress,
      Form: {
        maxCost: 1000000,
        startTime: "",
        endTime: "",
      },
      roomType: ["BarrierFree无障碍", "Single单人间", "Double双人间", "Triple三人间", "Quadruple四人套房", "Deluxe豪华套房"],
      currentPage: 1,
      queryCurrentPage: 1,
      total: 10,//数据一共多少
      pageSize: 2,//每页显示的行数,默认为2
      tableData: [],
    }
  },
  mounted() {
    // 初始时表格展示的数据
    this.getHotelRoom(2, 1)
  }
}
</script>

<style scoped>
.breadcrumb {
  float: left;
  margin-left: 25px;
}

.selectBox {
  text-align: right;
  margin: 10px 25px;
}

.roomTable {
  margin: auto;
  margin-top: 20px;
  width: 70%;
}
</style>
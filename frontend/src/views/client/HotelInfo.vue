<template>
  <div class="HotelInfo">
    <div class="header">
      <div class="breadcrumb">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item v-for="item in $route.meta">
            {{ item }}
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="homeHeader">
        <el-form :model="queryForm" ref="queryForm" :inline="true">
          <el-form-item label="城市" prop="citySelected">
            <el-select class="selectCity" placeholder="请选择城市" v-model="queryForm.citySelected"
              value="queryForm.citySelected" clearable>
              <el-option label="北京" value="北京" />
              <el-option label="上海" value="上海" />
              <el-option label="广州" value="广州" />
              <el-option label="深圳" value="深圳" />
            </el-select>
          </el-form-item>

          <el-form-item label="关键词" prop="keyword">
            <el-input class="inputBox" placeholder="酒店名/位置" v-model="queryForm.keyword" clearable>
            </el-input>
          </el-form-item>

          <el-button type="primary" @click="conditionQuery">查询</el-button>
        </el-form>
      </div>
    </div>
    <div class="bookTable">
      <el-table :data="tableData" border style="width: 100%"
        :header-cell-style="{ background: '#00abbe', color: '#fff', 'text-align': 'center' }" highlight-current-row>

        <el-table-column fixed prop="hotelName" label="名称">
        </el-table-column>
        <el-table-column prop="companyName" label="集团">
        </el-table-column>
        <el-table-column prop="city" label="城市">
        </el-table-column>
        <el-table-column prop="hotelAddress" label="地址">
        </el-table-column>
        <el-table-column prop="contactList" label="前台电话">
        </el-table-column>
        <el-table-column align="center" fixed="right" label="操作" width="150px">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small">查看详情</el-button>
            <el-button @click="handleSubscribe(scope.row)" type="text" size="small">订阅</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:page-size="pageSize" background @size-change="handleSizeChange"
        @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-sizes="[2, 4, 6, 8]"
        layout="prev, pager, next, sizes, total, jumper" :total="total" />

    </div>
  </div>
</template>

<script>
export default {
  methods: {
    handleSubscribe(row) {
      ////订阅某酒店
      const _this = this
      this.$api.clientApi.subscribeHotel(this.$store.getters.getUser.id, row.hotelName)
        .then(res => {
          console.log(res)
          if (res.data.code === 10000) {
            this.$message({
              showClose: true,
              message: res.data.message,
              type: "error"
            });
          } else if (res.data.code === 10002) {
            this.$message({
              showClose: true,
              message: res.data.message,
              type: "error"
            });
          } else {
            this.$message({
              showClose: true,
              message: '您已成功订阅酒店' + row.hotelName,
              type: 'success'
            });
          }
        }).catch(err => {
          console.log(err);
        });

    },
    handleClick(row) {
      console.log(row);
      // 去某个酒店,每个酒店地址不同
      this.$router.push({ name: "clientTableSelect", params: { hotelName: row.hotelName, hotelId: row.hotelId, hotelAddress: row.hotelAddress } });
      // 另一个页面在methods中获得参数：var x=this.$route.query.hotelName;
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.handleCurrentChange(1);//默认更改每页多少条后重新加载第一页
    },

    handleCurrentChange() {
      if (this.queryOrNot === false) {
        this.getAllAPI(this.pageSize, this.currentPage)
      } else {
        if (this.queryForm.citySelected === "" && this.queryForm.keyword !== "") {
          this.conditionQueryAPI(this.currentPage, "%", this.queryForm.keyword)
        } else if (this.queryForm.citySelected !== "" && this.queryForm.keyword === "") {
          this.conditionQueryAPI(this.currentPage, this.queryForm.citySelected, "%")
        } else {
          this.conditionQueryAPI(this.currentPage, this.queryForm.citySelected, this.queryForm.keyword)
        }
      }
    },

    conditionQuery() {
      this.queryOrNot = true;
      if (this.queryForm.citySelected === "" && this.queryForm.keyword === "") {
        this.getAllAPI(this.pageSize, 1)
        this.queryOrNot = false
      } else if (this.queryForm.citySelected === "" && this.queryForm.keyword !== "") {
        this.conditionQueryAPI(1, "%", this.queryForm.keyword)
      } else if (this.queryForm.citySelected !== "" && this.queryForm.keyword === "") {
        this.conditionQueryAPI(1, this.queryForm.citySelected, "%")
      } else {
        this.conditionQueryAPI(1, this.queryForm.citySelected, this.queryForm.keyword)
      }
      this.currentPage = 1
    },

    conditionQueryAPI(current, city, key) {
      const _this = this
      this.$api.clientApi.getHotelConditionCount(city, key)
        .then(res => {
          console.log(res)
          _this.total = res.data
        }).catch(err => {
          console.log(err);
        });
      this.$api.clientApi.getHotelConditional(this.pageSize, current, city, key)
        .then(res => {
          _this.tableData = res.data
          for (let i = 0; i < _this.tableData.length; i++) {
            _this.tableData[i].contactList = _this.tableData[i].contactList.join()
          }
        }).catch(err => {
          console.log(err);
        });
    },
    getAllAPI(size, current) {
      const _this = this
      this.$api.clientApi.getHotelAllCount()
        .then(res => {
          _this.total = res.data
        }).catch(err => {
          console.log(err);
        });
      this.$api.clientApi.getHotelAll(size, current)
        .then(res => {
          _this.tableData = res.data
          for (let i = 0; i < _this.tableData.length; i++) {
            _this.tableData[i].contactList = _this.tableData[i].contactList.join()
          }
        }).catch(err => {
          console.log(err);
        });
    }
  },

  data() {
    return {
      queryForm: {
        citySelected: "",
        keyword: ""
      },
      currentPage: 1,
      total: 10,//数据一共多少
      pageSize: 2,//每页显示的行数,默认为2
      tableData: [],
      queryOrNot: false,
    }
  },
  mounted() {
    this.getAllAPI(2, 1)
  },
}

</script>
<style scoped>
.breadcrumb {
  float: left;
  margin-left: 25px;
}

.homeHeader {
  text-align: right;
  margin: 10px 25px;
}

.bookTable {
  margin: auto;
  margin-top: 20px;
  width: 70%;
}
</style>

<!-- 对于前端来说，钩子函数就是指再所有函数执行前，我先执行了的函数，即钩住 我感兴趣的函数，只要它执行，我就先执行。 -->
<template>
  <div class="roomEdit">
    <!-- YUKI: add new room, expect to fill a form which will check simple grammar -->
    <div class="selectBox">
      <el-form :model="priceStatusQuery" :inline="true">
        <el-form-item label="价格上限">
          <el-input placeholder="请筛选价格上限" v-model="priceStatusQuery.price" clearable>
          </el-input>
        </el-form-item>
        <el-form-item label="房间状态">
          <el-select v-model="priceStatusQuery.roomStatus" placeholder="请筛选房间状态" clearable>
            <el-option label="All" value="7"></el-option>
            <el-option label="Free" value="0"></el-option>
            <el-option label="Reserved" value="1"></el-option>
            <el-option label="CheckIn" value="2"></el-option>
            <el-option label="LeftNeedClean" value="3"></el-option>
            <el-option label="NotOpen" value="4"></el-option>
            <el-option label="OnCleaning" value="5"></el-option>
            <el-option label="WaitChecking" value="6"></el-option>
          </el-select>
        </el-form-item>
        <el-button type="primary" @click="conditionalQuery(); checkOrNot = true">查询</el-button>
      </el-form>
    </div>


    <div class="roomTable">
      <el-table :data="tableData" border style="width: 100%"
        :header-cell-style="{ background: '#00abbe', color: '#fff', 'text-align': 'center' }" highlight-current-row>
        <el-table-column fixed prop="id" label="房间号码"></el-table-column>
        <el-table-column prop="address" label="地址"></el-table-column>

        <el-table-column key="1" label="房间标题" v-if="editOrNot">
          <template v-slot="scope">
            <el-input placeholder="请输入标题" size="mini" v-model="scope.row.title" v-if="editOrNot"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="房间标题" v-if="!editOrNot"></el-table-column>

        <el-table-column label="房间类型" v-if="editOrNot">
          <template v-slot="scope">
            <el-select size="mini" v-model="scope.row.guestRoomType" placeholder="请选择房间类型" v-if="editOrNot">
              <el-option v-for="item in roomType" :key="item" :label="item" :value="item">
              </el-option>
            </el-select>
          </template>
        </el-table-column>

        <el-table-column prop="guestRoomType" label="房间类型" v-if="!editOrNot"></el-table-column>


        <el-table-column label="房间状态" v-if="editOrNot">
          <template v-slot="scope">
            <el-select size="mini" v-model="scope.row.roomStatus" placeholder="请选择房间状态" v-if="editOrNot">
              <el-option v-for="item in roomStatus" :key="item" :label="item" :value="item">
              </el-option>
            </el-select>
          </template>
        </el-table-column>

        <el-table-column prop="roomStatus" label="房间状态" v-if="!editOrNot"></el-table-column>



        <el-table-column label="价格" v-if="editOrNot">
          <template v-slot="scope">
            <el-input placeholder="请输入价格" size="mini" v-model="scope.row.price" v-if="editOrNot"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="价格" v-if="!editOrNot"></el-table-column>

        <el-table-column label="房间面积" v-if="editOrNot">
          <template v-slot="scope">
            <el-input placeholder="请输入面积" size="mini" v-model="scope.row.area" v-if="editOrNot"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="area" label="房间面积" v-if="!editOrNot"></el-table-column>

        <el-table-column label="床数" v-if="editOrNot">
          <template v-slot="scope">
            <el-input placeholder="请输入床数" size="mini" v-model="scope.row.bedCount" v-if="editOrNot"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="bedCount" label="床数" v-if="!editOrNot"></el-table-column>

        <el-table-column label="窗户数" v-if="editOrNot">
          <template v-slot="scope">
            <el-input placeholder="请输入窗户数" size="mini" v-model="scope.row.windowCount" v-if="editOrNot"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="windowCount" label="窗户数" v-if="!editOrNot"></el-table-column>

        <el-table-column label="矿泉水数" v-if="editOrNot">
          <template v-slot="scope">
            <el-input placeholder="请输入矿泉水数" size="mini" v-model="scope.row.mineralWaterCount"
              v-if="editOrNot"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="mineralWaterCount" label="矿泉水数" v-if="!editOrNot"></el-table-column>


        <el-table-column align="center" fixed="right" label="操作" width="200">
          <template slot-scope="scope">
            <el-button @click="handleEdit()" v-show="!editOrNot" type="success" size="small">编辑</el-button>
            <el-button @click="warn(scope.$index, tableData)" v-show="!editOrNot" type="danger"
              size="small">删除</el-button>
            <el-button @click="handleSave(scope.$index, tableData)" v-show="editOrNot" type="success" plain
              size="small">保存</el-button>
            <el-button @click="handleCancel()" v-show="editOrNot" type="primary" plain size="small">取消</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination v-model:page-size="pageSize" background @size-change="handleSizeChange"
        @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-sizes="[2, 4, 6, 8]"
        layout="prev, pager, next, sizes, total, jumper" :total="total" />
      <el-button type="success" @click="openForm()">增加新房间</el-button>
      <el-button type="primary" @click="backToHotelInfo()">返 回</el-button>
    </div>


    <div class="form">
      <el-dialog title="添加新房间" :visible.sync="addOrNot" width="35%">
        <el-form :model="form">
          <el-form-item label="门店地址" :label-width="formLabelWidth">
            <el-input v-model="form.Address" autocomplete="off" :disabled="true"></el-input>
          </el-form-item>

          <el-form-item label="房间类型" :label-width="formLabelWidth">
            <el-select v-model="form.GuestRoomType" placeholder="请选择房间类型">
              <el-option label="BarrierFree无障碍" value="0" />
              <el-option label="Single单人间" value="1" />
              <el-option label="Double双人间" value="2" />
              <el-option label="Triple三人间" value="3" />
              <el-option label="Quadruple四人套房" value="4" />
              <el-option label="Deluxe豪华套房" value="5" />
            </el-select>
          </el-form-item>

          <el-form-item label="房间状态" :label-width="formLabelWidth">
            <el-select v-model="form.RoomStatus" placeholder="请选择房间状态">
              <el-option label="Free" value="0" />
              <el-option label="Reserved" value="1" />
              <el-option label="CheckIn" value="2" />
              <el-option label="LeftNeedClean" value="3" />
              <el-option label="NotOpen" value="4" />
              <el-option label="OnCleaning" value="5" />
              <el-option label="WaitChecking" value="6" />
            </el-select>
          </el-form-item>


          <el-form-item label="门店ID" :label-width="formLabelWidth">
            <el-input v-model="form.HotelInstanceID" :disabled="true">
            </el-input>
          </el-form-item>

          <el-form-item label="价格" :label-width="formLabelWidth">
            <el-input v-model="form.Price" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="房间标题" :label-width="formLabelWidth">
            <el-input v-model="form.Title" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="房间面积" :label-width="formLabelWidth">
            <el-input v-model="form.Area" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="床数" :label-width="formLabelWidth">
            <el-input v-model="form.BedCount" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="窗户数" :label-width="formLabelWidth">
            <el-input v-model="form.WindowCount" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="预备矿泉水数量" :label-width="formLabelWidth">
            <el-input v-model="form.MineralWaterCount" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeForm()">取 消</el-button>
          <el-button type="primary" @click="addRoom()">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {

  methods: {
    backToHotelInfo() {
      this.$router.push({ name: "adminHotelInfo", params: { hotelName: this.hotelName, hotelId: this.companyGroupId, hotelAddress: this.hotelAddress } });
    },
    conditionalQuery() {
      var page = this.currentPage
      if (this.checkOrNot) {
        page = 1
        this.checkOrNot = false
      }
      if (this.priceStatusQuery.price == "" && this.priceStatusQuery.roomStatus == "") {
        this.getHotelRoom(this.pageSize, 1)
      } else if (this.priceStatusQuery.price == "" && this.priceStatusQuery.roomStatus != "") {
        this.queryAPI(page, -1, this.priceStatusQuery.roomStatus)
      } else if (this.priceStatusQuery.price != "" && this.priceStatusQuery.roomStatus == "") {
        this.queryAPI(page, this.priceStatusQuery.price, -1)
      } else {
        this.queryAPI(page, this.priceStatusQuery.price, this.priceStatusQuery.roomStatus)
      }
    },
    queryAPI(page, price, roomStatus) {
      const _this = this
      this.$api.adminApi.adminPriceStatusSelectCount(_this.companyGroupId, _this.hotelName,
        parseInt(price) * 100, parseInt(roomStatus))
        .then(res => {
          _this.total = res.data
        }).catch(err => {
          console.log(err)
        })
      this.$api.adminApi.adminPriceStatusSelect(_this.companyGroupId, _this.hotelName,
        parseInt(price) * 100, _this.pageSize, page, parseInt(roomStatus))
        .then(res => {
          _this.tableData = res.data
          for (let i = 0; i < _this.tableData.length; i++) {
            _this.tableData[i].guestRoomType = _this.roomType[_this.tableData[i].guestRoomType]
            _this.tableData[i].roomStatus = this.roomStatus[_this.tableData[i].roomStatus]
            _this.tableData[i].price = _this.tableData[i].price / 100
          }
        }).catch(err => {
          console.log(err)
        })
    },
    handleEdit() {
      this.editOrNot = true
      this.tableCopyData = JSON.parse(JSON.stringify(this.tableData))
      //YUKI：进入edit状态
    },
    warn(idx, tableData) {
      this.$confirm('此操作将永久删除该房间, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.handleDelete(idx, tableData)

      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    closeForm() {
      this.addOrNot = false
    },
    addRoom() {
      const _this = this
      var form = this.form
      form.RoomStatus = parseInt(form.RoomStatus)
      form.GuestRoomType = parseInt(form.GuestRoomType)
      form.HotelInstanceID = parseInt(form.HotelInstanceID)
      form.Price = parseInt(form.Price) * 100  //!!!!!!!!!!!!!!!!!!!!!!!!!!
      form.Area = parseInt(form.Area)
      form.BedCount = parseInt(form.BedCount)
      form.WindowCount = parseInt(form.WindowCount)
      form.MineralWaterCount = parseInt(form.MineralWaterCount)
      this.$api.adminApi.adminAddRoom(form.GuestRoomType, 0, form.Address, form.RoomStatus, 0, form.HotelInstanceID, form.Price, form.Title, "",
        form.Area, form.BedCount, form.WindowCount, form.MineralWaterCount, form.CandomCount)
        .then(res => {
          _this.form = _this.copy
          _this.addOrNot = false
          _this.currentPage = 1
          _this.getHotelRoom(_this.pageSize, 1)
        }).catch(err => {
          console.log(err)
          alert("mistakes happen!")
        })
    },
    handleDelete(idx, table) {
      const _this = this
      var row = table[idx]
      var id = row.id
      this.$api.adminApi.adminDeleteRoom(id)
        .then(res => {
          this.$message({
            type: 'success',
            message: '删除成功!'

          });
          this.currentPage = 1
          this.getHotelRoom(this.pageSize, 1)
        }
        ).catch(err => {
          console.log(err)
        })
    },
    handleSave(idx, table) {
      const _this = this
      var row = table[idx]
      // row.roomStatus 是文字 status是数字
      var status = row.roomStatus
      if (status == "Free") status = 0
      else if (status == "Reserved") status = 1
      else if (status == "CheckIn") status = 2
      else if (status == "LeftNeedClean") status = 3
      else if (status == "NotOpen") status = 4
      else if (status == "OnCleaning") status = 5
      else if (status == "WaitChecking") status = 6

      var roomType = row.guestRoomType
      if (roomType == "BarrierFree无障碍") roomType = 0
      else if (roomType == "Single单人间") roomType = 1
      else if (roomType == "Double双人间") roomType = 2
      else if (roomType == "Triple三人间") roomType = 3
      else if (roomType == "Quadruple四人套房") roomType = 4
      else if (roomType == "Deluxe豪华套房") roomType = 5
      this.$api.adminApi.adminModifyRoom(row.id, status, roomType, parseInt(row.price) * 100, row.title,
        parseInt(row.area), parseInt(row.bedCount), parseInt(row.windowCount), parseInt(row.mineralWaterCount))
        .then(res => {
          console.log(res)
        }).catch(err => {
          console.log(err)
        })
      _this.tableData = table
      this.editOrNot = false;
    },

    handleCancel() {
      //刷新
      this.tableData = JSON.parse(JSON.stringify(this.tableCopyData))
      this.editOrNot = false;
    },
    openForm() {
      this.addOrNot = true  //添加新房间
    },
    handleSizeChange(val) {
      // 更改每页多少条数据
      this.pageSize = val;
      this.handleCurrentChange();//默认更改每页多少条后重新加载第一页
    },
    handleCurrentChange() {
      if (this.priceStatusQuery.roomStatus == "" && this.priceStatusQuery.price == "11111111") {
        this.getHotelRoom(this.pageSize, this.currentPage)
      } else {
        this.conditionalQuery()
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
          for (let i = 0; i < _this.tableData.length; i++) {
            _this.tableData[i].guestRoomType = _this.roomType[_this.tableData[i].guestRoomType]
            _this.tableData[i].roomStatus = this.roomStatus[_this.tableData[i].roomStatus]
            _this.tableData[i].price = _this.tableData[i].price / 100
          }
        }).catch(err => {
          console.log(err)
        })
    },
  },
  data() {
    return {
      formLabelWidth: '120px',
      copy: {
        Address: this.$route.params.hotelAddress,
        RoomStatus: '0',//需要转换成int传过去
        GuestRoomType: '0',
        HotelInstanceID: this.$route.params.hotelId,
        Price: 100,
        Title: '',
        Area: 10,
        BedCount: 2,
        WindowCount: 2,
        MineralWaterCount: 2,
        CandomCount: 3
      },
      form: {
        Address: this.$route.params.hotelAddress,
        RoomStatus: '0',//需要转换成int传过去
        GuestRoomType: '0',
        HotelInstanceID: this.$route.params.hotelId,
        Price: 100,
        Title: '',
        Area: 10,
        BedCount: 2,
        WindowCount: 2,
        MineralWaterCount: 2,
        CandomCount: 3
      },
      priceStatusQuery: {
        price: 11111111,
        roomStatus: "",
      },
      addOrNot: false,
      checkOrNot: false,
      editOrNot: false,
      roomStatus: ["Free", "Reserved", "CheckIn", "LeftNeedClean", "NotOpen", "OnCleaning", "WaitChecking"],
      roomType: ["BarrierFree无障碍", "Single单人间", "Double双人间", "Triple三人间", "Quadruple四人套房", "Deluxe豪华套房"],
      currentPage: 1,
      queryCurrentPage: 1,
      total: 10,//数据一共多少
      pageSize: 2,//每页显示的行数,默认为2
      tableData: [],
      tableCopyData: [],
      queryOrNot: false,
      // YUKI:取出url的参数
      companyGroupId: this.$route.params.hotelId,//暂时是hotel Id
      hotelName: this.$route.params.hotelName,
      hotelAddress: this.$route.params.hotelAddress
    }
  },
  created() {
    // 初始时表格展示的数据
    this.getHotelRoom(2, 1)
  }
}
</script>

<style scoped>
.selectBox {
  text-align: right;
  margin: 10px 25px;
}

.roomTable {
  margin: auto;
  margin-top: 30px;
  width: 90%;
}
</style>
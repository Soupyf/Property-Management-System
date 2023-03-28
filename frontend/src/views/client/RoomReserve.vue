<template>
  <div class="roomReserve">
    <el-container>
      <el-aside width="200px"></el-aside>
      <el-main>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item v-for="item in $route.meta">
            {{ item }}
          </el-breadcrumb-item>
        </el-breadcrumb>
        <div class="title">
          请填写订单信息
        </div>

        <div class="roomForm">
          <el-form :model="formTable">

            <el-form-item label="用户账号">
              <el-input v-model="formTable.account">
              </el-input>
            </el-form-item>
            <el-form-item label="房间Id">
              <el-input v-model="formTable.roomId" :disabled="true">
              </el-input>
            </el-form-item>

            <el-form-item label="入住时间">
              <el-date-picker v-model="formTable.ReserveCheckInTime" type="datetime" placeholder="请选择您的入住时间"
                format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="退房时间" v>
              <el-date-picker v-model="formTable.ReserveCheckOutTime" type="datetime" placeholder="请选择您的退房时间"
                format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss">
              </el-date-picker>
            </el-form-item>

            <!-- <el-form-item label="平台编号">
              <el-input v-model="formTable.Platform" :disabled="true">
              </el-input>
            </el-form-item>

            <el-form-item label="平台运单编号">
              <el-input v-model="formTable.PlatOrderNumber">
              </el-input>
            </el-form-item> -->

            <el-form-item label="预订房间数量">
              <el-input v-model="formTable.roomAmount" :disabled="true">
              </el-input>
            </el-form-item>

            <el-form-item label="价格">
              <el-input v-model="formTable.price" autocomplete="off" :disabled="true"></el-input>
            </el-form-item>

            <el-form-item label="总共需要支付金额">
              <el-input v-model="formTable.sum" autocomplete="off" :disabled="true"></el-input>
            </el-form-item>

            <el-form-item label="可用优惠券">
              <el-button @click="drawer = true" type="success" style="margin-left: 16px;">
                查看已有优惠券
              </el-button>

              <el-drawer title="我是标题" :visible.sync="drawer" :with-header="false">
                <div class="coupon" v-for="item in coupons" v-if="item != 0 & sum != 0" >
                  {{ item }}元优惠券
                </div>
                <div class="blank"   style="font-size: large; text-align:center;" v-if="sum == 0">
                  您目前没有可用的优惠券！
                </div>
  
              </el-drawer>
            </el-form-item>
          </el-form>
        </div>
        <div class="btn">
          <el-button v-show="true" @click="backToTableSelect">取 消</el-button>
          <el-button v-show="true" type="primary" @click="addRoom()">确 定</el-button>
        </div>
      </el-main>
      <el-aside width="200px"></el-aside>
    </el-container>
  </div>

</template>

<script>


export default {

  methods: {
    backToTableSelect() {
      this.$router.push({ name: "clientTableSelect", params: { hotelName: this.hotelName, hotelId: this.companyGroupId, hotelAddress: this.hotelAddress } });
    },
    addRoom() {
      const dayjs = require('dayjs')
      this.formTable.ReserveCheckInTime = dayjs(this.formTable.ReserveCheckInTime).format()
      this.formTable.ReserveCheckOutTime = dayjs(this.formTable.ReserveCheckOutTime).format()

      const _this = this
      console.log(this.formTable.price)
      this.$api.orderApi.addNewOrder(this.formTable.account, parseInt(this.formTable.roomId),
        this.formTable.ReserveCheckInTime, this.formTable.ReserveCheckOutTime,
        parseInt(this.formTable.roomAmount), this.formTable.price * 100)
        .then(res => {
          _this.$api.orderApi.orderpay(res.data.uuid, res.data.price / 100).then(resp => {
            this.$router.push({
              path: '/client/pay',
              query: { html: resp.data.body }
            })
          }).catch(err => {
            console.log(err);
          });
          this.$router.push({ name: "clientTableSelect", params: { hotelName: this.hotelName, hotelId: this.companyGroupId, hotelAddress: this.hotelAddress } });
        }).catch(err => {
          console.log(err)
        })
    },
    getBeforeDate(num, time) {
      let n = num;
      let d = '';
      if (time != "") {
        return time;
      } else {
        d = new Date();
      }
      let year = d.getFullYear();
      let mon = d.getMonth() + 1;
      let day = d.getDate();
      let hh = d.getHours();
      let mf = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes();
      let ss = d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds();
      if (day <= n) {
        if (mon > 1) {
          mon = mon - 1;
        } else {
          year = year - 1;
          mon = 12;
        }
      }
      d.setDate(d.getDate() - n);
      year = d.getFullYear();
      mon = d.getMonth() + 1;
      day = d.getDate();
      let s = year + "-" + (mon < 10 ? ('0' + mon) : mon) + "-" + (day < 10 ? ('0' + day) : day) + " " + hh + ":" + mf + ":" + ss;
      return s;
    },
    getDateTime(time, day) {
      if (time != "") {
        return time
      }
      let yy = new Date().getFullYear();
      let mm = new Date().getMonth() + 1;
      let dd = new Date().getDate() + day;
      let hh = new Date().getHours();
      let mf = new Date().getMinutes() < 10 ? "0" + new Date().getMinutes() : new Date().getMinutes();
      let ss = new Date().getSeconds() < 10 ? "0" + new Date().getSeconds() : new Date().getSeconds();
      let gettime = yy + "-" + mm + "-" + dd + " " + hh + ":" + mf + ":" + ss;
      return gettime;
    },
  },
  data() {
    return {
      drawer: false,
      formTable: {
        account: this.$store.getters.getUser.id,
        roomId: this.$route.params.roomID,
        ReserveCheckInTime: "",
        ReserveCheckOutTime: "",
        roomAmount: 1,
        price: this.$route.params.price,
        sum: this.$route.params.price,
      },
      sum:0,
      coupons: null,
      RoomID: this.$route.params.roomID,
      companyGroupId: this.$route.params.companyGroupId,
      hotelName: this.$route.params.hotelName,
      hotelAddress: this.$route.params.hotelAddress
    }
  },
  created() {
    this.$api.orderApi.getCoupon(this.$store.getters.getUser.id)
      .then(res => {
        this.coupons = res.data
        this.sum = 0
        for (let i = 0; i < 10; i++) {
            if (this.coupons[i] != 0) {
              this.sum += 1
            }
          }
        // console.log(this.sum)
      }).catch(err => {
        console.log(err)
      })
    this.formTable.ReserveCheckInTime = this.getBeforeDate(0, this.$route.params.startTime)
    this.formTable.ReserveCheckOutTime = this.getBeforeDate(-1, this.$route.params.endTime)
    console.log(this.formTable)
  },
}
</script>

<style scoped>
.el-main {
  background-color: #E9EEF3;
  color: #333;
  text-align: left;
  line-height: 160px;
  width: 500px;
}

.title {
  font-size: large;
  line-height: 1.5;
  font-weight: bold;
  margin: 15px 0px;
}

.coupon {
  position: relative;
  width: 400px;
  height: 160px;
  margin: 20px auto;
  color: #fff;
  font-size: 30px;
  text-indent: 40px;
  line-height: 160px;
  background-image: radial-gradient(circle at 1px 8px, transparent 6px, #f60 6px, #f60 0),
    radial-gradient(circle at 199px 8px, transparent 6px, #f60 6px, #f60 0);
  background-size: 200px 18px;
  background-position: 0 0, 200px 0;
  background-repeat-x: no-repeat;
}

.coupon::before {
  position: absolute;
  content: "";
  left: 240px;
  top: 0;
  bottom: 0;
  width: 0;
  border-left: 1px dashed #fff;
}

.coupon::after {
  content: "下单即享满减优惠";
  position: absolute;
  width: 70px;
  top: 50%;
  right: 2%;
  transform: translate(-50%, -50%);
  line-height: 40px;
  text-indent: 5px;
  font-size: 30px;
}

.btn {
  text-align: center;
}
</style>
<!-- 未出行的订单 -->
<!-- 修改未完成订单可以取消或者可以修改修改时间（仅支持某门店同种房型）-->
<!-- 取消订单 -->
<!-- 再细想一下设计 -->
<template>
    <div class="reserveOrder">
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
                :header-cell-style="{ background: '#00abbe', color: '#fff', 'text-align': 'center' }"
                highlight-current-row>
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
                <el-table-column align="center" prop="operation" label="操作" width="200px">
                    <template slot-scope="scope">
                        <el-button type="primary" size="small" round @click="handleClick(scope.$index)">修改订单</el-button>
                        <el-button type="danger" size="small" round @click="handleDelete(scope.$index)">取消订单
                        </el-button>
                    </template>
                </el-table-column>

            </el-table>
            <!--分页-->
            <el-pagination v-model:page-size="pageSize" background @size-change="handleSizeChange"
                @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-sizes="[2, 4, 6, 8]"
                layout="prev, pager, next, sizes, total, jumper" :total="total" />
        </div>

        <div class="orderModify">
            <el-dialog :visible.sync="dialogVisible" :title="dialogTitle" width="35%" close-on-press-escape
                v-dialogDrag>
                <h3>请重新选择入住及退房时间</h3>
                <el-form :model="dialogForm" ref="dialogForm">
                    <!--选择日期-->
                    <el-form-item label="入住时间" prop="checkInTime" label-width="120px">
                        <el-date-picker v-model="dialogForm.checkInTime" type="datetime" placeholder="选择入住日期时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="退房时间" prop="checkOutTime" label-width="120px">
                        <el-date-picker v-model="dialogForm.checkOutTime" type="datetime" placeholder="选择离开日期时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="价格" prop="price" label-width="120px">
                        <el-input v-model="dialogForm.price" placeholder="请重新输入价格"></el-input>
                    </el-form-item>

                </el-form>

                <div style="text-align:right">
                    <el-button type="primary" v-on:click="dialogSave()">确定</el-button>
                    <el-button @click="dialogCancel()">退出</el-button>
                </div>
            </el-dialog>
        </div>
        <div class="deleteOrder">
            <el-dialog :visible.sync="dialogVisibleDelete" width="35%" close-on-press-escape v-dialogDrag>
                <span>确定删除？</span>
                <div style="text-align:right">
                    <el-button type="primary" v-on:click="confirmDelete()">确定</el-button>
                    <el-button @click="unDelete()">退出</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
    
<script>
import dayjs from "dayjs";
export default {
    data() {
        return {
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
            //对话框
            dialogVisible: false,//订单详细信息窗口
            dialogForm: {
                checkInTime: "",
                checkOutTime: "",
                price: "",
            },//对话框中的form 新增和编辑
            dialogTitle: "",
            //数据
            tableData: [],
            dialogVisibleDelete: false,
            row_index: 0,
            orderId: "",
        }
    },
    methods: {
        dialogCancel() {
            this.dialogVisible = false;//对话框不显示
        },
        dialogSave() {
            const _this = this
            this.$api.orderApi.ModifyOrderByAdmin(this.orderId, dayjs(this.dialogForm.checkInTime).format(), dayjs(this.dialogForm.checkOutTime).format(), this.dialogForm.price * 100).then(res => {
                if (res.data.code === 3003) {
                    this.$message({
                        message: res.data.message,
                        type: "error"
                    });
                } else {
                    _this.tableData[this.row_index].reserveCheckInTime = dayjs(this.dialogForm.checkInTime).format("YYYY-MM-DD HH:mm:ss")
                    _this.tableData[this.row_index].reserveCheckOutTime = dayjs(this.dialogForm.checkOutTime).format("YYYY-MM-DD HH:mm:ss")
                    _this.tableData[this.row_index].price = this.dialogForm.price
                }
            }).catch(err => {
                console.log(err);
            });
            this.dialogVisible = false;//对话框不显示
        },
        handleClick(row_index) {
            this.row_index = row_index
            //给日期时间选择器赋值（初始值）
            this.orderId = this.tableData[row_index].uuid
            this.dialogForm.checkInTime = new Date(this.tableData[row_index].reserveCheckInTime)
            this.dialogForm.checkOutTime = new Date(this.tableData[row_index].reserveCheckOutTime)
            this.dialogForm.price = this.tableData[row_index].price
            this.dialogTitle = "订单：" + this.orderId;
            this.dialogVisible = true;
        },
        //---------------删除订单
        unDelete() {
            this.dialogVisibleDelete = false;//对话框不显示
        },
        confirmDelete() {
            const _this = this
            this.$api.orderApi.DeleteOrderByUUID(this.tableData[this.row_index].uuid)
                .then(res => {
                    this.$message({
                        message: "删除成功",
                        type: "success"
                    });
                    _this.getAllAPI(this.pageSize, 1)
                }).catch(err => {
                    console.log(err);
                });
            this.dialogVisibleDelete = false;
        },
        handleDelete(row_index) {
            this.dialogVisibleDelete = true;
            this.row_index = row_index
        },
        //---------------------
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
            this.$api.orderApi.GetOrdersNumByConditionWithoutAccount(uuid, key, "200")
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
                        _this.$api.orderApi.GetOrdersByConditionWithoutAccount(_this.pageSize, current, uuid, key, "200")
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
            this.$api.orderApi.GetAllUnfinishedOrdersNum()
                .then(res => {
                    _this.total = res.data
                }).catch(err => {
                    console.log(err);
                });
            this.$api.orderApi.GetAllUnfinishedOrders(size, current)
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

h3 {
    margin-left: 30px;
}
</style>
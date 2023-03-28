<template>
    <div class="HotelInfo">
        <div class="bookTable">

            <el-table :data="tableData" border style="width: 100%"
                :header-cell-style="{ background: '#909399', color: '#fff', 'text-align': 'center' }"
                highlight-current-row>

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
                        <el-button @click="handleUnsubscribe(scope.row)" type="text" size="small">取消订阅</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页-->
            <el-pagination v-model:page-size="pageSize" background @size-change="handleSizeChange"
                @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-sizes="[2, 4, 6, 8]"
                layout="prev, pager, next, sizes, total, jumper" :total="total" />

        </div>

        <div class="deleteOrder">
            <el-dialog :visible.sync="dialogVisible" width="35%" close-on-press-escape v-dialogDrag>
                <span>确定取消订阅？</span>
                <div style="text-align:right">
                    <el-button type="primary" v-on:click="dialogSave()">确定</el-button>
                    <el-button @click="dialogCancel()">退出</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
  
<script>
export default {
    data() {
        return {
            currentPage: 1,
            total: 10,//数据一共多少
            pageSize: 2,//每页显示的行数,默认为2
            tableData: [],
            account: this.$store.getters.getUser.id,
            dialogVisible: false,
            row: ""
        }
    },
    methods: {
        dialogCancel() {
            this.dialogVisible = false;//对话框不显示
        },
        dialogSave() {
            const _this = this
            this.$api.clientApi.unsubscribeHotel(this.account, this.row.hotelName)
                .then(res => {
                    _this.getAllAPI(this.pageSize, 1)
                }).catch(err => {
                    console.log(err);
                });
            this.dialogVisible = false;
            this.$message({
                showClose: true,
                message: '您已成功取消订阅酒店' + this.row.hotelName,
                type: 'success'
            });
        },
        handleUnsubscribe(row) {
            this.dialogVisible = true;
            this.row = row
        },

        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
            this.pageSize = val;
            this.handleCurrentChange(1);//默认更改每页多少条后重新加载第一页
        },
        handleCurrentChange() {
            this.getAllAPI(this.pageSize, this.currentPage)
        },

        getAllAPI(size, current) {
            const _this = this
            this.$api.clientApi.getHotelsCountSubscribed(this.account)
                .then(res => {
                    _this.total = res.data
                }).catch(err => {
                    console.log(err);
                });
            this.$api.clientApi.getHotelsSubscribed(size, current, this.account)
                .then(res => {
                    _this.tableData = res.data
                }).catch(err => {
                    console.log(err);
                });
        }
    },
    mounted() {
        // 初始时表格展示的数据
        this.getAllAPI(2, 1)
    },
}

</script>
<style scoped>
.bookTable {
    margin: auto;
    margin-top: 30px;
    width: 70%;
}
</style>
  
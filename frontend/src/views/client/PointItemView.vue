<!-- 用户积分兑换情况查看 -->
<template>
    <div class="PointItemView">
        <div class="table">
            <el-table :data="tableData" border style="width: 100%"
                :header-cell-style="{ background: '#909399', color: '#fff', 'text-align': 'center' }"
                highlight-current-row>
                <el-table-column fixed prop="account" label="用户账号">
                </el-table-column>
                <el-table-column prop="consignee" label="收货人">
                </el-table-column>
                <el-table-column prop="goods" label="物品">
                </el-table-column>
                <el-table-column prop="goodsPoints" label="奖品积分">
                </el-table-column>
                <el-table-column prop="deliveryAddress" label="收货地址">
                </el-table-column>
                <el-table-column prop="contactNumber" label="联系电话">
                </el-table-column>
            </el-table>
            <!--分页-->
            <el-pagination v-model:page-size="pageSize" background @size-change="handleSizeChange"
                @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-sizes="[2, 4, 6, 8]"
                layout="prev, pager, next, sizes, total, jumper" :total="total" />

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
        }
    },
    methods: {
        handleSizeChange(val) {
            // 更改每页多少条数据
            console.log(`每页 ${val} 条`);
            this.pageSize = val;
            this.handleCurrentChange(1);//默认更改每页多少条后重新加载第一页
        },
        handleCurrentChange() {
            this.getAllAPI(this.pageSize, this.currentPage)
        },

        getAllAPI(size, current) {
            const _this = this
            this.$api.clientApi.getAllAwardsCountByUser(this.account)
                .then(res => {
                    _this.total = res.data
                }).catch(err => {
                    console.log(err);
                });
            this.$api.clientApi.getAllAwardsByUser(size, current, this.account)
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
.table {
    margin: auto;
    margin-top: 30px;
    width: 70%;
}
</style>
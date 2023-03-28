<!-- 查看评价 -->
<template>
    <div class="uncommentOrder">
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
                        <el-button type="text" size="small" @click="handleClick(scope.$index)">查看评价</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页-->
            <el-pagination v-model:page-size="pageSize" background @size-change="handleSizeChange"
                @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-sizes="[2, 4, 6, 8]"
                layout="prev, pager, next, sizes, total, jumper" :total="total" />
        </div>

        <div class="seeComment">
            <el-dialog :visible.sync="dialogVisible" :title="dialogTitle" width="500px" close-on-press-escape
                v-dialogDrag>
                <el-timeline :model="dialogForm" ref="dialogForm">
                    <el-timeline-item timestamp="评分" placement="top">
                        <el-card>
                            <el-rate v-model="dialogForm.grade" disabled :colors="['#99A9BF', '#F7BA2A', '#FF9900']">
                            </el-rate>
                        </el-card>
                    </el-timeline-item>
                    <el-timeline-item timestamp="文字评价" placement="top">
                        <el-card>
                            <span>{{ dialogForm.wordComment }}</span>
                        </el-card>
                    </el-timeline-item>
                    <el-timeline-item timestamp="图片评价" placement="top" v-if="pictureOrNot">
                        <el-row>
                            <el-col :span="8" v-for="item in img_list" :key="item">
                                <el-card :body-style="{ padding: '0px' }">
                                    <img class="image" :src="item" alt />
                                </el-card>
                            </el-col>
                        </el-row>
                    </el-timeline-item>

                    <el-timeline-item timestamp="视频评价" placement="top" v-if="videoOrNot">
                        <video-player class="video-player vjs-custom-skin" ref="videoPlayer" :playsinline="true"
                            :options="playerOptions" @play="onPlayerPlay($event)" @pause="onPlayerPause($event)">
                        </video-player>
                    </el-timeline-item>
                </el-timeline>
                <div style="text-align:right">
                    <el-button @click="dialogCancel()">退出</el-button>
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
            pictureOrNot: false,
            videoOrNot: false,
            uuid: "",
            img_list: [],//图片的列表
            //对话框
            dialogVisible: false,//订单详细信息窗口
            dialogTitle: "",
            dialogForm: {
                grade: 0,
                wordComment: "",
            },
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
            playerOptions: {
                playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
                autoplay: false, //如果true,浏览器准备好时开始回放。
                muted: false, // 默认情况下将会消除任何音频。
                loop: false, // 导致视频一结束就重新开始。
                preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
                language: 'zh-CN',
                aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
                fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
                sources: [{
                    type: "video/mp4",
                    src: "http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4" //你的视频地址（必填）
                    // src: "" //你的视频地址（必填）
                }],
                poster: "", //你的封面地址
                width: document.documentElement.clientWidth,
                notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
                controlBar: {
                    timeDivider: true,
                    durationDisplay: true,
                    remainingTimeDisplay: false,
                    fullscreenToggle: true  //全屏按钮
                }
            }
        }
    },
    methods: {
        dialogCancel() {
            this.dialogVisible = false;//对话框不显示
        },
        handleClick(row_index) {
            this.uuid = this.tableData[row_index].uuid
            this.dialogTitle = "订单：" + this.uuid;
            const _this = this
            this.$api.orderApi.getGradeEvaluate(this.uuid)
                .then(res => {
                    _this.dialogForm.grade = res.data[0].grade
                    _this.dialogForm.wordComment = res.data[0].evaluate
                }).catch(err => {
                    console.log(err);
                });

            this.$api.orderApi.getPictures(this.uuid)
                .then(res => {
                    console.log(res)
                    if (res.data[0].length !== 0) {
                        _this.pictureOrNot = true
                        _this.img_list = []
                        for (let i = 0; i < res.data[0].length; i++) {
                            _this.img_list.push("data:image/png;base64," + res.data[0][i])
                        }
                    } else {
                        _this.pictureOrNot = false
                    }
                }).catch(err => {
                    console.log(err);
                });

            this.$api.orderApi.getVideo(this.uuid)
                .then(res => {
                    if (res.data[0] !== "") {
                        _this.videoOrNot = true
                        _this.playerOptions.sources[0].src = "data:video/mp4;base64," + res.data[0]
                    } else {
                        _this.videoOrNot = false
                    }
                }).catch(err => {
                    console.log(err);
                });
            this.dialogVisible = true;
        },
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
            this.$api.orderApi.GetOrdersNumByConditionWithoutAccount(uuid, key, "400")
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
                        _this.$api.orderApi.GetOrdersByConditionWithoutAccount(_this.pageSize, current, uuid, key, "400")
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
            this.$api.orderApi.GetAllEvaluatedOrdersNum()
                .then(res => {
                    _this.total = res.data
                }).catch(err => {
                    console.log(err);
                });
            this.$api.orderApi.GetAllEvaluatedOrders(size, current)
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
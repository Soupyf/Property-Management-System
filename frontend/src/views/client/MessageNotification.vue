<!-- 消息通知页面 -->
<template>
    <div class="background">

        <div class="delete">
            <el-button type="danger" icon="el-icon-delete" @click="deleteMessage()">全部删除</el-button>
        </div>

        <div class="messageNotif">
            <div class="message">
                <el-timeline>
                    <el-timeline-item v-for="(activity, index) in activities" :key="index"
                        :timestamp="activity.timestamp" placement="top" color="#78c0ff">
                        <el-card>
                            {{ activity.content }}
                        </el-card>
                    </el-timeline-item>
                </el-timeline>
            </div>
        </div>

        <div class="deleteOrder">
            <el-dialog :visible.sync="dialogVisible" width="35%" close-on-press-escape v-dialogDrag>
                <span>确定删除？</span>
                <div style="text-align:right">
                    <el-button type="primary" v-on:click="dialogSave()">确定</el-button>
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
            activities: [],
            dialogVisible: false,
        };
    },
    methods: {
        dialogCancel() {
            this.dialogVisible = false;//对话框不显示
        },
        dialogSave() {
            const _this = this
            this.$api.clientApi.deleteAllMessage(this.$store.getters.getUser.id).then(res => {
                _this.activities = [
                    {
                        timestamp: "",
                        content: "没有任何通知哦~"
                    }
                ]
            }).catch(err => {
                console.log(err);
            });
            this.dialogVisible = false;

            this.$message({
                showClose: true,
                message: '删除成功',
                type: 'success'
            });
        },
        deleteMessage() {
            this.dialogVisible = true;
        }
    },
    mounted() {
        const _this = this
        this.$api.clientApi.getMessage(this.$store.getters.getUser.id).then(res => {
            for (let i = 0; i < res.data[0].info.length; i++) {
                if (res.data[0].info[i] === null) {
                    continue;
                } else {
                    const arr = res.data[0].info[i].split("$$")
                    _this.activities.push({
                        timestamp: dayjs(arr[1]).format("YYYY-MM-DD HH:mm:ss"),
                        content: arr[0]
                    })
                }
            }
            if (_this.activities.length === 0) {
                _this.activities = [
                    {
                        timestamp: "",
                        content: "没有任何通知哦~"
                    }
                ]
            }
        }).catch(err => {
            console.log(err);
        });
    }
};
</script>
<style scoped>
.delete {
    margin-left: 20px;
}

.messageNotif {
    margin-left: 20%;
    margin-right: 20%;
    border-radius: 10px;
    border: 1px solid #cfd6dc;
    box-shadow: 0 0 25px #909399;
    background-color: rgba(255, 255, 255, 0.55);
}

.message {
    margin: 20px;
}

.background {
    padding-top: 30px;
    padding-bottom: 30px;
    position: relative;
    min-height: 100vh;
    height: 100%;
    width: 100%;
    /* background: linear-gradient(rgba(45, 45, 129, 0.826) 5%, rgb(78, 157, 247) 70%, rgb(166, 216, 255) 100%); */
    background: linear-gradient(rgb(202, 231, 252) 5%, rgb(166, 216, 255) 25%, rgb(146, 195, 251) 55%, rgb(166, 216, 255) 95%);
}
</style>
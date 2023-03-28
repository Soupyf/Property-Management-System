<template>
    <div class="Store">
        <h3>您共有{{ userPoint }}积分</h3>
        <el-row>
            <el-col :span="8" v-for="(o, index) in 9" :key="o">
                <el-card :body-style="{ padding: '0px' }">
                    <img class="image" :src="img_list[index]" alt />
                    <div style="padding: 14px;">
                        <h3>{{ description_list[index] }}</h3>
                        <span>需要{{ point_list[index] }}积分</span>
                        <div class="bottom clearfix">
                            <el-button type="primary" class="button"
                                @click="handleBuy(description_list[index], point_list[index])">兑换</el-button>
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    data() {
        var img1 = require("../../assets/award/airpods.jpg");
        var img2 = require("../../assets/award/iphone.jpg");
        var img3 = require("../../assets/award/bear.jpg");
        var img4 = require("../../assets/award/cup.jpg");
        var img5 = require("../../assets/award/keyboard.jpg");
        var img6 = require("../../assets/award/light.jpg");
        var img7 = require("../../assets/award/manghe.jpg");
        var img8 = require("../../assets/award/mouse.jpg");
        var img9 = require("../../assets/award/notebook.jpg");
        return {
            img_list: [img1, img2, img3, img4, img5, img6, img7, img8, img9],
            description_list: ["耳机", "手机", "小熊玩偶", "杯子", "键盘", "小夜灯", "盲盒", "鼠标", "笔记本"],
            point_list: ["2000", "99999", "500", "300", "400", "30", "100", "150", "66"],
            userPoint: 0
        };
    },
    methods: {
        handleBuy(award_name, award_point) {
            if (this.userPoint < award_point) {
                this.$message({
                    showClose: true,
                    message: "您的积分不够，请重新选择兑换物品",
                    type: "error"
                });
            } else {
                this.$router.push({ name: "clientShippingAddress", params: { award_name: award_name, award_point: award_point } });
            }
        }
    },
    mounted() {
        const _this = this
        this.$api.clientApi.getPoint(this.$store.getters.getUser.id).then(res => {
            _this.userPoint = res.data / 100
        }).catch(err => {
            console.log(err);
        });

    }
}
</script>
<style>
.Store {
    margin-top: 3%;
    margin-bottom: 3;
    margin-left: 10%;
    margin-right: 10%;
}

.time {
    font-size: 13px;
    color: #999;
}

.bottom {
    margin-top: 13px;
    line-height: 12px;
}

.button {
    padding: 0;
    float: right;
}

.image {
    width: 100%;
    display: block;
}

.clearfix:before,
.clearfix:after {
    display: table;
    content: "";
}

.clearfix:after {
    clear: both
}
</style>
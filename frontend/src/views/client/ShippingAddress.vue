<!-- 兑换物品填写收货信息 -->
<template>
    <div id="picture">
        <div class="shippingAddress">
            <div class="message">
                <el-form class="buy_form" ref="buyFormRef" :model="buyForm" :rules="buyRules" :v-model="submitBuyForm"
                    @keyup.enter.native="submitBuyForm()">
                    <h4>物品：{{ this.award_name }}</h4>
                    <h4>积分：{{ this.award_point }}</h4>
                    <el-form-item label="收货人" prop="receiveName" label-width="100px">
                        <el-input class="in" v-model="buyForm.receiveName" prefix-icon="iconfont icon-mima"
                            placeholder="请输入收货人">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="联系电话" prop="phoneNumber" label-width="100px">
                        <el-input class="in" v-model="buyForm.phoneNumber" prefix-icon="iconfont icon-shouji"
                            placeholder="请输入联系电话">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="收货地址" prop="address" label-width="100px">
                        <el-input class="in" v-model="buyForm.address" prefix-icon="iconfont icon-shouji"
                            placeholder="请输入收货地址">
                        </el-input>
                    </el-form-item>
                    <!-- 按钮 -->
                    <el-form-item class="btns">
                        <el-button type="primary" @click="submitBuyForm()">确定</el-button>
                        <el-button type="info" @click="resetBuyForm()">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>
  
<script>
export default {
    data() {
        var validatePhone = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("请输入收货电话"));
            } else {
                var reg = /^1[3456789]\d{9}$/;
                if (!reg.test(value)) {
                    callback(new Error("请输入正确的电话号"));
                } else { callback(); }
            }
        }
        return {
            account: this.$store.getters.getUser.id,
            award_name: this.$route.params.award_name,
            award_point: this.$route.params.award_point,
            //表单数据
            buyForm: {
                receiveName: "",
                phoneNumber: "",
                address: "",
            },
            buyRules: {
                receiveName: [{ required: true, message: '请输入收货人', trigger: "blur" }],
                phoneNumber: [{ required: true, validator: validatePhone, trigger: "blur" }],
                address: [{ required: true, message: '请输入收货地址', trigger: "blur" }],
            },
        }
    },
    methods: {
        resetBuyForm() {//重置用户名和密码方法
            this.$refs.buyFormRef.resetFields();
        },
        submitBuyForm() {
            this.$refs.buyFormRef.validate(async valid => {
                //1.验证失败则结束
                if (!valid) { return; }
                else {
                    this.$api.clientApi.addAward(this.account, this.award_point * 100, this.award_name, this.buyForm.receiveName, this.buyForm.phoneNumber, this.buyForm.address)
                        .then(res => {
                            if (res.data.code == 20000) {
                                this.$message({
                                    showClose: true,
                                    message: res.data.message,
                                    type: "error"
                                });
                            } else {
                                this.$message({
                                    showClose: true,
                                    message: "兑换成功！",
                                    type: "success"
                                });
                                this.$router.push({ path: "/client/store" });
                            }
                        }).catch(err => {
                            console.log(err);
                        });
                }
            })
        },
    }
}
</script>
  
<style scoped>
.shippingAddress {
    margin-top: 7%;
    margin-left: 25%;
    margin-right: 25%;
    min-height: 380px;
    border-radius: 10px;
    border: 1px solid #cfd6dc;
    box-shadow: 0 0 25px #909399;
    background-color: rgba(255, 255, 255, 0.7);
}

.message {
    margin: 30px;
}

.in {
    margin-left: 7%;
    margin-right: 3%;
    width: 70%;
}

.btns {
    float: right;
}
</style>
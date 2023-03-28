<template>
    <div class="userLogin">
        <BackgroundVideo></BackgroundVideo>
        <el-form class="login_box">
            <el-form-item class="text_box">
                <span class="text">
                    {{ showText }}<br>
                    {{ loginInform }}
                </span>
            </el-form-item>
            <el-form-item class="loginButton">

                <router-link to="/userLogin/UserSignUp">
                    <!-- 用户注册 -->
                    <el-button type="primary" plain>Sign Up</el-button>
                </router-link>
                <router-link to="/userLogin/UserSignIn">
                    <!-- 用户登录 -->
                    <el-button type="success" style="margin-left: 100px" plain>Sign In</el-button>
                </router-link>

            </el-form-item>
        </el-form>
        <router-view></router-view>
    </div>
</template>

<script>
import BackgroundVideo from '@/components/BackgroundVideo.vue';
export default {
    name: 'userLogin',
    components: {
        BackgroundVideo
    },
    data() {
        return {
            timer: null, //settimeout
            showText: "",
            loginInform: "If you have an account, please sign in."
        };
    },

    mounted() {
        this.appear(
            "Welcome to the hotel! Let's begin the adventure!!!!!"
        );
    },

    methods: {
        appear(content) {
            const _this = this;

            this.showText = "";
            clearTimeout(this.timer);

            var speed = 70; //设置定时的速度 越来越快
            var count = 1;

            function changeContent() {
                _this.showText = content.substring(0, count); //截取字符串
                count++;

                if (count != content.length + 1) {
                    speed -= 1;
                    if (speed < 5) speed = 5;

                    _this.timer = setTimeout(changeContent, speed);
                }
            }
            changeContent();
        },
    },
};
</script>

<style scoped>
.login_box {
    background-color: rgb(254, 238, 145);
    margin: auto;
    position: relative;
    width: 40%;
    top: 200px;
    border-radius: 8px;
    text-align: center;
    /* 表单页边距 */
    padding: 10px;
}

.text {
    color: rgb(225, 29, 52);
}
</style>
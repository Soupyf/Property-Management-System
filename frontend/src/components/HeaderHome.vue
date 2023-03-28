<template>
    <div class="headerHome">
        <div class="logoBox">
            <!-- 点击哆啦A梦头像可以返回首页 -->
            <router-link active-class="initial" to="/">
                <div class="logo">
                    <img src="../assets/logo.png" alt="">
                </div>
            </router-link>
        </div>
    </div>
</template>
<script>
export default {
    name: "HeaderHome"
}
</script>

<style scoped>
.logoBox {
    position: relative;
    z-index: 200;
    padding: 0 15px;
}

.logo {
    position: relative;
    float: left;
    margin-right: 8px;
    /* 当箭头鼠标移到会变成手式鼠标 */
    cursor: pointer;
}

.logo img {
    width: 80px;
    max-width: 80px;
    height: 44px;
    display: block;
    margin-top: calc((48px - 44px)/ 2);
}
</style>
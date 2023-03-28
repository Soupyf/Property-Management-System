<template>
    <div class="show_picture">
        <!--动态将图片轮播图的容器高度设置成与图片一致-->
        <el-carousel :height="bannerHeight + 'px'">
            <!--遍历图片地址,动态生成轮播图-->
            <el-carousel-item v-for="item in img_list_1" :key="item">
                <img :src="item" alt />
            </el-carousel-item>
        </el-carousel>
        <h1>关于酒店</h1>
        <VideoPlayerVue></VideoPlayerVue>
        <h1>酒店简介</h1>
        <div class="word">
            7⭐hotel，位于广东省深圳市南山区1088号，占地1200亩，临近塘朗地铁站，交通便利。

            酒店提供悠闲写意且实惠的豪华设施及细致服务，是安排商务会议、婚礼、社交聚会、本地度假、商务以及休闲旅行的理想选择。酒店设有3间各具特色的餐厅及酒吧，由充满活力及热诚的优秀团队策划一系列别具一格的美食体验。
            <br>
            联系电话 ：123456780
        </div>
        <h1>房间案例</h1>
        <el-carousel class="card_picture" :interval="4000" type="card" height="400px">
            <el-carousel-item v-for="item in img_list_2" :key="item">
                <img :src="item" alt />
            </el-carousel-item>
        </el-carousel>

    </div>

</template>
<script>
import VideoPlayerVue from './VideoPlayer.vue';
export default {
    name: "Information",
    components: {
        VideoPlayerVue
    },
    data() {
        var img1 = require("../assets/hotel/hotel1.jpeg");
        var img2 = require("../assets/hotel/hotel2.jpeg");
        var img3 = require("../assets/hotel/hotel3.jpeg");
        var img4 = require("../assets/hotel/hotel4.jpeg");
        var img5 = require("../assets/hotel/hotel5.jpeg"); 
        var img6 = require("../assets/hotel/hotel6.jpeg"); 
        var img7 = require("../assets/hotel/hotel7.jpeg");
        return {
            img_list_1: [img1, img2, img3, img4],
            img_list_2: [img5, img6, img7],
            // 图片父容器高度
            bannerHeight: window.innerHeight,
            // 浏览器宽度
            screenWidth: window.innerWidth
        };
    },

    mounted() {
        // 首次加载时,需要调用一次
        this.screenWidth = window.innerWidth;
        this.bannerHeight = window.innerHeight;

        // 窗口大小发生改变时,调用一次
        window.onresize = () => {
            this.screenWidth = window.innerWidth;
            this.bannerHeight = window.innerHeight;

        };
    }
};
</script>
   
<style scoped>
img {
    /*设置图片宽度和浏览器宽度一致*/
    width: 100%;
    /* 和父组件el-carousel高度一致 */
    height: inherit;
}

.card_picture {
    width: 70%;
    margin: auto;
    position: relative;
}

h1 {
    color: #fff;
    text-align: center;
}

.word {
    font-size: large;
    width: 70%;
    line-height: 1.5;
    margin: auto;
    color: #fff;
}
</style>
    
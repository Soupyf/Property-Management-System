<template>
    <div>
        <div class="navbarBox" style="min-height: 48px;">
            <div class="navbar">
                <!-- 导航栏容器 -->
                <div class="navbar-container">
                    <!-- 左侧 -->
                    <div class="navbar-container-left">
                        <!-- 点击哆啦A梦头像可以返回首页 -->
                        <router-link active-class="initial" to="/">
                            <div class="logo">
                                <img src="../assets/logo.png" alt="">
                            </div>
                        </router-link>

                        <ul class="left-ul">

                            <li title="">
                                <router-link active-class="active" to="/client/hotelInfo"> 用户 </router-link>
                            </li>
                            <li title="">
                                <router-link active-class="active" to="/administratorLogin"> 管理员 </router-link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: "Header",
    data() {
        return {
            opacity: 1
        }
    },
    methods: {
        mouseOver() {
            this.opacity = 0
            this.display = 'block'
        },
        mouseLeave() {
            this.opacity = 1
            this.display = 'none'
        },
    },
}
</script>
<style scoped>
.navbar {
    position: fixed;
    z-index: 100;
    top: 0px;
    width: 100%;
    left: 0px;
    font-size: 14px;
    /* 字体粗细，400相当于normal */
    font-weight: 400;
    color: #fff;
    background-color: #545c64;
    /* 阴影  水平阴影距离，垂直阴影距离， 模糊尺寸， 阴影尺寸 颜色*/
    box-shadow: 0 2px 4px 0 rgb(0, 0, 0, 5%);
}

.navbar-container {
    width: 100%;
    /* 最小宽度，窗口缩小之后到1280px不会再缩小 */
    min-width: 1280px;
    box-sizing: border-box;
    padding: 0 24px;
    margin: 0 auto;
    height: 48px;
    line-height: 48px;
    display: flex;
    justify-content: space-between;
    -webkit-box-pack: justify;
}

.toolbar-container-left {
    /* 元素会根据自身宽高来设置尺寸。它是完全非弹性的：既不会缩短，也不会伸长来适应 flex 容器 */
    flex: none;
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

.left-ul {
    width: auto;
    height: 100%;
    /* 去除li中的间隙，在li中设置font-size,否则没有内容 */
    font-size: 0px;
    float: left;
}

.left-ul li {
    position: relative;
    display: inline-block;
    font-size: 16px;
    height: 100%;
    line-height: 48px;
}

a {
    color: #fff;
    padding: 0 30px;
    /* 删除a标签的下划线 */
    text-decoration: none;
}

/* 鼠标停留时的样式 */
.left-ul li:hover {
    background-color: #8e8f90;
}

.active {
    color: #f6da39;
    pointer-events: none;
    opacity: 1;
}
</style>
<template>
  <div id="app">
    <!-- 只在Home页面展示导航栏 -->
    <Header v-show="(path === '/')"></Header>
    <HeaderHome v-show="(path !== '/')"></HeaderHome>
    <router-view></router-view>
  </div>
</template>

<script>
import Header from './components/Header.vue';
import HeaderHome from './components/HeaderHome.vue';

export default {
  name: 'app',
  components: {
    Header,
    HeaderHome
  },
  data() {
    return {
      path: ''
    }
  },
  // methods: {
  //   saveState() {
  //     sessionStorage.setItem('state', JSON.stringify(this.$store.state.user))
  //   }
  // },

  // 判断路由
  mounted() {
    this.path = this.$route.path;
    // window.addEventListener('unload', this.saveState)
  },
  watch: {
    $route(to, from) {
      this.path = to.path
    }
  }
}
</script>
<style>
/* 有了这一段，走马灯可以布满整个屏幕了 */
body {
  margin: 0;
  padding: 0;
  border: 0;
}

#picture {
  background: url("assets/test.png");
  width: 100%;
  height: 100%;
  position: fixed;
  background-size: 100% 100%;
}

#particles-js {
  width: 100%;
  height: 100%;
  position: absolute;
  /* 设置absolute,其他DIV设置为relative，这样这个例子效果就作为背景 */
}
</style>
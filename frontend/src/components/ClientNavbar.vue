<template>
	<div class="clientNavbar">
		<el-menu class="navbar" :default-active="this.$route.path" router mode="horizontal" @open="handleOpen"
			@close="handleClose" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
			<div class="navbar-container">
				<el-menu-item index="/client/hotelInfo">酒店预定</el-menu-item>
				<el-menu-item index="/client/baiduMap">地图门店展示</el-menu-item>

				<el-submenu index="1">
					<template slot="title">订单 &nbsp &nbsp </template>
					<el-menu-item index="/client/personalOrder">全部</el-menu-item>
					<el-menu-item index="/client/reserveOrder">未出行</el-menu-item>
					<el-menu-item index="/client/uncommentOrder">待评价</el-menu-item>
					<el-menu-item index="/client/finishOrder">已评价</el-menu-item>
				</el-submenu>

				<el-menu-item index="" key="https://work.weixin.qq.com/kfid/kfc551ffde78e37070b">
					<a href='https://work.weixin.qq.com/kfid/kfc551ffde78e37070b' target='_blank'
						style="text-decoration: none;">
						<i class="el-icon-phone-outline"></i>
						<span class="online" style="color:white">在线客服</span>
					</a>
				</el-menu-item>

				<el-menu-item index="/client/messageNotification">
					<template slot="title">
						<i class="el-icon-bell"></i>
						<span>消息</span>
					</template>
				</el-menu-item>

				<el-menu-item index="/client/favorites">
					<template slot="title">
						<i class="el-icon-star-off"></i>
						<span>收藏夹</span>
					</template>
				</el-menu-item>


				<el-submenu index="2">
					<template slot="title">
						<i class="el-icon-goods"></i>
						<span>积分兑换 &nbsp &nbsp </span>
					</template>
					<el-menu-item index="/client/store">积分兑换商城</el-menu-item>
					<el-menu-item index="/client/pointItemView">兑换物品查看</el-menu-item>
				</el-submenu>

				<!-- 登录的时候显示dz，子菜单为退出登录
				未登录的时候显示“登录/注册”没有子菜单 -->
				<!-- <el-menu-item index="/userLogin" :disabled="isLogin">
					<template slot="title">
						<i class="el-icon-user"></i>
						<span v-if="isLogin">
							{{ $store.getters.getUser.nickname }}
						</span>
						<span v-else>登录/注册</span>
					</template>
				</el-menu-item> -->
				<el-submenu index="3" v-if="isLogin">
					<template slot="title">
						<i class="el-icon-user"></i>
						<span>{{ nickname }} &nbsp &nbsp </span>
						<!-- <span>{{ $store.getters.getUser.nickname }}</span> -->
					</template>
					<el-menu-item index="" @click="logOut">退出登录</el-menu-item>
				</el-submenu>
				<el-menu-item index="/userLogin" v-if="!isLogin">登录/注册</el-menu-item>
			</div>
		</el-menu>
		<router-view></router-view>
	</div>
</template>
  


<script>
export default {
	data() {
		return {
			isLogin: false,
			nickname: "",
		}
	},
	methods: {
		handleOpen(key, keyPath) {
			console.log(key, keyPath);
		},
		handleClose(key, keyPath) {
			console.log(key, keyPath);
		},
		logOut() {
			this.isLogin = false
			this.nickname = ""
			this.$router.push("/client/hotelInfo");
			sessionStorage.removeItem('state')
			localStorage.removeItem('token')
			this.$message({
				showClose: true,
				message: "您已退出登录",
				type: "success"
			});
		}
	},
	mounted() {
		//此处要判断token是否存在
		// console.log(localStorage.getItem("token"))
		// if (localStorage.getItem("token")) {
		// 	this.isLogin = true
		// }
		//用state判断，防止显示出错误
		if (sessionStorage.getItem('state')) {
			this.isLogin = true
			this.nickname = JSON.parse(sessionStorage.getItem('state')).user.nickname
		}
	},
	computed: {

	}
}
</script>

<style scoped>
.navbar {
	position: relative;
	z-index: 100;
}

.el-menu.el-menu--horizontal {
	border-bottom: 0;
	text-align: right;
}


.navbar-container {
	display: flex;
	justify-content: flex-end;
}

.online {
	font-size: 14px;
}
</style>


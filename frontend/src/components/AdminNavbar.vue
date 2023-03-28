<template>
	<div class="adminNavbar">
		<el-menu :default-active="this.$route.path" router mode="horizontal" class="navbar" @open="handleOpen"
			@close="handleClose" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
			<div class="navbar-container">
				<el-menu-item v-for="(item, i) in navList" :key="i" :index="item.name">
					<template slot="title">
						<span> {{ item.navItem }}</span>
					</template>
				</el-menu-item>
				<el-submenu index="2">
					<template slot="title">订单 &nbsp &nbsp </template>
					<el-menu-item index="/admin/allorder">全部</el-menu-item>
					<el-menu-item index="/admin/unfinishOrder">未出行</el-menu-item>
					<el-menu-item index="/admin/uncommentOrder">待评价</el-menu-item>
					<el-menu-item index="/admin/finishOrder">已评价</el-menu-item>
				</el-submenu>
			</div>
		</el-menu>
		<router-view></router-view>
	</div>
</template>
  

<script>
export default {
	data() {
		return {
			navList: [
				//YUKI:write as path
				{ name: '/admin/hotelInfo', navItem: '房间管理' },
				{ name: '/admin/employeeManage', navItem: '员工管理' },
				{ name: '/admin/graph', navItem: '订购量分析' },
				{ name: '/admin/creditsExchange', navItem: '用户积分兑换情况查看' },

				// { name: '/admin/graph', navItem: '营业额分析' },
				// { name: '/admin/checkReserve', navItem: '顾客预定信息查询' },
			]
		}
	},
	methods: {
		handleOpen(key, keyPath) {
			console.log(key, keyPath);
		},
		handleClose(key, keyPath) {
			console.log(key, keyPath);
		}
	}
}
</script>

<style>
.navbar {
	position: relative;
	z-index: 100;
}

/* 去掉导航栏下面的白边  */
.el-menu.el-menu--horizontal {
	border-bottom: 0;
	text-align: right;
}


.navbar-container {
	display: flex;
	justify-content: flex-end;
}
</style>


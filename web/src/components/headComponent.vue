<template>

<Header class='header'>
	<Row class='head-content'>
		<Col span="20" >
			<Row>
				<Col span="6">
					<img src="../assets/img/logo.png" alt="logo" class='logo_img'>
					<span style='font-size: 18px;'>{{ webName }}</span>
				</Col>	
				<Col span="18">
					<Menu mode="horizontal" :active-name="currentIndex" class='head_menu' @on-select='select'>
						<MenuItem name="/index" class='head_menu_item'>首页</MenuItem>
						<MenuItem name="/api" class='head_menu_item'>API中心</MenuItem>
						<MenuItem name="/developer" class='head_menu_item' v-if='userInfo.roles == 0 || userInfo.roles == 1 || userInfo.roles == 3'>开发者中心</MenuItem>
						<MenuItem name="/admin/registerApiCheck" class='head_menu_item'  v-if='userInfo.roles == 0 || userInfo.roles == 2 || userInfo.roles == 3'>管理员中心</MenuItem>
						<MenuItem name="/doc" class='head_menu_item'>帮助文档</MenuItem>
					</Menu>
				</Col>
			</Row>
		</Col>
		<Col span="4" class='login'>
			<Dropdown v-if='userInfo.userId' trigger="hover" style="margin-left: 20px" placement="bottom-end" >
				<div href="javascript:void(0)">
					<span class='user-name' v-text="userInfo.username.length>6?userInfo.username.substring(0,5)+'...':userInfo.username" :title='userInfo.username'></span>
					<Icon type="arrow-down-b"></Icon>
				</div>
				<DropdownMenu slot="list">
					<DropdownItem @click.native='toPersonCenter'>个人中心</DropdownItem>
					<DropdownItem @click.native='logout'>退出</DropdownItem>
				</DropdownMenu>
			</Dropdown>
			<span @click='toLogin' v-else>登录</span>
		</Col>
	</Row>
	<div class='header_after'></div>
</Header>

</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
	data() {
		return {
			webName: '',
			currentIndex: '',
		}
    },
    computed: {
        ...mapState({
            userInfo: state => state.user.userInfo,
        })
    },
	created(){
		// this.select('/')
		if(sessionStorage.common){
			this.webName = JSON.parse(sessionStorage.common).name
		}
		else {
			this.GET_CUSTOM_INFO().then(data => {
				sessionStorage.common = JSON.stringify(data)
				this.webName = data.name
            })
		}
		
	},
	methods: {

		...mapActions(['LOGOUT', 'GET_CUSTOM_INFO' ]),

		toLogin(){
			this.$router.push('/user/loginWay')
		},

		toPersonCenter(){
			this.$router.push('/user')
		},

		select(name){
			this.currentIndex = name
			this.$router.push(name)
		},

		// 登出
		logout(){
			this.LOGOUT().then(data => {
				this.$cookies.remove('Authorization')
				this.$nextTick(() => {
					location.href = data
				})
			}).catch(err => {
				this.$Message.error(err)
			})
		},

	}
}
</script>

<style scoped>
.header {
	width: 100%;
    height: 65px;
    /* overflow: hidden; */
	position: fixed;
	top: 0;
	left: 0;
	color: #fff;
	z-index: 999;
	background: #0b0934;
}

.header_after {
	position: absolute;
	left: 0;
	bottom: -1px;
	width: 100%;
	height: 1px;
	background:rgba(255,255,255,1);
	opacity: 0.1; 
}

.logo_img {
	width: 62px; 
	height: 20px; 
	margin-right: 8px;
	cursor: pointer;
}

.head-content {
	width: 1200px;
	margin: 0 auto;
}

.head_menu {
	background: none;
	height: 65px;
	border: none;
}

/* .ivu-menu-light.ivu-menu-horizontal .ivu-menu-item, 
.ivu-menu-light.ivu-menu-horizontal .ivu-menu-submenu {
	color: #fff;
} */

.ivu-menu-horizontal.ivu-menu-light:after{
	height: 0px;
}

.ivu-menu-item:hover, .ivu-menu-item-selected {
	border: none !important;
}

.login {
	text-align: right;
	cursor: pointer;
}


</style>
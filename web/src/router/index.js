import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
	mode: 'history',
	routes: [
		//主页
		{
			path: '/index',
			component: resolve => require(['@/page/index/index'], resolve)
		},
		//api
		{
			path: '/api',
			component: resolve => require(['@/page/api/api'], resolve)
		},
		{
			path: '/api/apiDetail',
			component: resolve => require(['@/page/api/apiDetail'], resolve)
		},
		//开发者中心
		{
			path: '/developer',
			component: resolve => require(['@/page/developer/developer'], resolve)
		},
		// 编辑API(开发者)
		{
			path: '/developer/editApi',
			component: resolve => require(['@/page/api/editApi'], resolve)
		},
		//管理员中心
		{
			path: '/admin',
			component: resolve => require(['@/page/admin/admin'], resolve),
			children: [
				{ path: '/admin/registerApiCheck', component: resolve => require(['@/page/admin/register/registerApiCheck'], resolve)},
				{ path: '/admin/serverManager', component: resolve => require(['@/page/admin/register/serverManager'], resolve)},
				{ path: '/admin/serverRelative', component: resolve => require(['@/page/admin/register/serverRelative'], resolve)},
				{ path: '/admin/applyApi', component: resolve => require(['@/page/admin/apply/applyApi'], resolve)},
				{ path: '/admin/applySchool', component: resolve => require(['@/page/admin/apply/applySchool'], resolve)},
				{ path: '/admin/applySchool/applySchoolDetail', component: resolve => require(['@/page/admin/apply/applySchoolDetail'], resolve)},
				{ path: '/admin/applySchool/applySchoolDetail/applicationDetail', component: resolve => require(['@/page/admin/apply/applicationDetail'], resolve)},
				{ path: '/admin/applyAnalysis', component: resolve => require(['@/page/admin/apply/applyAnalysis'], resolve)},
				{ path: '/admin/applyAnalysis/applyAnalysisSchool', component: resolve => require(['@/page/admin/apply/applyAnalysisSchool'], resolve)},
				{ path: '/admin/applyAnalysis/applyAnalysisApp', component: resolve => require(['@/page/admin/apply/applyAnalysisDetail'], resolve)},
				{ path: '/admin/applyAnalysis/applyAnalysisAppDetail', component: resolve => require(['@/page/admin/apply/applyAnalysisAppDetail'], resolve)},
				{ path: '/admin/applyAppInfo', component: resolve => require(['@/page/admin/apply/applyAppInfo'], resolve)},
				{ path: '/admin/userManager', component: resolve => require(['@/page/admin/users/userManager'], resolve)},
				{ path: '/admin/systemClass', component: resolve => require(['@/page/admin/system/systemClass'], resolve)},
				{ path: '/admin/systemTag', component: resolve => require(['@/page/admin/system/systemTag'], resolve)},
				{ path: '/admin/informationManagement', component: resolve => require(['@/page/admin/system/informationManagement'], resolve)},
				{ path: '/admin/systemDoc', component: resolve => require(['@/page/admin/system/systemDoc'], resolve)},
				{ path: '/admin/systemSchool', component: resolve => require(['@/page/admin/system/systemSchool'], resolve)},
			]
		},
		// 编辑API(管理员)
		{
			path: '/admin/editApi',
			component: resolve => require(['@/page/api/editApi'], resolve)
		},
		// API详情(管理员)
		{
			path: '/admin/apiDetail',
			component: resolve => require(['@/page/api/apiDetail'], resolve)
		},
		//文档
		{
			path: '/doc',
			component: resolve => require(['@/page/doc/doc'], resolve)
		},
		{
			path: '/doc/docDetail',
			component: resolve => require(['@/page/doc/docDetail'], resolve)
		},
		//个人中心
		{
			path: '/user',
			component: resolve => require(['@/page/user/user'], resolve),
			children: [
				{ path: '/user/personInfo',  component: resolve => require(['@/page/user/personInfo'], resolve) },
				{ path: '/user/personModify',  component: resolve => require(['@/page/user/personModify'], resolve) },
			],
		},
		{
			path: '/user/forgetPassword',
			component: resolve => require(['@/page/user/forgetPassword'], resolve)
        },
        {
			path: '/user/forgetPasswordStatus',
			component: resolve => require(['@/page/user/forgetPasswordStatus'], resolve)
		},
		{
			path: '/user/resultStatus',
			component: resolve => require(['@/page/user/resultStatus'], resolve)
		},
		{
			path: '/user/resetPsw',
			component: resolve => require(['@/page/user/resetPsw'], resolve)
		},
		{
			path: '/user/resetPswStatus',
			component: resolve => require(['@/page/user/resetPswStatus'], resolve)
		},
		{
			path: '/user/loginWay',
			component: resolve => require(['@/page/user/loginWay'], resolve)
		},
		{
			path: '/user/login',
			component: resolve => require(['@/page/user/login'], resolve)
		},
		{
			path: '/user/register',
			component: resolve => require(['@/page/user/register'], resolve)
		},
		{
			path: '/user/modifyPassword',
			component: resolve => require(['@/page/user/modifyPassword'], resolve)
        },
        // 注册用户,邮箱返回的地址
        {
            path: '/signup/verification',
            component: resolve => require(['@/page/user/emailReturn'], resolve)
        },
		//重定向
		{
			path: '/',
			redirect: '/index'
        },
        {
			path: '*',
			redirect: '/index'
		},

	]
})

// 判断登陆状态，调用IS_LOGIN
router.beforeEach((to, from, next) => {
	router.app.$options.store.dispatch('IS_LOGIN')
	next()
})

export default router



import Vue from 'vue'
import App from './App'
import router from './router'
import "babel-polyfill"
import store from './vuex/store'
import { Base64 } from 'js-base64'

// 自定义公共foot
import foot from './components/footComponent/index'
Vue.use(foot)

// 富文本框
import VueSummernote from 'vue-summernote'
require('bootstrap')
require('bootstrap/dist/css/bootstrap.min.css')
require('summernote/dist/summernote.css')
Vue.use(VueSummernote, { dialogsFade: true })

// iview
import iView from 'iview'
import 'iview/dist/styles/iview.css'
Vue.use(iView)

// 复制粘贴功能
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)

// 滚动
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
Vue.use(VueAwesomeSwiper, {})

// cookie
import VueCookies from 'vue-cookies'
Vue.use(VueCookies)


// axios  header统一配置
import axios from 'axios'
// axios请求超时
axios.defaults.timeout =  120000;
// 统一前置切面,增加设置Head头的鉴权信息
axios.interceptors.request.use(
config => {
	if (VueCookies.isKey('Authorization')) {
		// 每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token，不用每次请求都手动添加了
		config.headers.Authorization = VueCookies.get('Authorization')
	}
	return config
},
err => {
	return Promise.reject(err)
})


// 添加响应拦截器
axios.interceptors.response.use(
    function (response) {
    // 对响应数据做点什么
    return response
}, 
    function (error) {
    // 当调用接口异常时，统一都直接跳转到首页
    VueCookies.remove('Authorization')
    router.push('/')
})



Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
	el: '#app',
	store,
	router,
	components: { App },
	template: '<App/>'
})

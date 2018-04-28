import axios from 'axios'
import VueCookies from 'vue-cookies'

import {
    REGISTER,
    CHECK_COMPLEXITY,
    SEND_VERIFY_CODE,
    LOGIN,
    GET_VERIFY_CODE,
    LOGOUT,
    MODIFY_USER,
    RESET_PSW,
    FORGET_PSW,
    CHANGE_PSW,
    IS_LOGIN,
    IS_LOGIN_FAIL,
    ACTIVATION,

} from '../types'

const state = {
    complexity: {},
    verifyCodes: {},        //邮箱验证码
    dynanicCodes: {},       //图形验证码
    userInfo: {},
    // authUserInfo: {},
}

const mutations = {
    [SEND_VERIFY_CODE](state, object){
        state.verifyCodes = object
    },

    [GET_VERIFY_CODE](state, object){
        state.dynanicCodes = object
    },

    [IS_LOGIN](state, object){
        VueCookies.set('Authorization', object.authorization,'1d','/')
        state.userInfo = object
    },
    [IS_LOGIN_FAIL](state){
        state.userInfo = {}
    }
}

const actions = {
    
    //校外开发者注册
    async [REGISTER]({commit}, params) {
        const { data } = await axios.post('/rest/user/register', params)
        return new Promise((resolve, reject) => {
            if(data.resultCode == 0) {
                resolve(data.resultMessage)
            }
            else{
                reject(data.resultMessage)
            }
        })
    },

    //密码复杂度校验接口
    async [CHECK_COMPLEXITY]({commit}, params) {
        const { data } = await axios.post('/rest/user/checkComplexity', params)
        return new Promise((resolve, reject) => {
            if(data.resultCode == 0) {
                resolve(data.resultMessage)
            }
            else{
                reject(data.resultMessage)
            }
        })
    },

    //获取动态验证码
    async [SEND_VERIFY_CODE]({commit}, params) {
        const { data } = await axios.post('/rest/user/sendVerifyCode', params)
        if(data.resultCode == 0) {
            commit(SEND_VERIFY_CODE, data.datas)
        }
    },

    //用户登录
    async [LOGIN]({commit}, params) {
        // const { data } = await axios.post('/rest/user/login', params)
        const { data } = await axios({
            url: '/rest/user/login',
            headers: {'vCode': params.vCode},
            method: 'post',
            data: params,
        })
        return new Promise((resolve, reject) => {
            if(data.resultCode == 0) {
                resolve(data)
            }
            else{
                reject(data.resultMessage)
            }
        })
    },

    //获取图形验证码
    async [GET_VERIFY_CODE]({commit}, params) {
        const { data } = await axios.post('/rest/user/getVerifyCode', params)
        if(data.resultCode == 0) {
            commit(GET_VERIFY_CODE, data.datas)
        }
    },

    //登出
    async [LOGOUT]({commit}) {
        const { data } = await axios.post('/rest/user/logout')
        return new Promise((resolve, reject) => {
            if(data.resultCode == 0) {
                resolve(data.datas)
            }
            else{
                reject(data.resultMessage)
            }
        })
    },

    // 修改用户信息
    async [MODIFY_USER]({commit}, params) {
        const { data } = await axios.post('/rest/user/modifyUser', params)
        return new Promise((resolve, reject) => {
            if(data.resultCode == 0) {
                resolve(data.datas)
            }
            else{
                reject(data.resultMessage)
            }
        })
    },

    // 重置密码接口
    async [RESET_PSW]({commit}, params) {
        const { data } = await axios.post('/rest/user/resetPwd', params)
        return new Promise((resolve, reject) => {
            if(data.resultCode == 0) {
                resolve()
            }
            else{
                reject(data.resultMessage)
            }
        })
    },

    // 忘记密码 
    async [FORGET_PSW]({commit}, params) {
        const { data } = await axios.post('/rest/user/forgetPwd', params)
        return new Promise((resolve, reject) => {
            if(data.resultCode == 0) {
                resolve()
            }
            else{
                reject(data.resultMessage)
            }
        })
    },

    // 修改用户密码
    async [CHANGE_PSW]({commit}, params) {
        const { data } = await axios.post('/rest/user/changePwd', params)
        return new Promise((resolve, reject) => {
            if(data.resultCode == 0) {
                resolve()
            }
            else{
                reject(data.resultMessage)
            }
        })
    },
    
    // 判断登陆状态
    async [IS_LOGIN]({commit}) {
        const { data } = await axios.post('/rest/user/isLogin')
        if(data.resultCode == 0) {
            commit(IS_LOGIN, data.datas)
        }else{
            commit(IS_LOGIN_FAIL)
        }
    },
    
    // 激活用户接口 
    async [ACTIVATION]({commit}, params) {
        const { data } = await axios.post('/rest/user/activate', params)
        return new Promise((resolve, reject) => {
            if(data.resultCode == 0) {
                resolve(data.datas)
            }
            else{
                reject(data.resultMessage)
            }
        })
    },



}

export default {
    state, mutations, actions
}
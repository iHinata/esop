import axios from 'axios'
import {
    GET_All_PROVIDERS,
    CREATE_APP,
    GENERATE_APP_CODE,
    DELETE_APP,
    QUERY_APP_API,
    QUERY_APP_NOT_APPLY_API,
    ADD_APP_API,
    DELETE_APP_API,
    QUERY_APP_BY_API,
    GET_EMPTY_APPAPI,
} from '../types'

const state = {
    providerApps: [],   // 供API注册时使用的APP列表
    appCode: '',        // 自动生成的APPCode
    appApi: {},        // 查询APP下申请的API列表
    appNotApi: {},          // 查询APP下未申请的API
}

const mutations = {
    [GET_All_PROVIDERS](state, object){
        state.providerApps = object
    },
    [GENERATE_APP_CODE](state, string){
        state.appCode = string
    },
    [QUERY_APP_API](state, object){
        state.appApi = object
    },
    [QUERY_APP_NOT_APPLY_API](state, object){
        state.appNotApi = object
    },
    [QUERY_APP_BY_API](state, object){
        state.queryAppByApi = object
    },
    
}

const actions = {
    // 供API注册时使用的APP列表
    async [GET_All_PROVIDERS]({commit}, params) {
        const { data } = await axios.post('/rest/app/getAllProviders', params)
        return new Promise((resolve, reject) => {
            if(data.resultCode == 0) {
                resolve(data)
                commit(GET_All_PROVIDERS, data.datas)
            }
            else{
                reject(data.resultMessage)
            }
        })
    },

    // 创建APP的接口
    async [CREATE_APP]({commit}, params) {
        const { data } = await axios.post('/rest/app/user/createApp', params)
        return new Promise((resolve, reject) => {
            if(data.resultCode == 0) {
                resolve(data)
            }
            else{
                reject(data.resultMessage)
            }
        })
    },

    // 自动生成APPCode
    async [GENERATE_APP_CODE]({commit}, params) {
        const { data } = await axios.post('/rest/app/user/generateAppCode', params)
        return new Promise((resolve, reject) => {
            if(data.resultCode == 0) {
                resolve(data.datas)
                commit(GENERATE_APP_CODE, data.datas)
            }
            else{
                reject(data.resultMessage)
            }
        })
    },

    // 删除APP
    async [DELETE_APP]({commit}, params) {
        const { data } = await axios.post('/rest/app/user/deleteApp', params)
        return new Promise((resolve, reject) => {
            if(data.resultCode == 0) {
                resolve(data)
            }
            else{
                reject(data.resultMessage)
            }
        })
    },

    // 查询APP下申请的API列表
    async [QUERY_APP_API]({commit}, params) {
        const { data } = await axios.post('/rest/app/user/api/queryApplied', params)
        if(data.resultCode == 0) {
            commit(QUERY_APP_API, data.datas)
        }
    },
    // 返回一个空的API列表
    async [GET_EMPTY_APPAPI]({commit}, params) {
        const { data } = await axios.post('/rest/app/getEmptyAppApis', params )
        if(data.resultCode == 0){
            commit(QUERY_APP_API, data.datas)
        }
       
    },

    // 查询APP下申请的API列表
    async [QUERY_APP_NOT_APPLY_API]({commit}, params) {
        const { data } = await axios.post('/rest/app/user/api/queryNotApplied', params)
        if(data.resultCode == 0) {
            commit(QUERY_APP_NOT_APPLY_API, data.datas)
        }
    },

    // 查询APP下申请的API列表
    async [ADD_APP_API]({commit}, params) {
        const { data } = await axios.post('/rest/app/user/api/addApis', params)
        return new Promise((resolve, reject) => {
            if(data.resultCode == 0) {
                resolve(data)
            }
            else{
                reject(data.resultMessage)
            }
        })
    },

    // 删除APP下申请的API
    async [DELETE_APP_API]({commit}, params) {
        const { data } = await axios.post('/rest/app/user/api/deleteApis', params)
        return new Promise((resolve, reject) => {
            if(data.resultCode == 0) {
                resolve(data)
            }
            else{
                reject(data.resultMessage)
            }
        })
    },

    // 查询某个接入学校的APP的接入详情
    async [QUERY_APP_BY_API]({commit}, params) {
        const { data } = await axios.post('/rest/app/queryInvokeAppByApi', params)
        return new Promise((resolve, reject) => {
            if(data.resultCode == 0) {
                resolve(data.datas)
                commit(QUERY_APP_BY_API, data.datas)
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

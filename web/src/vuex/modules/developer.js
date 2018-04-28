import axios from 'axios'

import {
    QUERY_REGISTER_APIS,
    GET_API_COMMONINFO,
    CREATE_API,
    QUERY_REGISTER_APPS,
    DELETE_API,
    MODIFY_API,
    QUERY_ALL_SERVERS_WIDTH_REGISTER,

} from '../types'

const state = {
    applicationData: {},
    registerApis: {},   // 开发者注册的API列表
    allServersWidthRegister: {}, // 查询所有服务器列表
}

const mutations = {

    [QUERY_REGISTER_APPS](state, object){
        state.applicationData = object
    },

    [QUERY_REGISTER_APIS](state, object){
        state.registerApis = object
    },

    [QUERY_ALL_SERVERS_WIDTH_REGISTER](state, object){
        state.allServersWidthRegister = object
    },
}

const actions = {
    
    // 开发者查看注册的应用列表
    async [QUERY_REGISTER_APPS]({commit} ,params) {
        const { data } = await axios.post('/rest/app/user/queryRegisterApps',params)
        return new Promise((resolve, reject) => {
            if(data.resultCode == 0) {
                resolve(data.datas)
                commit(QUERY_REGISTER_APPS, data.datas)
            }
            else{
                reject(data.resultMessage)
            }
        })
    },

    // 查询开发者注册的API列表
    async [QUERY_REGISTER_APIS]({commit}, params) {
        const { data } = await axios.post('/rest/api/user/queryRegisterApis', params)
        if(data.resultCode == 0) {
            commit(QUERY_REGISTER_APIS, data.datas)
        }
    },

    // 根据API的部署URI获取API的公共信息
    async [GET_API_COMMONINFO]({commit}, params) {
        const { data } = await axios.post('/rest/api/user/getApiCommonInfo', params)
        return new Promise((resolve, reject) => {
            if(data.resultCode == 0) {
                resolve(data)
            }
            else{
                reject(data.resultMessage)
            }
        })
    },

    // 创建API
    async [CREATE_API]({commit}, params) {
        const { data } = await axios.post('/rest/api/user/register', params)
        return new Promise((resolve, reject) => {
            if(data.resultCode == 0) {
                resolve(data)
            }
            else{
                reject(data.resultMessage)
            }
        })
    },

    // 删除某个API
    async [DELETE_API]({commit}, params) {
        const { data } = await axios.post('/rest/api/user/delete', params)
        return new Promise((resolve, reject) => {
            if(data.resultCode == 0) {
                resolve(data)
            }
            else{
                reject(data.resultMessage)
            }
        })
    },

    // 修改API信息
    async [MODIFY_API]({commit}, params) {
        const { data } = await axios.post('/rest/api/user/modifyApi', params)
        return new Promise((resolve, reject) => {
            if(data.resultCode == 0) {
                resolve(data)
            }
            else{
                reject(data.resultMessage)
            }
        })
    },

    // 查询所有服务器列表
    async [QUERY_ALL_SERVERS_WIDTH_REGISTER]({commit}, params) {
        const { data } = await axios.post('/rest/server/queryAllServersWithRegister', params)
        if(data.resultCode == 0) {
            commit(QUERY_ALL_SERVERS_WIDTH_REGISTER, data.datas)
        }
    },



}

export default {
    state, mutations, actions
}
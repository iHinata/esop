import axios from 'axios'

import {
    GET_BIND_SERVER,
    ADD_SERVER,
    GET_UNBIND_SERVER,
} from '../types'

const state = {
    bindServer: {},
    unBindServer: {},
}

const mutations = {

    [GET_BIND_SERVER](state, object){
        state.bindServer = object
    },

    [GET_UNBIND_SERVER](state, object){
        state.unBindServer = object
    },

}

const actions = {
    // 供API注册时使用的APP列表
    async [GET_BIND_SERVER]({commit}, params) {
        const { data } = await axios.post('/rest/server/getBindServer', params)
        if(data.resultCode == 0) {
            commit(GET_BIND_SERVER, data.datas)
        }
    },

    async [ADD_SERVER]({commit}, params) {
        const { data } = await axios.post('/rest/server/addServer', params)
        return new Promise((resolve, reject) => {
            if(data.resultCode == 0) {
                resolve(data)
            }
            else{
                reject(data.resultMessage)
            }
        })
    },
    // 查询还未被绑定的服务器列表
    async [GET_UNBIND_SERVER]({commit}, params) {
        const { data } = await axios.post('rest/server/getUnBindServer', params)
        if(data.resultCode == 0) {
            commit(GET_UNBIND_SERVER, data.datas)
        }
    },
    
    
    

    
    
}

export default {
    state, mutations, actions
} 
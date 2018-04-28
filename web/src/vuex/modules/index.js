import axios from 'axios'
import {
    GET_CUSTOM_INFO,
    GET_FIRST_CLASS,
    GET_CHILD_CLASS,
} from '../types'

const state = {
    firstClass: [],
    childClass: {},
}

const mutations = {

    [GET_FIRST_CLASS](state, array){
        state.firstClass = array
    },
    
    [GET_CHILD_CLASS](state, object){
        state.childClass = object
    },
}

const actions = {
    
    //个性化信息获取接口
    async [GET_CUSTOM_INFO]({commit}) {
        const { data } = await axios.get('/rest/dic/custom/getCustomInfo')
        if(data.resultCode == 0) {
            return new Promise(resolve => {
                resolve(data.datas)
            })
        }
    },

    //获取一级分类
    async [GET_FIRST_CLASS]({commit}, params) {
        const { data } = await axios.post('/rest/dic/class/getFirstClass', params)
        if(data.resultCode == 0) {
            commit(GET_FIRST_CLASS, data.datas)
            return new Promise(resolve => {
                resolve(data.datas)
            })
        }
    },
    
    //获取二级分类
    async [GET_CHILD_CLASS]({commit}, params) {
        const { data } = await axios.post('/rest/dic/class/getChildClasses', params)
        if(data.resultCode == 0) {
            commit(GET_CHILD_CLASS, data.datas)
            return new Promise(resolve => {
                resolve(data.datas)
            })
        }
    },

}

export default {
    state, mutations, actions
}
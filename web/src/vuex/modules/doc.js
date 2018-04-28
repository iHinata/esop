import axios from 'axios'
import {
    QUERY_CLASS_TREE,
    QUERY_LABEL,
    GET_DOCUMENT_DETAIL,
} from '../types'

const state = {
    classTrees: [],   // 供下拉API分类使用
    apiLabels: [],    // 供下拉使用的标签列表
}

const mutations = {
    [QUERY_CLASS_TREE](state, object){
        state.classTrees = object
    },
    [QUERY_LABEL](state, object){
        state.apiLabels = object.datas
    },
}

const actions = {
    // 供下拉API分类使用
    async [QUERY_CLASS_TREE]({commit}, params) {
        const { data } = await axios.post('/rest/dic/class/queryClassTree', params)
        if(data.resultCode == 0) {
            commit(QUERY_CLASS_TREE, data.datas)
        }
    },

    // 查询所有可以使用的标签
    async [QUERY_LABEL]({commit}, params) {
        const { data } = await axios.post('/rest/dic/label/queryLabel', params)
        if(data.resultCode == 0) {
            commit(QUERY_LABEL, data.datas)
        }
    },
    
    // 根据文档ID获取文档详情
    async [GET_DOCUMENT_DETAIL]({commit}, params) {
        const { data } = await axios.post('/rest/dic/document/visitor/getDocumentDetail', params)
        return new Promise((resolve, reject) => {
            if(data.resultCode == 0) {
                resolve(data.datas)
            }else {
                reject(data.resultMessage)
            }
        })
    },
    
}

export default {
    state, mutations, actions
}
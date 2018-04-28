import axios from 'axios'
import {
    GET_API_DETAIL,
    GET_API_LIST_BY_CLASS_ID,
    GET_VISITOR_API_DETAIL,
    SEARCH_API,
    QUERY_API_CALL_SCHOOLS,
    DELETE_API_METHODS,
    GET_APIINFO,

} from '../types'

const state = {
    api: {},
    searchApi: {},
    schools: {total: 0, datas: []},
    getApiDetail: {},
    visitorApiDetail: {},
    apiInfo: {}
}

const mutations = {

    
    [GET_API_LIST_BY_CLASS_ID](state, object) {
        state.api = object
    },

    
    [SEARCH_API](state, object) {
        state.searchApi = object
    },

    [QUERY_API_CALL_SCHOOLS](state, payload) {
        state.schools.total = payload.total || 0
        state.schools.datas = payload.datas || []
    },

    [GET_API_DETAIL](state, object){
        state.getApiDetail = object
    },
    [GET_VISITOR_API_DETAIL](state, object){
        state.visitorApiDetail = object
    },
    [GET_APIINFO](state,object){
        state.apiInfo = object
    },
}

const actions = {
    // 查看API详细信息，包含审核信息(开发者)
    async [GET_API_DETAIL]({commit} ,params) {
        const { data } = await axios.post('/rest/api/user/getApiDetail',params)
        if(data.resultCode == 0) {
            commit(GET_API_DETAIL, data.datas )
            return new Promise(resolve => {
                resolve(data.datas)
            })
        }
    },
    // 根据分类ID查询对应的API列表
    async [GET_API_LIST_BY_CLASS_ID]({commit} ,params) {
        const { data } = await axios.post('/rest/api/visitor/getApiListByClassId',params)
        if(data.resultCode == 0) {
            commit(GET_API_LIST_BY_CLASS_ID, data.datas)
        }
    },

    // 查看API详细信息(游客)
    async [GET_VISITOR_API_DETAIL]({commit} ,params) {
        const { data } = await axios.post('/rest/api/visitor/getApiDetail',params)
        if(data.resultCode == 0) {
            commit(GET_VISITOR_API_DETAIL, data.datas )
            return new Promise(resolve => {
                resolve(data.datas)
            })
        }
    },
    // 搜索接口(游客)
    async [SEARCH_API]({commit} ,params) {
        const { data } = await axios.post('/rest/api/visitor/search',params)
        if(data.resultCode == 0) {
            commit(SEARCH_API, data.datas)
        }
    },
    // 
    async [QUERY_API_CALL_SCHOOLS]({commit}, params) {
        const { data } = await axios.post('/rest/api/monitor/queryApiSchoolMonitor', params)
        if (data.resultCode == 0) {
            commit(QUERY_API_CALL_SCHOOLS, data.datas);
        }
    },

    // 删除api方法
    async [DELETE_API_METHODS]({commit}, params) {
        const { data } = await axios.post('/rest/api/user/deleteApiMethod', params)
        return new Promise((resolve,reject) => {
            if (data.resultCode == 0) {
                resolve()
            }
            else{
                reject()
            }
        })
    },
    async [GET_APIINFO]({commit}, params) {
        const { data } = await axios.post('/rest/api/manager/getApiInfo', params)
        if(data.resultCode == 0) {
            commit(GET_APIINFO, data.datas )
            return new Promise(resolve => {
                resolve(data.datas)
            })
        }
    },
    
}

export default {
    state, mutations, actions
}

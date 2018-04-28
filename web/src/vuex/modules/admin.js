import axios from 'axios'
import {
    QUERY_USER,
    CHANGE_AUTO_CHECK,
    DELETE_USER,
    GRANT_USER_TO_MANAGER,
    QUERY_CLASSES,
    GET_SCHOOL_INFO,
    SAVE_SCHOOL_INFO,
    GET_CLASS_DETAIL,
    DELETE_CLASS,
    QUERY_LABELS,
    ADD_LABELS,
    MODIFY_LABEL,
    DELETE_LABELS,
    QUERY_TEMPLATE,
    MODIFY_TEMPLATE,
    GET_MANAGE_DOCUMENT_DETAIL,
    GET_TEMPLATE_DETAIL,
    QUERY_DOCUMENTS,
    ADD_DOCUMENT_DETAIL,
    MODIFY_DOCMENT,
    QUERY_CLASS,
    DELETE_DOCUMENT,
    QUERY_APIS,
    GET_API_BASIC_INFO,
    AUDIT_API,
    QUERY_SERVERS,
    ADD_SERVERS,
    DELETE_SERVERS,
    SWITCH_API,
    NOT_AUDITED_APP,
    QUERY_PROVIDE_APPS,
    QUERY_BINDED_SERVERS,
    BIND_SERVERS,
    NOT_AUDITED_APP_API,
    AUDIT_APPLY_API,
    AUDITED_APP,
    AUDITED_APP_API,
    QUERY_ASCCESSED_SCHOOLS,
    QUERY_APPS_ASCCESSED_SCHOOLS,
    ALLOW_ACCESSED_APPS,
    SCHOOL_APP_DETAIL,
    ACCESS_SCHOOL,
    REACCESS_SCHOOL,
    SYNC_DATA,
    QUERY_SCHOOL_INFOS,
    GET_SCHOOL_BY_ID,
    QUERY_APP_INFOS,
    MODIFY_APP_INFOS,
    GET_APPINFO_DETAIL,
    TOP10_MONITOR,
    QUERY_API_MONITOR,
    API_MONITOR_DAY_DETAIL,
    API_MONITOR_DETAIL,
    SAVE_CLASS,
    QUERY_CURRENTLEVEL_CLASS,
    GET_CURRENT_CLASS_DETAIL,
    GET_USER_INFO,
    GET_DOCUMENT_CLASS_LIST,
    QUERY_ALL_DEVELOPER,
    QUERY_ALL_SCHOOLINFOS,
    GET_BOUND_SERVER_LIST,
    QUERY_API_APP_MONITOR,
    GET_EMPTY_APPAPI,

} from '../types'



const state = {
    userList: {},       // 开发者列表信息
    schoolInfo: {},     // 学校信息
    schoolInfos: [],    // 所有学校列表
    systemClass: {},    // 系统分类
    labels: {},         // 系统标签列表
    templateList: [],   // 邮件模板列表
    templateDetail: {},  // 邮件模板详情
    documentList: [],   // 管理员查询文档列表
    classList: [],      // 查询文档分类列表(下拉菜单)
    queryApis: {},      // 管理员查询当前所有API列表
    apiBasicInfo: {},   // 管理员在审核界面查看API基本信息
    servers: {},        // 服务器列表
    notAuditedApp: {},  // 查看待审核的APP列表
    queryProvideApps:{},// 查询提供服务的应用列表
    notAuditedAppApi:{},// 查看某个待审核APP下的API列表
    auditedApp: {},     // 查看已经审核的APP列表
    auditedAppApi: {},  // 查看已经审核APP下的API列表
    accessedSchools: {},// 查询每个学校接入的应用的数量
    appAccessedSchools: {}, //查询某个学校已经接入的应用列表
    allowAccessedApp: {},// 查询允许接入学校的应用列表
    schoolAppDetail: {},//查询某个接入学校的APP的接入详情
    schoolInfos: {},      // 查询所有学校列表
    appInfo: {},        // 查询系统中提供的APP列表
    top10: {},          // 查询Top10的接口调用情况
    queryApiMonitor: {},// 查询API调用结果列表
    adiMonitorDayDetail: {}, //云端某个API被APP调用的详情
    adiMonitorDetail: {},// 校内某个API被APP调用的详情
    boundServers: {}, // 查询已经绑定的服务器列表
    queryApiAppMonitor: {},  // API被APP调用统计的结果集
}



const mutations = {

    [QUERY_USER](state, object) {
        state.userList = object
    },
    [QUERY_CLASSES](state, object) {
        state.systemClass = object
    },
    [QUERY_SCHOOL_INFOS](state, object) {
        state.schoolInfos = object
    },
    [QUERY_LABELS](state, object) {
        state.labels = object
    },
    [QUERY_TEMPLATE](state, array){
        state.templateList = array
    },
    [QUERY_DOCUMENTS](state, array){
        state.documentList = array
    },
    [QUERY_CLASS](state, array){
        state.classList = array
    },
    [QUERY_APIS](state, object){
        state.queryApis = object
    },
    [QUERY_SERVERS](state, object){
        state.servers = object
    },
    [NOT_AUDITED_APP](state, object){
        state.notAuditedApp = object
    },
    [QUERY_PROVIDE_APPS](state, object){
        state.queryProvideApps = object
    },

    [NOT_AUDITED_APP_API](state, object){
        state.notAuditedAppApi = object
    },
    [AUDITED_APP](state, object){
        state.auditedApp = object
    },
    [AUDITED_APP_API](state, object){
        state.auditedAppApi = object
    },
    [QUERY_ASCCESSED_SCHOOLS](state, object){
        state.accessedSchools = object
    },
    [QUERY_APPS_ASCCESSED_SCHOOLS](state, object){
        state.appAccessedSchools = object
    },
    [ALLOW_ACCESSED_APPS](state, object){
        state.allowAccessedApp = object
    },
    [SCHOOL_APP_DETAIL](state, object){
        state.schoolAppDetail = object
    },
    [QUERY_APP_INFOS](state, object){
        state.appInfo = object
    },
    [TOP10_MONITOR](state, object){
        state.top10 = object
    },
    [QUERY_API_MONITOR](state, object){
        state.queryApiMonitor = object
    },
    [API_MONITOR_DAY_DETAIL](state, object){
        state.adiMonitorDayDetail = object
    },
    [API_MONITOR_DETAIL](state, object){
        state.adiMonitorDetail = object
    },
    [QUERY_ALL_SCHOOLINFOS](state, array){
        state.schoolInfos = array
    },
    [GET_BOUND_SERVER_LIST](state, object){
        state.boundServers = object
    },
    [QUERY_API_APP_MONITOR](state, object){
        state.queryApiAppMonitor = object
    },
    
}



const actions = {

    // 查询系统中所有开发者列表
    async [QUERY_USER]({commit}, params) {
        const { data } = await axios.post('/rest/user/manager/queryUsers',params )
        if(data.resultCode == 0) {
            commit(QUERY_USER, data.datas)
        }else{
            reject(data.resultMessage)
        }
    },

    // 管理员可以将某个开发者设置为自动审核或收回
    async [CHANGE_AUTO_CHECK]({commit}, params) {
        const { data } = await axios.post('/rest/user/manager/changeAotoAuditRole',params )
        return new Promise((resolve, reject) => {
            if(data.resultCode == 0) {
                resolve()
            }
            else {
                reject(data.resultMessage)
            }
        })
    },

    // 删除校外用户
    async [DELETE_USER]({commit}, params) {
        const { data } = await axios.post('/rest/user/manager/deleteUser',params )
        return new Promise((resolve, reject) => {
            if(data.resultCode == 0) {
                resolve()
            }
            else {
                reject(data.resultMessage)
            }
        })
    },
    // 获取单个用户信息
    async [GET_USER_INFO]({commit}, params) {
        const { data } = await axios.post('/rest/user/manager/getUserInfo',params )
        return new Promise(resolve => {
            if(data.resultCode == 0) {
                resolve(data.datas)
            }
        })
    },
    

    // 超级管理员将某个开发者设置为管理员或收回
    async [GRANT_USER_TO_MANAGER]({commit}, params) {
        const { data } = await axios.post('/rest/user/manager/grantUserToManager',params )
        return new Promise((resolve, reject) => {
            if(data.resultCode == 0) {
                resolve()
            }
            else {
                reject(data.resultMessage)
            }
        })
    },

    // 查询分类列表（管理界面使用）
    async [QUERY_CLASSES]({commit}, params) {
        const { data } = await axios.post('/rest/dic/class/manager/queryClasses', params )
        if(data.resultCode == 0) {
            commit(QUERY_CLASSES, data.datas)
            return new Promise(resolve => {
                resolve()
            })
        }
    },

    // 查询学校列表
    async [GET_SCHOOL_INFO]({commit}) {
        const { data } = await axios.get('/rest/dic/school/manager/getSchoolInfo' )
        return new Promise((resolve, reject) => {
            if(data.resultCode == 0) {
                resolve(data.datas)
            }
            else {
                reject(data.resultMessage)
            }
        })
    },
    // 查询所有学校列表
    async [QUERY_ALL_SCHOOLINFOS]({commit}) {
        const { data } = await axios.get('/rest/dic/school/manager/queryAllSchoolInfos' )
        if(data.resultCode == 0) {
            commit(QUERY_ALL_SCHOOLINFOS, data.datas)
        }
    },

    // 根据学校ID查询学校信息
    async [GET_SCHOOL_BY_ID]({commit} , params) {
        const { data } = await axios.post('/rest/dic/school/manager/getSchoolInfoById', params)
        return new Promise((resolve, reject) => {
            if(data.resultCode == 0) {
                resolve(data.datas)
            }
            else {
                reject(data.resultMessage)
            }
        })
    },
    // 查询所有学校
    async [QUERY_SCHOOL_INFOS]({commit}, params) {
        const { data } = await axios.post('/rest/dic/school/manager/querySchoolInfos', params)
        if(data.resultCode == 0) {
            commit(QUERY_SCHOOL_INFOS, data.datas)
        }
    },
    
    // 查询学校列表
    async [GET_CLASS_DETAIL]({commit}, params) {
        const { data } = await axios.post('/rest/dic/class/manager/getClassDetail', params )
        return new Promise((resolve, reject) => {
            if(data.resultCode == 0) {
                resolve(data.datas)
            }
            else {
                reject(data.resultMessage)
            }
        })
    },
    // 保存学校信息
    async [SAVE_SCHOOL_INFO]({commit}, params) {
        const { data } = await axios.post('/rest/dic/school/manager/addSchool', params )
        return new Promise((resolve, reject) => {
            if(data.resultCode == 0) {
                resolve()
            }
            else {
                reject(data.resultMessage)
            }
        })
    },

    // 同步数据
    async [SYNC_DATA]({commit}, params) {
        const { data } = await axios.post('/rest/dic/school/manager/syncData', params )
        return new Promise((resolve, reject) => {
            if(data.resultCode == 0) {
                resolve()
            }
            else {
                reject(data.resultMessage)
            }
        })
    },
    // 删除分类
    async [DELETE_CLASS]({commit}, params) {
        const { data } = await axios.post('/rest/dic/class/manager/deleteClass', params )
        return new Promise((resolve, reject) => {
            if(data.resultCode == 0) {
                resolve()
            }
            else {
                reject(data.resultMessage)
            }
        })
    },
    // 获取当前层级的分类列表
    async [QUERY_CURRENTLEVEL_CLASS]({commit}, params) {
        const { data } = await axios.post('/rest/dic/class/manager/getCurrentLevelClass', params )
        return new Promise((resolve, reject) => {
            if(data.resultCode == 0) {
                resolve(data.datas)
            }
            else {
                reject(data.resultMessage)
            }
        })
    },
    
    async [GET_CURRENT_CLASS_DETAIL]({commit}, params) {
        const { data } = await axios.post('/rest/dic/class/manager/getCurrentClassDetail', params )
        return new Promise((resolve, reject) => {
            if(data.resultCode == 0) {
                resolve(data.datas)
            }
            else {
                reject(data.resultMessage)
            }
        })
    },
    
    // 保存分类
    async [SAVE_CLASS]({commit}, params) {
        const { data } = await axios.post('/rest/dic/class/manager/addClass', params )
        return new Promise((resolve, reject)  => {
            if(data.resultCode == 0) {
                resolve(data.datas)
            }else {
                reject(data.resultMessage)
            }
        })
    },
    // 查询标签列表（管理界面使用）
    async [QUERY_LABELS]({commit}, params) {
        const { data } = await axios.post('/rest/dic/label/manager/queryLabels', params )
        if(data.resultCode == 0) {
            commit(QUERY_LABELS, data.datas)
        }
    },

    // 新增标签
    async [ADD_LABELS]({commit}, params) {
        const { data } = await axios.post('/rest/dic/label/manager/addLabel', params )
        return new Promise((resolve, reject) => {
            if(data.resultCode == 0) {
                resolve()
            }
            else {
                reject(data.resultMessage)
            }
        })
    },
    // 修改标签
    async [MODIFY_LABEL]({commit},params){
        const { data } = await axios.post('/rest/dic/label/manager/modifyLabel', params )
        return new Promise((resolve, reject) => {
            if(data.resultCode == 0) {
                resolve()
            }
            else {
                reject(data.resultMessage)
            }
        })
    },

    // 删除标签
    async [DELETE_LABELS]({commit}, params) {
        const { data } = await axios.post('/rest/dic/label/manager/deleteLabel', params )
        return new Promise((resolve, reject) => {
            if(data.resultCode == 0) {
                resolve()
            }
            else {
                reject(data.resultMessage)
            }
        })
    },

    // 查询系统中配置的所有邮件模板
    async [QUERY_TEMPLATE]({commit}, params) {
        const { data } = await axios.post('/rest/dic/emailTemplate/manager/queryTemplate', params )
        if(data.resultCode == 0) {
            commit(QUERY_TEMPLATE, data.datas.datas)
        }
    },

    // 修改邮件模板内容
    async [MODIFY_TEMPLATE]({commit}, params) {
        const { data } = await axios.post('/rest/dic/emailTemplate/manager/modifyTemplate', params )
        return new Promise((resolve, reject) => {
            if(data.resultCode == 0) {
                resolve()
            }else {
                reject(data.resultMessage)
            }
        })
    },
    // 查询邮件模板详情
    async [GET_TEMPLATE_DETAIL]({commit},params){
        const { data } = await axios.post('/rest/dic/emailTemplate/manager/getTemplateDetail', params )
        return new Promise((resolve, reject) => {
            if(data.resultCode == 0) {
                resolve(data.datas)
            }else {
                reject(data.resultMessage)
            }
        })
    },

    // 查询文档分类列表
    async [QUERY_DOCUMENTS]({commit}, params) {
        const { data } = await axios.post('/rest/dic/document/manager/queryDocuments', params )
        if(data.resultCode == 0) {
            commit(QUERY_DOCUMENTS, data.datas)
        }
    },
    // 游客中心查询文档列表
    async [GET_DOCUMENT_CLASS_LIST]({commit}, params) {
        const { data } = await axios.post('/rest/dic/document/visitor/getDocumentClassList', params )
        if(data.resultCode == 0) {
            commit(QUERY_DOCUMENTS, data.datas)
        }
    },

    // 查询文档分类列表
    async [ADD_DOCUMENT_DETAIL]({commit}, params) {
        const { data } = await axios.post('/rest/dic/document/manager/addDocumentDetail', params )
        return new Promise(resolve => {
            if(data.resultCode == 0) {
                resolve()
            }
        })
    },

    // 查询文档分类列表  
    async [QUERY_CLASS]({commit}, params) {
        const { data } = await axios.post('/rest/dic/document/manager/queryClass', params )
        if(data.resultCode == 0) {
            commit(QUERY_CLASS, data.datas)
        }
    },
    
    // 查询文档分类列表
    async [DELETE_DOCUMENT]({commit}, params) {
        const { data } = await axios.post('/rest/dic/document/manager/deleteDocumentDetail', params )
        return new Promise((resolve, reject) => {
            if(data.resultCode == 0) {
                resolve()
            }else{
                reject(data.resultMessage)
            }
        })
    },

    // 查询文档详情
    async [GET_MANAGE_DOCUMENT_DETAIL] ({commit}, params) {
        const { data } = await axios.post('/rest/dic/document/manager/getDocumentDetail', params )
        return new Promise(resolve => {
            if(data.resultCode == 0) {
                resolve(data.datas)
            }
        })
    },
    // 修改文档
    async [MODIFY_DOCMENT]({commit}, params) {
        const { data } = await axios.post('/rest/dic/document/manager/modifyDocumentDetail', params )
        return new Promise((resolve, reject) => {
            if(data.resultCode == 0) {
                resolve()
            }else{
                reject(data.resultMessage)
            }
        })
    },

    // 管理员查询当前所有API列表
    async [QUERY_APIS]({commit}, params) {
        const { data } = await axios.post('/rest/api/manager/queryApis', params )
        if(data.resultCode == 0) {
            commit(QUERY_APIS, data.datas)
        }
    },
    
    // 管理员查询当前所有API列表
    async [GET_API_BASIC_INFO]({commit}, params) {
        const { data } = await axios.post('/rest/api/manager/getApiBasicInfo', params )
        if(data.resultCode == 0) {
            return new Promise(resolve => {
                resolve(data.datas)
            })
        }
    },

    // 管理员对API进行审核
    async [AUDIT_API]({commit}, params) {
        const { data } = await axios.post('/rest/api/manager/auditApi', params )
        return new Promise((resolve, reject) => {
            if(data.resultCode == 0) {
                resolve()
            }
            else {
                reject(data.resultMessage)
            }
        })
    },

    // 管理员查询当前所有API列表
    async [QUERY_SERVERS]({commit}, params) {
        const { data } = await axios.post('/rest/server/queryServers', params )
        if(data.resultCode == 0) {
            commit(QUERY_SERVERS, data.datas)
        }
    },
    
    // 开启或关闭API
    async [SWITCH_API]({commit}, params) {
        const { data } = await axios.post('/rest/api/manager/switchApi', params )
        return new Promise((resolve, reject) => {
            if(data.resultCode == 0) {
                resolve()
            }
            else {
                reject(data.resultMessage)
            }
        })
    },

    // 新增服务器
    async [ADD_SERVERS]({commit}, params) {
        const { data } = await axios.post('/rest/server/addServer', params )
        return new Promise((resolve, reject) => {
            if(data.resultCode == 0) {
                resolve()
            }
            else {
                reject(data.resultMessage)
            }
        })
    },
    
    // 删除服务器
    async [DELETE_SERVERS]({commit}, params) {
        const { data } = await axios.post('/rest/server/deleteServer', params )
        return new Promise((resolve, reject) => {
            if(data.resultCode == 0) {
                resolve()
            }
            else {
                reject(data.resultMessage)
            }
        })
    },

    // 查看待审核的APP列表
    async [NOT_AUDITED_APP]({commit}, params) {
        const { data } = await axios.post('/rest/app/manager/queryPendingAuditedApps', params )
        return new Promise((resolve, reject) => {
            if(data.resultCode == 0) {
                resolve(data.datas)
                commit(NOT_AUDITED_APP, data.datas)
            }
            else {
                reject(data.resultMessage)
            }
        })
    },

    // 查询提供服务的应用列表
    async [QUERY_PROVIDE_APPS]({commit}, params) {
        const { data } = await axios.post('/rest/server/queryProvideApps', params )
        if(data.resultCode == 0) {
            commit(QUERY_PROVIDE_APPS, data.datas)
        }
    },
    

    // 查询app下的服务器列表
    async [QUERY_BINDED_SERVERS]({commit}, params) {
        const { data } = await axios.post('/rest/server/queryBindedServers', params )
        if(data.resultCode == 0) {
            return new Promise(resolve => {
                resolve(data.datas)
            })
        }
    },


    // 给应用绑定服务器
    async [BIND_SERVERS]({commit}, params) {
        const { data } = await axios.post('/rest/server/bindServers', params )
        return new Promise((resolve, reject) => {
            if(data.resultCode == 0) {
                resolve()
            }
            else {
                reject(data.resultMessage)
            }
        })
    },

    // 查看某个待审核APP下的API列表
    async [NOT_AUDITED_APP_API]({commit}, params) {
        const { data } = await axios.post('/rest/app/manager/queryPendingAuditedAppDetail', params )
        if(data.resultCode == 0) {
            commit(NOT_AUDITED_APP_API, data.datas)
        }
    },
    // 返回一个空的API列表
    async [GET_EMPTY_APPAPI]({commit}, params) {
        const { data } = await axios.post('/rest/app/getEmptyAppApis', params )
        if(data.resultCode == 0){
            commit(NOT_AUDITED_APP_API, data.datas)
            commit(AUDITED_APP_API, data.datas)
        }
       
    },
    
    // 对APP下申请使用的API进行审核
    async [AUDIT_APPLY_API]({commit}, params) {
        const { data } = await axios.post('/rest/app/manager/auditApplyApis', params )
        return new Promise((resolve, reject) => {
            if(data.resultCode == 0) {
                resolve()
            }
            else {
                reject(data.resultMessage)
            }
        })
    },

    // 查看已经审核的APP列表
    async [AUDITED_APP]({commit}, params) {
        const { data } = await axios.post('/rest/app/manager/queryAlreadyAuditedApps', params )
        if(data.resultCode == 0) {
            commit(AUDITED_APP, data.datas)
            return new Promise(resolve => {
                resolve(data.datas)
            })
        }
    },

    // 查看已经审核APP下的API列表
    async [AUDITED_APP_API]({commit}, params) {
        const { data } = await axios.post('/rest/app/manager/queryAlreadyAuditedAppDetail', params )
        if(data.resultCode == 0) {
            commit(AUDITED_APP_API, data.datas)
        }
    },

    // 查看已经审核APP下的API列表
    async [QUERY_ASCCESSED_SCHOOLS]({commit}, params) {
        const { data } = await axios.post('/rest/app/manager/queryAccessedSchools' , params)
        if(data.resultCode == 0) {
            commit(QUERY_ASCCESSED_SCHOOLS, data.datas)
        }
    },

    // 查看已经审核APP下的API列表
    async [QUERY_APPS_ASCCESSED_SCHOOLS]({commit}, params) {
        const { data } = await axios.post('/rest/app/manager/queryAppsAccessedSchools' , params)
        if(data.resultCode == 0) {
            commit(QUERY_APPS_ASCCESSED_SCHOOLS, data.datas)
        }
    },

    // 查询允许接入学校的应用列表
    async [ALLOW_ACCESSED_APPS]({commit}, params) {
        const { data } = await axios.post('/rest/app/manager/queryAllowAccessApps' , params)
        if(data.resultCode == 0) {
            commit(ALLOW_ACCESSED_APPS, data.datas)
        }
    },
    
    // 查询某个接入学校的APP的接入详情
    async [SCHOOL_APP_DETAIL]({commit}, params) {
        const { data } = await axios.post('/rest/app/manager/queryAccessSchoolAppDetail' , params)
        if(data.resultCode == 0) {
            commit(SCHOOL_APP_DETAIL, data.datas)
        }
    },

    // 将一组APP接入学校
    async [ACCESS_SCHOOL]({commit}, params) {
        const { data } = await axios.post('/rest/app/manager/accessShool', params )
        return new Promise((resolve, reject) => {
            if(data.resultCode == 0) {
                resolve()
            }
            else {
                reject(data.resultMessage)
            }
        })
    },

    // 将某个APP重新接入学校
    async [REACCESS_SCHOOL]({commit}, params) {
        const { data } = await axios.post('/rest/app/manager/reAccessSchool', params )
        return new Promise((resolve, reject) => {
            if(data.resultCode == 0) {
                resolve()
            }
            else {
                reject(data.resultMessage)
            }
        })
    },
    
    // 查询系统中提供的APP列表
    async [QUERY_APP_INFOS]({commit}, params) {
        const { data } = await axios.post('/rest/appinfo/manage/queryAppInfos' , params)
        if(data.resultCode == 0) {
            commit(QUERY_APP_INFOS, data.datas)
        }
    },


    // 修改APP基本信息
    async [MODIFY_APP_INFOS]({commit}, params) {
        const { data } = await axios.post('/rest/appinfo/manage/modifyAppInfo', params )
        return new Promise((resolve, reject) => {
            if(data.resultCode == 0) {
                resolve()
            }
            else {
                reject(data.resultMessage)
            }
        })
    },
    // 获取APP详细信息
    async [GET_APPINFO_DETAIL]({commit}, params) {
        const { data } = await axios.post('/rest/appinfo/manage/getAppInfoDetail', params )
        return new Promise((resolve, reject) => {
            if(data.resultCode == 0) {
                resolve(data.datas)
            }
            else {
                reject(data.resultMessage)
            }
        })
    },
    // 查询系统中所有开发者
    async [QUERY_ALL_DEVELOPER]({commit}, params) {
        const { data } = await axios.post('/rest/appinfo/manage/queryAllDeveloper', params )
        return new Promise((resolve, reject) => {
            if(data.resultCode == 0) {
                resolve(data.datas.datas)
            }
            else {
                reject(data.resultMessage)
            }
        })
    },

    // 查询Top10的接口调用情况
    async [TOP10_MONITOR]({commit}, params) {
        const { data } = await axios.post('/rest/api/monitor/queryTop10Monitor' , params)
        if(data.resultCode == 0) {
            commit(TOP10_MONITOR, data.datas)
        }
    },

    // 查询API调用结果列表
    async [QUERY_API_MONITOR]({commit}, params) {
        const { data } = await axios.post('/rest/api/monitor/queryApiMonitor' , params)
        if(data.resultCode == 0) {
            commit(QUERY_API_MONITOR, data.datas)
        }
    },
    
    // 云端某个API被APP调用的详情
    async [API_MONITOR_DAY_DETAIL]({commit}, params) {
        const { data } = await axios.post('/rest/api/monitor/queryApiMonitorDayDetail' , params)
        if(data.resultCode == 0) {
            commit(API_MONITOR_DAY_DETAIL, data.datas)
        }
    },
    
    // 校内某个API被APP调用的详情
    async [API_MONITOR_DETAIL]({commit}, params) {
        const { data } = await axios.post('/rest/api/monitor/queryApiMonitorDetail' , params)
        if(data.resultCode == 0) {
            commit(API_MONITOR_DETAIL, data.datas)
        }
    },
    // 查询某个API被APP调用的明细
    async [QUERY_API_APP_MONITOR]({commit}, params) {
        const { data } = await axios.post('/rest/api/monitor/queryApiAppMonitor' , params)
        if(data.resultCode == 0) {
            commit(QUERY_API_APP_MONITOR, data.datas)
        }
    },

    // 查询已经绑定的服务器列表
    async [GET_BOUND_SERVER_LIST]({commit}, params) {
        const { data } = await axios.post('/rest/server/getBoundServerList' , params)
        if(data.resultCode == 0) {
            commit(GET_BOUND_SERVER_LIST, data.datas)
            return new Promise(resolve => {
                resolve(data.datas)
            })
        }
    },

    
}


export default {
    state, mutations, actions
}

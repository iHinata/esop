//校外开发者注册
export const REGISTER = 'REGISTER'
//密码复杂度校验接口
export const CHECK_COMPLEXITY = 'CHECK_COMPLEXITY'
//获取动态验证码
export const SEND_VERIFY_CODE = 'SEND_VERIFY_CODE'
//获取图形验证码
export const GET_VERIFY_CODE = 'GET_VERIFY_CODE'
//用户登录
export const LOGIN = 'LOGIN'
//登出
export const LOGOUT = 'LOGOUT'
// 修改用户信息
export const MODIFY_USER = 'MODIFY_USER'
// 重置密码接口
export const RESET_PSW = 'RESET_PSW'
// 忘记密码
export const FORGET_PSW = 'FORGET_PSW'
// 修改用户密码
export const CHANGE_PSW = 'CHANGE_PSW'
// 判断登陆状态
export const IS_LOGIN = 'IS_LOGIN'
// 登录失败后清空用户信息，这个不是接口常量
export const IS_LOGIN_FAIL = 'IS_LOGIN_FAIL'
// 激活用户接口
export const ACTIVATION = 'ACTIVATION'



// 查询系统中所有分类
export const QUERY_CLASS_TREE = 'QUERY_CLASS_TREE'
// 查询系统中所有标签
export const QUERY_LABEL = 'QUERY_LABEL'

//个性化信息获取接口
export const GET_CUSTOM_INFO = 'GET_CUSTOM_INFO'
//获取一级分类
export const GET_FIRST_CLASS = 'GET_FIRST_CLASS'
// 根据分类ID查询子分类列表
export const GET_CHILD_CLASS = 'GET_CHILD_CLASS'
// 根据分类ID查询对应的API列表(游客)
export const GET_API_LIST_BY_CLASS_ID = 'GET_API_LIST_BY_CLASS_ID'



// 管理员查询当前所有API列表
export const QUERY_APIS = 'QUERY_APIS'
// 管理员在审核界面查看API基本信息
export const GET_API_BASIC_INFO = 'GET_API_BASIC_INFO'
// 管理员对API进行审核
export const AUDIT_API = 'AUDIT_API'


// 查询服务器列表
export const QUERY_SERVERS = 'QUERY_SERVERS'
// 新增服务器
export const ADD_SERVERS = 'ADD_SERVERS'
// 删除应用服务器
export const DELETE_SERVERS = 'DELETE_SERVERS'
// 开启或关闭API
export const SWITCH_API = 'SWITCH_API'
// 查询提供服务的应用列表
export const QUERY_PROVIDE_APPS = 'QUERY_PROVIDE_APPS'
// 查询app下的服务器列表
export const QUERY_BINDED_SERVERS = 'QUERY_BINDED_SERVERS'
// 给应用绑定服务器
export const BIND_SERVERS = 'BIND_SERVERS'
// 查询已经绑定的服务器列表
export const GET_BOUND_SERVER_LIST = 'GET_BOUND_SERVER_LIST'


// 查看待审核的APP列表
export const NOT_AUDITED_APP = 'NOT_AUDITED_APP'
// 查看待审核APP下的API列表
export const NOT_AUDITED_APP_API = 'NOT_AUDITED_APP_API'
// 对APP下申请使用的API进行审核
export const AUDIT_APPLY_API = 'AUDIT_APPLY_API'
// 查看已经审核的APP列表
export const AUDITED_APP = 'AUDITED_APP'
// 查看已经审核APP下的API列表
export const AUDITED_APP_API = 'AUDITED_APP_API'
// 当根据APP搜索时什么都没有返回的情况下，需要返回一个空的申请API的列表
export const GET_EMPTY_APPAPI = 'GET_EMPTY_APPAPI'


// 查询每个学校接入的应用的数量
export const QUERY_ASCCESSED_SCHOOLS = 'QUERY_ASCCESSED_SCHOOLS'
// 查询某个学校已经接入的应用列表
export const QUERY_APPS_ASCCESSED_SCHOOLS = 'QUERY_APPS_ASCCESSED_SCHOOLS'
// 查询允许接入学校的应用列表
export const ALLOW_ACCESSED_APPS = 'ALLOW_ACCESSED_APPS'
// 查询某个接入学校的APP的接入详情
export const SCHOOL_APP_DETAIL = 'SCHOOL_APP_DETAIL'
// 将一组APP接入学校
export const ACCESS_SCHOOL = 'ACCESS_SCHOOL'
// 将某个APP重新接入学校
export const REACCESS_SCHOOL = 'REACCESS_SCHOOL'


// 查询Top10的接口调用情况
export const TOP10_MONITOR = 'TOP10_MONITOR'
// 查询API调用结果列表
export const QUERY_API_MONITOR = 'QUERY_API_MONITOR'
export const QUERY_API_APP_MONITOR = 'QUERY_API_APP_MONITOR'
// 云端某个API被APP调用的详情
export const API_MONITOR_DAY_DETAIL = 'API_MONITOR_DAY_DETAIL'
// 校内某个API被APP调用的详情
export const API_MONITOR_DETAIL = 'API_MONITOR_DETAIL'


// 查询系统中提供的APP列表
export const QUERY_APP_INFOS = 'QUERY_APP_INFOS'
// 修改APP基本信息
export const MODIFY_APP_INFOS = 'MODIFY_APP_INFOS'
// 查询APP的详细信息
export const GET_APPINFO_DETAIL = 'GET_APPINFO_DETAIL'
// 查询系统中所有的开发者
export const QUERY_ALL_DEVELOPER = 'QUERY_ALL_DEVELOPER'

// 查询系统中所有开发者列表
export const QUERY_USER = 'QUERY_USER'
// 管理员可以将某个开发者设置为自动审核或收回
export const CHANGE_AUTO_CHECK = 'CHANGE_AUTO_CHECK'
// 超级管理员将某个开发者设置为管理员或收回
export const GRANT_USER_TO_MANAGER = 'GRANT_USER_TO_MANAGER'
// 删除校外用户
export const DELETE_USER = 'DELETE_USER'
// 获取单个用户信息
export const GET_USER_INFO = 'GET_USER_INFO'
// 查询分类列表（管理界面使用）
export const QUERY_CLASSES = 'QUERY_CLASSES'
//根据分类ID查询某个分类的详细信息
export const GET_CLASS_DETAIL = 'GET_CLASS_DETAIL'
// 查询学校列表
export const GET_SCHOOL_INFO = 'GET_SCHOOL_INFO'
// 保存学校信息
export const SAVE_SCHOOL_INFO = 'SAVE_SCHOOL_INFO'
// 查询所有学校
export const QUERY_SCHOOL_INFOS = 'QUERY_SCHOOL_INFOS'
// 根据学校ID查询学校信息
export const GET_SCHOOL_BY_ID = 'GET_SCHOOL_BY_ID'
// 同步数据
export const SYNC_DATA = 'SYNC_DATA'
// 删除分类
export const DELETE_CLASS = 'DELETE_CLASS'
// 保存分类
export const SAVE_CLASS = 'SAVE_CLASS'
// 获取当前层级的分类列表
export const QUERY_CURRENTLEVEL_CLASS = 'QUERY_CURRENTLEVEL_CLASS'
// 获取当前分类的信息
export const GET_CURRENT_CLASS_DETAIL = 'GET_CURRENT_CLASS_DETAIL'

// 查询标签列表（管理界面使用）
export const QUERY_LABELS = 'QUERY_LABELS'
// 新增标签
export const ADD_LABELS = 'ADD_LABELS'
// 删除标签
export const DELETE_LABELS = 'DELETE_LABELS'
// 修改标签
export const MODIFY_LABEL = 'MODIFY_LABEL'
// 查询系统中配置的所有邮件模板
export const QUERY_TEMPLATE = 'QUERY_TEMPLATE'
// 修改邮件模板内容
export const MODIFY_TEMPLATE = 'MODIFY_TEMPLATE'
// 获取邮件模板详情
export const GET_TEMPLATE_DETAIL = 'GET_TEMPLATE_DETAIL'
// 管理员查询文档列表
export const QUERY_DOCUMENTS = 'QUERY_DOCUMENTS'
// 新增文档
export const ADD_DOCUMENT_DETAIL = 'ADD_DOCUMENT_DETAIL'
// 管理员中查询文档详情
export const GET_MANAGE_DOCUMENT_DETAIL = 'GET_MANAGE_DOCUMENT_DETAIL'
// 修改文档
export const MODIFY_DOCMENT = 'MODIFY_DOCMENT'
// 查询文档分类列表(下拉菜单)
export const QUERY_CLASS = 'QUERY_CLASS'
// 删除文档
export const DELETE_DOCUMENT = 'DELETE_DOCUMENT'
// 根据文档ID获取文档详情
export const GET_DOCUMENT_DETAIL = 'GET_DOCUMENT_DETAIL'
// 游客中心查询文档列表
export const GET_DOCUMENT_CLASS_LIST = 'GET_DOCUMENT_CLASS_LIST'




// API相关产量
// 查询注册的API列表
export const QUERY_REGISTER_APIS = 'QUERY_REGISTER_APIS'
// 开发者查看注册的应用列表
export const QUERY_REGISTER_APPS = 'QUERY_REGISTER_APPS'
// 根据API的部署URI获取API的公共信息
export const GET_API_COMMONINFO = 'GET_API_COMMONINFO'
// 创建API
export const CREATE_API = 'CREATE_API'
// 查看API详细信息，包含审核信息(开发者)
export const GET_API_DETAIL = 'GET_API_DETAIL'
// 查看API详细信息(游客)
export const GET_VISITOR_API_DETAIL = 'GET_VISITOR_API_DETAIL'
// 删除某个API
export const DELETE_API = 'DELETE_API'
// 修改API信息
export const MODIFY_API = 'MODIFY_API'
// 搜索接口(游客)
export const SEARCH_API = 'SEARCH_API'
// 查询某个api被学校调用的列表
export const QUERY_API_CALL_SCHOOLS = 'QUERY_API_CALL_SCHOOLS'
// 删除api方法
export const DELETE_API_METHODS = 'DELETE_API_METHODS'
// 查询某个接入学校的APP的接入详情
export const QUERY_APP_BY_API = 'QUERY_APP_BY_API'





// APP相关
// 查询esop中创建的APP，用于显示所属APP
export const GET_All_PROVIDERS = 'GET_All_PROVIDERS'
// 创建APP的接口
export const CREATE_APP = 'CREATE_APP'
// 自动生成APPCode
export const GENERATE_APP_CODE = 'GENERATE_APP_CODE'
// 删除APP
export const DELETE_APP = 'DELETE_APP'
// 查询APP下申请的API列表
export const QUERY_APP_API = 'QUERY_APP_API'
// 查询某个APP下未申请的API列表
export const QUERY_APP_NOT_APPLY_API = 'QUERY_APP_NOT_APPLY_API'
// APP下新增使用API
export const ADD_APP_API = 'ADD_APP_API'
// 删除APP下申请的API
export const DELETE_APP_API = 'DELETE_APP_API'



// 服务器相关
// 根据appNo和上下文查询已经绑定的服务器列表
export const GET_BIND_SERVER = 'GET_BIND_SERVER'
// 添加服务器
export const ADD_SERVER = 'ADD_SERVER'
// 查询还未被绑定的服务器列表
export const GET_UNBIND_SERVER = 'GET_UNBIND_SERVER'
// 查询所有服务器列表
export const QUERY_ALL_SERVERS_WIDTH_REGISTER = 'QUERY_ALL_SERVERS_WIDTH_REGISTER'
// 服务监控相关
// 查询所有学校列表
export const QUERY_ALL_SCHOOLINFOS = 'QUERY_ALL_SCHOOLINFOS'

// 监控中查询API信息
export const GET_APIINFO = 'GET_APIINFO'
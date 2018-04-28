<template>
    <div class="releaseApi">

        <!-- 条件筛选 -->
        <Row class='search' :gutter="12">
            <Col span="10">
                <Input v-model="keyWords" icon="ios-search-strong" placeholder="请输入..." clearable @on-enter='searchApi'></Input>
            </Col>
            <Col span="2">
                <Button type="primary" long @click='searchApi'>搜索</Button>
            </Col>
            <Col span="2">
                <span class="more" @click='moreEx'>更多筛选</span>
            </Col>
        </Row>
        <Row class='more-search' v-if="moreFlag">
            <Card>
                <Row :gutter="6" class="line-height">
                    <Col span='2'>分类:</Col>
                    <Col span='8'>
                        <Cascader :data="classTrees" :value="selectClasses" @on-change='handleChange'></Cascader>
                    </Col>
                    <Col span='2' offset='4'>所属应用：</Col>
                    <Col span='8'>
                        <Select v-model="selectAppNo" clearable placeholder="请选择APP名称..." @on-change='selectApplication'>
                            <Option v-for="(item, i) in providerApps" :value="item.appNo" :key="i">{{ item.appName }}</Option>
                        </Select>
                    </Col>
                </Row>

                <Row :gutter="6" class="line-height">
                    <Col span='2'>接口协议:</Col>
                    <Col span='9' >
                        <Button :type="protocolId==''?'primary':'ghost'" size="small"  @click='searchPro("")'>全部</Button>
                        <Button :type="protocolId=='1'?'primary':'ghost'" size="small"  @click='searchPro("1")'>SOAP</Button>
                        <Button :type="protocolId=='2'?'primary':'ghost'" size="small"  @click='searchPro("2")'>RESTFUL</Button>
                    </Col>
                </Row>

                <Row :gutter="6" class="line-height">
                    <Col span='2'>审核状态:</Col>
                    <Col span='9'>
                        <Button :type="status==''?'primary':'ghost'" size="small"  @click='searchStatus("")'>全部</Button>
                        <Button :type="status=='0'?'primary':'ghost'" size="small"  @click='searchStatus("0")'>待审核</Button>
                        <Button :type="status=='3'?'primary':'ghost'" size="small"  @click='searchStatus("3")'>审核通过</Button>
                        <Button :type="status=='2'?'primary':'ghost'" size="small"  @click='searchStatus("2")'>审核退回</Button>
                    </Col>
                </Row>

                <Row>
                    <Col offset='20' span='4'>
                        <span class="span-p"  @click='clearEx'>清空筛选项</span>
                        |
                        <span class="span-p"  @click='moreEx'>收起筛选项</span>
                    </Col>
                </Row>
            </Card>
        </Row>

        <Row class='add-btn' :gutter="12">
            <Col span="2">
                <Button type="primary" class='margin20' long @click='showAddApiModal'>新增</Button>
            </Col>
        </Row>

        <div class='table-wrapper'>
            <Table stripe :columns="apiListTtile" :data="registerApis.datas"  @on-expand='onExpand' no-data-text='暂无已发布的API'></Table>        
        </div>
        <div class="pagination">
            <Page :total="registerApis.total" :page-size='page.pageSize' show-elevator @on-change='pageChange'></Page>
        </div>
       
        <!-- model1 弹出层新增API -->
        <Modal v-model="isNewApiModel" title="新增API" @on-ok="addApi" width='800' :transfer='transfer' :styles="{top: '20px'}" >
            <div class='add-api'>
                <Form ref="apiForm" :model="apiForm" :rules="apiFormRule" :label-width="85">
                    <Row>
                        <Col span='12'>
                            <FormItem label="API名称:" prop="apiName">
                                <Input v-model="apiForm.apiName" placeholder="请输入名称"></Input>
                            </FormItem>
                        </Col>
                        <Col span='12'>
                            <FormItem label="API分类:" prop="classId">
                                <i class='required'>*</i>
                                <Cascader :data="classTrees" v-model="apiForm.classId"></Cascader>
                                <span class='error-info' v-if='errorInfo.classId'>分类不能为空</span>
                            </FormItem>
                        </Col>
                    </Row>
                    <FormItem label="API标签:" prop="labels">
                        <i class='required'>*</i>
                        <Select v-model="apiForm.labels" multiple placeholder="请选择标签（最多5个）" @on-change='labelChange'>
                            <Option v-for="(item, i) in apiLabels" :value="item.labelId" :key="i">{{ item.labelName }}</Option>
                        </Select>
                        <span class='error-info'  v-if='errorInfo.labels'>标签不能为空</span>
                    </FormItem>
                    <Row>
                        <Col span='12'>
                            <FormItem label="接口协议" prop="protocolId">
                                <RadioGroup v-model="apiForm.protocolId">
                                    <Radio label="1">SOAP</Radio>
                                    <Radio label="2">RESTFUL</Radio>
                                </RadioGroup>
                            </FormItem>
                        </Col>
                        <Col span='12'>
                            <FormItem label="所属应用:" prop="appNo">
                                <i class='required'>*</i>
                                <Select v-model="apiForm.appNo" filterable placeholder="请输入APP名称" class='api-belong' @on-change='selectBindServer' >
                                    <div class="add-application-wrap">
                                        <Row class='add-application' v-if='isAdd'>
                                            <Col span='18'>
                                                <Input v-model="addAppName" @on-enter.stop='addNewProviderApp' ></Input>
                                            </Col>
                                            <Col span='3'>
                                                <span style='color: #2d8cf0' @click.stop="addNewProviderApp">确认</span>
                                            </Col> 
                                            <Col span='3'>
                                                <span @click.stop="cancelAddNewProviderApp">取消</span>
                                            </Col>
                                        </Row>
                                        <span v-else @click.stop="isAdd=true" class='add-app'>新增应用</span>
                                    </div>
                                    <Option v-for="(item, i) in providerApps" :value="item.appNo" :key="i" class='option-item'
                                    v-text="item.appName" :title='item.appName'></Option>
                                </Select>
                                
                                <span class='error-info' v-if='errorInfo.appNo'>应用不能为空</span>
                            </FormItem>
                        </Col>
                    </Row>  
                    
                    <FormItem label="部署URI:" prop="deployUri">
                        <Input v-model.trim="apiForm.deployUri" placeholder="请输入部署URI,必须以/开头" @on-blur="generateApiContext"></Input>
                    </FormItem>

                    <FormItem label="访问URI:" prop="accessUri">
                        <Input v-model.trim="apiForm.accessUri" placeholder="根据接口地址自动生成，支持用户修改,必须以/开头"></Input>
                    </FormItem>

                    <FormItem label="部署上下文:" prop="context">
                        <Input v-model="apiForm.context" placeholder="根据接口地址自动生成，支持用户修改" @on-change='selectBindServer'></Input>
                    </FormItem>

                    <FormItem label="描述:" prop="">
                        <Input  v-model="apiForm.apiDesc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入描述"></Input>
                    </FormItem>
                    
                    <FormItem label="绑定服务器:" prop="">
                        <Table border ref="selection" :columns="serveListTitle1" :data="checkedServers"></Table>
                        <span class='bind-server' @click='bindOtherServer'>绑定其他服务器</span>
                    </FormItem>

                </Form>
            </div>
        </Modal>

        <!-- model2 绑定其他服务器 -->
        <Modal v-model="isBindServeModel" title="绑定其他服务器" width='600' :transfer='transfer' 
        @on-ok="bindServerConfirm" @on-cancel='cancelBindServer' :styles="{top: '20px'}">
            <Row :gutter='12'>
                <Col span="16">
                    <Input v-model="modal2.keyword" clearable icon="ios-search-strong" placeholder="请输入..." @on-enter='modal2Search'></Input>
                </Col>
                <Col span="4">
                    <Button type="primary" long @click='modal2Search'>搜索</Button>
                </Col>
            </Row>

            <Button type="primary" style='margin: 10px 0;' @click='isAddServeModel=true'>新增服务器</Button>

            <div class='modal-table'>
                <Table border ref="selection" :columns="serveListTitle2" :data="allServersWidthRegister.datas" 
                @on-select='onSelect' @on-select-cancel='onSelectCancel' @on-select-all='onSelectAll' @on-selection-change='onSelectChange'></Table>
            </div>

            <div class='pagination'>
                <Page :total="allServersWidthRegister.total" :page-size='modal2.page.pageSize' simple @on-change='modal2PageChange'></Page>
            </div>  

            <Tooltip placement="top-start">
                <Button type="ghost" class='tooltip-btn'>已选择({{ checkedServers.length }})</Button>
                <div slot="content">
                    <Table border ref="selection" :columns="tooltipTitle" :data="checkedServers" @on-select-cancel='onSelectCancel' @on-selection-change='onCheckedSelectChange'></Table>
                </div>
            </Tooltip>
        </Modal>

        <!-- model3 新增服务器 -->
        <Modal v-model="isAddServeModel" title="新增服务器" width='600' :transfer='transfer'  @on-ok="addNewServer('modal3')" @on-cancel="cancleAddNewServer">
            <Form ref="modal3" :model="modal3" :rules="modal3Rule" :label-width="90">
                <FormItem label="服务器名称:" prop="serverName">
                    <Input v-model="modal3.serverName" placeholder="请输入服务器名称"></Input>
                </FormItem>
                <FormItem label="服务器地址:" prop="serverAddr">
                    <Input v-model="modal3.serverAddr" placeholder="请输入服务器地址"></Input>
                </FormItem>
            </Form>
        </Modal>

        <!-- model4 被引用列表-->
        <Modal v-model="isQuoteModel" title="引用应用详情" width='600' :transfer='transfer'>
            
            <Table border :columns="invokedAppColumn" :data="invokedAppInfo.datas"></Table>
            
            <div class='pagination'>
                <Page :current="invokedPage.pageNum" :total="invokedAppInfo.total" :page-size='invokedPage.pageSize' @on-change='invokedAppChangePage'></Page>
            </div> 
        </Modal>

    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import apiExpand from './apiExpand'

export default {
    data(){
        return {
            transfer: true,
            isAddServeModel: false,
            isQuoteModel: false,
            addAppName: '',
            isAdd: false,
            isNewApiModel: false,
            isBindServeModel: false,
            keyWords: '',
            checkedServers: [],
            page: {
                pageNum: 1,
                pageSize: 8,
            },
            modal2: {
                keyword: '',
                page: {
                    pageNum: 1,
                    pageSize: 5
                }
            },
            selectAppNo: '',
            selectClasses: [],
            status: '',
            protocolId: '',
            moreFlag: false,
            invokedAppInfo: {
                datas: [],
                total : 0
            },
            selectedApiId: '',
            invokedPage: {
                pageNum: 1,
                pageSize: 10
            },
            apiListTtile: [
                {
                    type: 'expand',
                    width: 50,
                    render: (h, params) => {
                        return h(apiExpand, {
                            props: {
                                row: params.row
                            }
                        })
                    }
                },
                {
                    title: 'API名称',
                    key: 'apiName'
                },
                {
                    title: '分类',
                    key: 'className'
                },
                {
                    title: '接口协议',
                    key: 'protocolName',
                    width: 100
                },
                {
                    title: '标签',
                    key: 'labelName',
                    width: 150
                },
                {
                    title: '所属应用',
                    key: 'providerName'
                },
                {
                    title: '审核状态',
                    key: 'statusName',
                    width: 100
                },
                {
                    title: '操作',
                    key: 'address',
                    width: 150,
                    align: 'center',
                    render: (h, params) => {   
                        return h('div', [
                            h('span', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px',
                                    color: '#2d8cf0',
                                    cursor: 'pointer',
                                },
                                on: {
                                    click: () => {
                                        // console.log(params.row.apiId)
                                        this.$router.push({ path: '/api/apiDetail', query: { apiId: params.row.apiId , type: '1' } })
                                    }
                                }
                            }, '查看'),
                            h('span', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px',
                                    color: '#2d8cf0',
                                    cursor: 'pointer',
                                },
                                on: {
                                    click: () => {
                                        this.$router.push({ path: '/developer/editApi', query: { apiId: params.row.apiId  } })
                                    }
                                }
                            }, '编辑'),
                            h('span', {
                                props: {
                                    type: 'error',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px',
                                    color: '#2d8cf0',
                                    cursor: 'pointer',
                                },
                                on: {
                                    click: () => {
                                        if(!params.row.amount) {
                                            // 删除未被引用的API
                                            this.$Modal.confirm({
                                                title: '确认删除此API',
                                                content: 'API被删除后将无法恢复，你还要继续吗？',
                                                onOk: () => {
                                                    this.DELETE_API({ apiId: params.row.apiId }).then(() => {
                                                        this.registerApis.datas.splice(params.index, 1)
                                                        this.$Notice.success({
                                                            title: '删除API成功',
                                                        })
                                                    })
                                                },
                                                onCancel: () => {
                                                    
                                                }
                                            })
                                        }
                                        else {
                                            // 删除被引用的API时提示  
                                            this.$Modal.confirm({
                                                title: '',
                                                content: '此API被以下'+params.row.amount+'个应用引用，暂无法删除',
                                                cancelText: '好的',
                                                okText: '查看详情',
                                                onOk: () => {
                                                    this.invokedAppInfo = {}
                                                    this.invokedPage.pageNum = 1
                                                    this.isQuoteModel = true   
                                                    this.QUERY_APP_BY_API({apiId: params.row.apiId,page: this.invokedPage}).then((data) => {
                                                        this.selectedApiId = params.row.apiId
                                                        this.invokedAppInfo = data
                                                    })
                                                },
                                                onCancel: () => {
                                                    
                                                }
                                            })
                                        }
       
                                    }
                                }
                            },'删除')
                        ])
                    }
                }
            ],

            serveListTitle1: [
                {
                    title: '服务器名称',
                    key: 'serverName'
                },
                {
                    title: '服务器地址',
                    key: 'serverAddr'
                }
            ],  

            serveListTitle2: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '服务器名称',
                    _checked: true,
                    key: 'serverName'
                },
                {
                    title: '服务器地址',
                    key: 'serverAddr'
                }
            ],
            invokedAppColumn: [
                {
                    title: '应用编码',
                    key: 'appCode'
                },
                {
                    title: '应用名称',
                    key: 'appName'
                }
            ],
            apiForm: {
                apiName: '',
                classId: [],
                labels: [],
                protocolId: '1',
                appNo: '',
                deployUri: '',
                accessUri: '',
                context: '',
                apiDesc: '',
                servers: [],
            },

            apiFormRule: {
                apiName: [
                    { required: true, message: '该内容不得为空', trigger: 'blur' }
                ],
                protocolId: [
                    { required: true, message: '该内容不得为空', trigger: 'blur' }
                ],
                deployUri: [
                    { required: true, message: '该内容不得为空', trigger: 'blur' }
                ],
                accessUri: [
                    { required: true, message: '该内容不得为空', trigger: 'blur' }
                ],
                context: [
                    { required: true, message: '该内容不得为空', trigger: 'blur' }
                ],
                apiDesc: [
                    { required: true, message: '该内容不得为空', trigger: 'blur' }
                ],
                servers: [
                    { required: true, message: '该内容不得为空', trigger: 'blur' }
                ],
            },

            modal3Rule: {
                serverName: [
                    { required: true, message: '内容不得为空', trigger: 'blur' },
                    { type: 'string', max:50, message: '服务器名称不能超过50个字符', trigger: 'blur' }
                ],
                serverAddr: [
                    { required: true, message: '内容不得为空', trigger: 'blur' },
                    { type: 'string', max:50, message: '服务器地址不能超过50个字符', trigger: 'blur' }
                ]
            },

            modal3: {
                serverName: '',
                serverAddr: '',
            },
            
            tooltipTitle: [
               {
                    type: 'selection',
                    width: 60,
                    align: 'center',
                },
                {
                    title: '已选择',
                    width: 200,
                    key: 'serverName',  
                },
            ],

            errorInfo: {
                classId: false,
                labels: false,
                appNo: false,
            }
        }
    },
    mounted(){
        // 查询注册的API列表
        this.QUERY_REGISTER_APIS({ page: this.page })
        // 查询系统中所有分类
        this.QUERY_CLASS_TREE({})
        // 查询系统中所有标签
        this.QUERY_LABEL({})
        // 查询esop中创建的APP，用于显示所属APP
        this.GET_All_PROVIDERS({})
    },
    watch: {
        'apiForm.classId': {
            handler(val) {
                if(val && val.length == 0) {
                    this.errorInfo.classId = true
                }
                else {
                    this.errorInfo.classId = false
                }
            },
            deep: true,
        },
        'apiForm.labels': {
            handler(val) {
                let flag = false
                if(!flag) {
                    flag = true
                    return
                }
                if(val && val.length == 0) {
                    this.errorInfo.labels = true
                }
                else {
                    this.errorInfo.labels = false
                }
            },
            deep: true,
        },
        'apiForm.appNo': {
            handler(val) {
                if(!val) {
                    this.errorInfo.appNo = true
                }
                else {
                    this.errorInfo.appNo = false
                }
            },
            deep: true,
        }
    },
    computed: {
        ...mapState({
            registerApis: state => state.developer.registerApis,
            classTrees: state => state.doc.classTrees,
            apiLabels: state => state.doc.apiLabels,
            providerApps: state => state.app.providerApps,
            servers: state => state.app.servers,
            allServersWidthRegister: state => state.developer.allServersWidthRegister,
        }),
        
    },
    
    components: {
        apiExpand,
    },

    methods: {
        ...mapActions([
            'QUERY_REGISTER_APIS',
            'QUERY_CLASS_TREE',
            'QUERY_LABEL',
            'GET_All_PROVIDERS',
            'CREATE_APP',
            'GET_API_COMMONINFO',
            'ADD_SERVER',
            'GET_UNBIND_SERVER',
            'CREATE_API',
            'DELETE_API',
            'GET_BOUND_SERVER_LIST',
            'BIND_SERVERS',
            'QUERY_REGISTER_APPS',
            'QUERY_ALL_SERVERS_WIDTH_REGISTER',
            'QUERY_APP_BY_API'
        ]),
        // 分类筛选
        handleChange (value, selectedData) {
            this.selectClasses = selectedData.map(o => o.value)
            this.QUERY_REGISTER_APIS({
                key: this.keyWords,
                classId: this.selectClasses,
                protocolId: this.protocolId,
                status: this.status,
                providerId: this.selectAppNo,
                page: this.page,
            })
        },
        // 展开或收起某一行时触发
        onExpand(row, status){
            this.registerApis.datas.forEach(ele => {
                ele._expanded = false
                if(ele.apiId == row.apiId) {
                    ele._expanded = status
                }
            })
        },
        // 分页
        pageChange(num){
            this.page.pageNum = num
            this.QUERY_REGISTER_APIS({
                key: this.keyWords,
                classId: this.selectClasses,
                protocolId: this.protocolId,
                status: this.status,
                providerId: this.selectAppNo,
                page: this.page,
            })
        },
        // 选择所属应用
        selectApplication(){
            this.QUERY_REGISTER_APIS({
                key: this.keyWords,
                classId: this.selectClasses,
                protocolId: this.protocolId,
                status: this.status,
                providerId: this.selectAppNo,
                page: this.page,
            })
        },
        // 查询当前APP已经绑定的服务器列表
        selectBindServer(value) {
            if(value) {
                this.errorInfo.appNo = false
            }
            if (this.apiForm.appNo && this.apiForm.context){
                this.GET_BOUND_SERVER_LIST({ appNo: this.apiForm.appNo, context: this.apiForm.context }).then(data => {
                    this.checkedServers = data.datas
                })
            }
        },
        //
        labelChange(val){
            if(val) {
                this.errorInfo.labels = false
            }
        },        
        // 搜索
        searchApi(){
            this.QUERY_REGISTER_APIS({
                key: this.keyWords,
                classId: this.selectClasses,
                protocolId: this.protocolId,
                status: this.status,
                providerId: this.selectAppNo,
                page: this.page,
            })
        },
        // 选择接口协议
        searchPro(protocolId){
            this.protocolId = protocolId
            this.QUERY_REGISTER_APIS({
                key: this.keyWords,
                classId: this.selectClasses,
                protocolId: this.protocolId,
                status: this.status,
                providerId: this.selectAppNo,
                page: this.page,
            })
        },
        // 切换审核状态
        searchStatus(status) {
            this.status = status
            this.QUERY_REGISTER_APIS({
                key: this.keyWords,
                classId: this.selectClasses,
                protocolId: this.protocolId,
                status: this.status,
                providerId: this.selectAppNo,
                page: this.page,
            })
        },
        // 清空筛选值
        clearEx() {
            this.protocolId = ''
            this.status = ''
            this.selectClasses = []
            this.selectAppNo = ''
            this.keyWords = ''
            this.QUERY_REGISTER_APIS({})
        },
        // 隐藏显示筛选
        moreEx(){
           this.moreFlag = !this.moreFlag
           this.clearEx()
        },

        // 表单校验
        handleSubmit (name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.$Notice.success({ title: 'success' })
                } 
                else {
                    this.$Notice.error({ title: 'error' })
                }
            })
        },
        // 
        handleReset (name) {
            this.$refs[name].resetFields()
        },
        // 新增API
        showAddApiModal(){
            this.isNewApiModel = !this.isNewApiModel
            this.errorInfo = {}
           
        },
        addApi(){   
            if (this.apiForm.classId && !this.apiForm.classId.length){
                this.$nextTick(() => {
                    this.isNewApiModel = true
                    this.errorInfo.classId = true
                })
            }
            else if (this.apiForm.labels && !this.apiForm.labels.length){
                this.$nextTick(() => {
                    this.isNewApiModel = true
                    this.errorInfo.labels = true
                })
            }
            else if (!this.apiForm.appNo){
                this.$nextTick(() => {
                    this.isNewApiModel = true
                    this.errorInfo.appNo = true
                })
            }
            else if (this.apiForm.apiName && this.apiForm.apiName.length > 50){
                this.$nextTick(() => {
                    this.isNewApiModel = true
                    this.$Notice.error({ title: "API名称不能超过50个字符" })
                })
            }
            else {
                this.apiForm.servers = this.checkedServers.map(ele => ele.serverId )
                let index = this.apiForm.deployUri.indexOf("?")
                if (index != -1){
                    this.apiForm.deployUri = this.apiForm.deployUri.substring(0,index);
                }
                if (!this.apiForm.deployUri.startsWith("/")){
                    this.apiForm.deployUri = "/" + this.apiForm.deployUri
                }
                let accessUriIndex = this.apiForm.accessUri.indexOf("?")
                if (accessUriIndex != -1){
                    this.apiForm.accessUri = this.apiForm.accessUri.substring(0,accessUriIndex);
                }
                if (!this.apiForm.accessUri.startsWith("/")){
                    this.apiForm.accessUri = "/" + this.apiForm.accessUri
                }

                this.CREATE_API(this.apiForm).then( data =>{
                    this.apiForm = {protocolId: '1'}
                    this.apiForm.labels = []
                    this.checkedServers = []
                    this.$Notice.success({ title: '新增API成功' })
                    this.QUERY_REGISTER_APIS({})
                    
                }).catch(err => {
                    this.isNewApiModel = true
                    this.$Notice.error({ title: err })
                })
            }
        },
        // 新增所属APP
        addNewProviderApp() {
            this.CREATE_APP({ appName: this.addAppName }).then(data => {
                // 不管是否已经保存成功，都需要重新加载一次所属APP列表
                this.GET_All_PROVIDERS({}).then(() => {
                    this.$nextTick(() => {
                        this.apiForm.appNo = data.datas.appNo
                    })
                })
                this.cancelAddNewProviderApp()
                this.QUERY_REGISTER_APPS({page: {pageNum: 1,pageSize: 5 }})
                
            }).catch(err => {
                this.$Mesage.error(err)
            })
        },
        // 取消新增所属APP
        cancelAddNewProviderApp() {
            this.addAppName = ''
            this.isAdd = false
        },
        // 根据部署URI生成返回URI和接口上下文
        generateApiContext() {
            if (this.apiForm.deployUri){
                let index = this.apiForm.deployUri.indexOf("?")
                if (index != -1){
                    this.apiForm.deployUri = this.apiForm.deployUri.substring(0,index);
                }
                if (!this.apiForm.deployUri.startsWith("/")){
                    this.apiForm.deployUri = "/" + this.apiForm.deployUri
                }
            }
            
            this.GET_API_COMMONINFO({ deployUri: this.apiForm.deployUri }).then(data => {
                this.apiForm.accessUri = data.datas.accessUri
                this.apiForm.context = data.datas.context
                this.selectBindServer()
            }).catch(err => {
                this.$Mesage.error(err)
            })
        },
        // 新增服务器
        addNewServer(name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                        this.ADD_SERVER(this.modal3).then(data => {
                        this.modal3.serverName = ''
                        this.modal3.serverAddr = ''
                        
                        this.QUERY_ALL_SERVERS_WIDTH_REGISTER({
                            checkedServers: this.checkedServers,
                            keyword: this.modal2.keyword,
                            page: this.modal2.page,
                        })
                        this.$Notice.success({ title: '新增服务器成功' })
                    }).catch(err => {
                        this.$Notice.error({ title: err })
                    })
                } else {
                    this.$nextTick(() => {
                        this.isAddServeModel = true
                    })
                }
            })
            
            
            
        },
        // 取消新增服务器操作
        cancleAddNewServer() {
            this.modal3.serverName = ''
            this.modal3.serverAddr = ''
        },
        // 选择其他服务器进行绑定
        bindOtherServer() {
            this.isBindServeModel = !this.isBindServeModel
            // 查询所有服务器列表，并且标记已经绑定列表
            this.QUERY_ALL_SERVERS_WIDTH_REGISTER({
                checkedServers: this.checkedServers,
                keyword: this.modal2.keyword,
                page: this.modal2.page,
            })
        },
        // modal2 - 分页
        modal2PageChange(num) {
            this.modal2.page.pageNum = num
            this.QUERY_ALL_SERVERS_WIDTH_REGISTER({
                checkedServers: this.checkedServers,
                keyword: this.modal2.keyword,
                page: this.modal2.page,
            })
        },
        // modal2 - 搜索
        modal2Search(){
            this.QUERY_ALL_SERVERS_WIDTH_REGISTER({
                checkedServers: this.checkedServers,
                keyword: this.modal2.keyword,
                page: this.modal2.page,
            })    
        },
        // 绑定其他服务器
        bindServerConfirm(){
            
        },
        // 
        cancelBindServer(){
            this.checkedServers = []
        },
        onSelectChange(array){
            if (array.length == 0){
                this.allServersWidthRegister.datas.forEach((el,j) =>{
                    this.checkedServers.forEach((ele,i) => {
                        if(ele.serverId == el.serverId) {
                            this.checkedServers.splice(i, 1)
                        }
                    })
                })
            }
        },
        onSelectAll(array){
            array.map(e => e._checked = true)
            array.forEach((ele,i) => {
                let flag = false;
                this.checkedServers.forEach((el) => {
                    if (ele.serverId == el.serverId){
                        flag = true;
                    }
                })
                if (!flag) {
                    this.checkedServers.push(ele)   
                }
                
            })
        },
        // 选择服务器
        onSelect(array, row){
            row._checked = true
            this.checkedServers.push(row)         
        },
        // 取消选择服务器
        onSelectCancel(array, row){
            this.checkedServers.forEach((ele,i) => {
                if(ele.serverId == row.serverId) {
                    this.checkedServers.splice(i, 1)
                }
            })  
            this.modal2Search()
        },
        // 全部取消
        onCheckedSelectChange(array){
            if (array.length == 0){
                this.allServersWidthRegister.datas.forEach((ele,i)=>{
                    ele._checked = false
                })
                this.checkedServers = []
                this.modal2Search()
            }
        },
        invokedAppChangePage(num){
            this.invokedPage.pageNum = num
            this.QUERY_APP_BY_API({apiId: this.selectedApiId,page: this.invokedPage}).then((data) => {
                this.invokedAppInfo = data
            })
        }
    }
}
</script>

<style scoped>

.span-p{
    color:#2d8cf0;
    cursor:pointer
}
.line-height{
    line-height: 35px;
}

.table-wrapper {
    min-height: 510px;
}
.more-search,.add-btn{
    padding-top: 20px; 
}
.modal-table {
    height: 282px;
}
.error-info {
    position: absolute;
    left: 0;
    color: #c00;
}

.more{
    color:#3399ff;
    font-size: 13px;
    line-height: 30px;
    cursor: pointer;
}
.margin20 {
    margin-bottom: 20px;
}
.app-search {
    margin: 5px 16px;
}

.add-application-wrap {
    padding: 6px 16px;
}
.add-application {
    line-height: 32px;
    font-size: 12px;
    text-align: center;
    cursor: pointer;
}
.bind-server {
    color: #2d8cf0;
    width: 100%;
    /* border-bottom: 1px solid #dddee1; */
    padding: 10px;
    cursor: pointer;
}
.selected {
    position: absolute;
    left: 16px;
    bottom: 16px;
    cursor: pointer;
}

.add-app {
    font-size: 12px;
    color: #2d8cf0;
    cursor: pointer;
}

.required {
    position: absolute;
    left: -70px;
    top: 0;
    color: #ed3f14;
    font-family: SimSun;
    font-size: 12px;
}

.option-item {
    width: 270px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap
}
</style>
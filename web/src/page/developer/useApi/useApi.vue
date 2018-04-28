<template>
    <div class="useApi">
        <Row class="table-data">
            <Col span="5" class='application'>
            <div class='application-wrapper'>
                <Input v-model="appKeywords" clearable icon="ios-search-strong" placeholder="请输入应用名称/ID..." @on-change='appChange'></Input>
                <div class='menu-wrapper'>
                    <ul>
                        <li class='menu-item' :class="chooseAppItem==i?'menu-item-active' : ''" v-for='(item,i) in applicationData.datas' :key='i'
                            @click='chooseApp(item, i)'>
                            <p style='font-weight: bold; margin-bottom: 5px; '>
                                <span v-text="item.appName.length>12? item.appName.substring(0,11)+'...':item.appName" :title='item.appName'></span>
                            </p>
                            <p class='menu-item-p'>
                                <span v-text="item.appCode.length>16? item.appCode.substring(0,16)+'...':item.appCode" :title='item.appCode'></span>
                                <span class='menu-item-span' v-clipboard:copy="item.appCode" v-clipboard:success="onCopy" v-clipboard:error="onError">复制</span>
                            </p>
                            <Icon type="trash-b" @click.native.stop='deleteApplication(item.appId, i)'></Icon>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="pagination">
                <Page :page-size='appPage.pageSize' :total="applicationData.total" simple @on-change='appPageChange'></Page>
            </div>
            <Button type="primary" long @click='newApplication'>新增应用</Button>
            </Col>
            <Col span="19">
            <!-- 条件筛选 -->
            <Row class='search' :gutter="12">
                <Col span="10">
                <Input v-model="apiKeywords" icon="ios-search-strong" clearable placeholder="请输入..." @on-enter='searchApi'></Input>
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
                        <Col span='9'>
                        <Button :type="protocolId==''?'primary':'ghost'" size="small" @click='searchPro("")'>全部</Button>
                        <Button :type="protocolId=='1'?'primary':'ghost'" size="small" @click='searchPro("1")'>SOAP</Button>
                        <Button :type="protocolId=='2'?'primary':'ghost'" size="small" @click='searchPro("2")'>RESTFUL</Button>
                        </Col>
                    </Row>

                    <Row :gutter="6" class="line-height">
                        <Col span='2'>审核状态:</Col>
                        <Col span='9'>
                        <Button :type="status==''?'primary':'ghost'" size="small" @click='searchStatus("")'>全部</Button>
                        <Button :type="status=='0'?'primary':'ghost'" size="small" @click='searchStatus("0")'>待审核</Button>
                        <Button :type="status=='3'?'primary':'ghost'" size="small" @click='searchStatus("3")'>审核通过</Button>
                        <Button :type="status=='2'?'primary':'ghost'" size="small" @click='searchStatus("2")'>审核退回</Button>
                        </Col>
                    </Row>

                    <Row>
                        <Col offset='20' span='4'>
                        <span class="span-p" @click='clearEx'>清空筛选项</span>
                        |
                        <span class="span-p" @click='moreEx'>收起筛选项</span>
                        </Col>
                    </Row>
                </Card>
            </Row>

            <Row class='add-btn' :gutter="12">
                <Col span="3">
                <Button type="primary" class='search-btn' long @click='applyApi'>申请API</Button>
                </Col>
            </Row>
            <div class="list">
                <div class='list-api'>
                    <Table stripe :columns="apiListTtile" :data="appApi.datas" @on-expand='onExpand'></Table>
                </div>
                <div class="pagination">
                    <Page :total="appApi.total" :page-size='apiPage.pageSize' show-elevator @on-change='apiPageChange'></Page>
                </div>
            </div>
            </Col>
        </Row>

        <!-- 新增应用 -->
        <Modal v-model="isAddApplication" title="新增应用" @on-ok="newApplicationConfirm('newApp')" width='800' :transfer='transfer'
            :styles="{top: '20px'}">
            <Form ref="newApp" :model="newApp" :rules="newAppRule" :label-width="80">
                <FormItem label="应用编码:" prop="appCode">
                    <Input v-model.trim="newApp.appCode"></Input>
                </FormItem>

                <FormItem label="应用名称:" prop="appName">
                    <Input v-model.trim="newApp.appName"></Input>
                </FormItem>

                <FormItem label="应用描述:" prop="">
                    <Input v-model.trim="newApp.appDesc" type="textarea"></Input>
                </FormItem>
            </Form>
        </Modal>


        <!-- 申请API -->
        <Modal v-model="isApplyApi" title="申请API" @on-ok="applyApplication" width='800' :transfer='transfer' :styles="{top: '20px'}">
            <div class="filter-api">
                <Row>
                    <Col span="10">
                    <Input v-model="modalKeywords" clearable icon="ios-search-strong" placeholder="请输入..." @on-enter='searchNoApplyApi'></Input>
                    </Col>
                    <Col span="10" offset='2'>
                    <Row>
                        <Col span="4" style='height: 32px; line-height: 32px;'>分类:</Col>
                        <Col span="20">
                        <Cascader :data="classTrees" v-model="curentApiGrop" @on-change='modalHandleChange'></Cascader>
                        </Col>
                    </Row>
                    </Col>
                </Row>
                <Row style='margin-top: 20px;'>
                    <Col span="3" style='line-height: 32px; text-align: center; '>所属应用：</Col>
                    <Col span='12'>
                    <Select v-model="selectAppNo" clearable placeholder="请选择APP名称..." @on-change='selectModalApplication'>
                        <Option v-for="(item, i) in providerApps" :value="item.appNo" :key="i">{{ item.appName }}</Option>
                    </Select>
                    </Col>
                </Row>
                <Row class='clear'>
                    <span @click='clearData'>清空筛选项</span>
                </Row>
            </div>
            <div class='table-wrapper'>
                <Table ref="selection" :columns="applyApiTitle" :data="appNotApi.datas" style='margin-top: 20px;' @on-selection-change='selectTable'
                    @on-expand='onExpand'></Table>
            </div>

            <div class='pagination'>
                <Page :page-size='modalPage.pageSize' :total="appNotApi.total" simple @on-change='modalPageChange'></Page>
            </div>
        </Modal>


    </div>
</template>

<script>
    import { mapState, mapActions } from 'vuex'
    import apiExpand from './apiExpand'
    import modalExpand from '../../developer/releaseApi/apiExpand'

    export default {
        data() {
            return {
                moreFlag: false,
                selectClasses: [],
                status: '',
                protocolId: '',
                chooseAppItem: '',
                appKeywords: '',
                modalKeywords: '',
                currentAppPage: '',
                currentAppId: '',
                currentAppNo: '',
                selectAppNo: '',
                apiIds: [],
                isApplyApi: false,
                newApp: {
                    appCode: '',
                    appDesc: '',
                    appName: '',
                    autoAppCode: false,
                },
                newAppRule: {
                    appName: [
                        { required: true, message: '不能为空', trigger: 'blur' },
                        { type: 'string', max: 30, message: '最多输入30个字符', trigger: 'blur' }
                    ],
                    appCode: [
                        { required: true, message: '不能为空', trigger: 'blur' },
                        { type: 'string', max: 100, message: '最多输入100个字符', trigger: 'blur' }
                    ]

                },
                transfer: true,
                isAddApplication: false,
                apiKeywords: '',
                modalKeywords: '',
                appPage: {
                    pageNum: 1,
                    pageSize: 5
                },
                apiPage: {
                    pageNum: 1,
                    pageSize: 8
                },
                modalPage: {
                    pageNum: 1,
                    pageSize: 5
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
                                            this.$router.push({ path: '/api/apiDetail', query: { apiId: params.row.apiId, type: '1' } })
                                        }
                                    }
                                }, '查看'),
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
                                            // this.remove(params.index)
                                            this.$Modal.confirm({
                                                content: '确认删除此API',
                                                onOk: () => {
                                                    // console.log(params.row.apiId)
                                                    let apiIds = []
                                                    apiIds.push(params.row.apiId)
                                                    this.DELETE_APP_API({ apiIds: apiIds, appId: this.currentAppId }).then(() => {
                                                        this.appApi.datas.splice(params.index, 1)
                                                        this.$Notice.success({ title: '删除API成功' })
                                                    }).catch(error => {
                                                        this.$Notice.error({ title: error })
                                                    })
                                                },
                                                onCancel: () => {

                                                }
                                            })
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
                    }
                ],
                applyApiTitle: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        type: 'expand',
                        width: 50,
                        render: (h, params) => {
                            return h(modalExpand, {
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
                        width: 150,
                        key: 'className'
                    },
                    {
                        title: '所属应用',
                        width: 100,
                        key: 'providerName'
                    },

                ],
                curentApiGrop: [],
            }
        },
        computed: {
            ...mapState({
                applicationData: state => state.developer.applicationData,
                appApi: state => state.app.appApi,
                appNotApi: state => state.app.appNotApi,
                classTrees: state => state.doc.classTrees,
                providerApps: state => state.app.providerApps,
            })
        },
        components: {
            apiExpand, modalExpand,
        },
        mounted() {
            // 查询app列表
            this.QUERY_REGISTER_APPS({ keyword: this.appKeywords, page: this.appPage })
            // 默认点击选择第一个APP
            setTimeout(() => {
                if (this.applicationData.datas && this.applicationData.datas.length > 0) {
                    let item = this.applicationData.datas[0]
                    this.chooseApp(item, 0)
                }
            }, 500)
            // 查询系统中所有分类
            this.QUERY_CLASS_TREE({})
            // 供API注册时使用的APP列表
            this.GET_All_PROVIDERS({})
        },
        methods: {
            ...mapActions([
                'QUERY_REGISTER_APPS',
                'CREATE_APP',
                'GENERATE_APP_CODE',
                'DELETE_APP',
                'QUERY_APP_API',
                'QUERY_APP_NOT_APPLY_API',
                'ADD_APP_API',
                'DELETE_APP_API',
                'QUERY_CLASS_TREE',
                'GET_All_PROVIDERS',
                'GET_EMPTY_APPAPI',
                'QUERY_REGISTER_APIS'
            ]),
            
            // API分页
            apiPageChange(num) {
                this.apiPage.pageNum = num
                this.QUERY_APP_API({
                    appId: this.currentAppId,
                    appNo: this.selectAppNo,
                    key: this.apiKeywords,
                    page: this.apiPage,
                    classes: this.selectClasses,
                    potocol: this.protocolId,
                    status: this.status
                })
            },
            // 分类筛选
            handleChange(value, selectedData) {
                this.selectClasses = selectedData.map(o => o.value)
                this.QUERY_APP_API({
                    appId: this.currentAppId,
                    appNo: this.selectAppNo,
                    key: this.apiKeywords,
                    page: this.apiPage,
                    classes: this.selectClasses,
                    potocol: this.protocolId,
                    status: this.status
                })
            },
            // 选择所属应用
            selectApplication() {
                this.QUERY_APP_API({
                    appId: this.currentAppId,
                    appNo: this.selectAppNo,
                    key: this.apiKeywords,
                    page: this.apiPage,
                    classes: this.selectClasses,
                    potocol: this.protocolId,
                    status: this.status
                })
            },
            // 搜索
            searchApi() {
                this.QUERY_APP_API({
                    appId: this.currentAppId,
                    appNo: this.selectAppNo,
                    key: this.apiKeywords,
                    page: this.apiPage,
                    classes: this.selectClasses,
                    potocol: this.protocolId,
                    status: this.status
                })
            },
            // 选择接口协议
            searchPro(protocolId) {
                this.protocolId = protocolId
                this.QUERY_APP_API({
                    appId: this.currentAppId,
                    appNo: this.selectAppNo,
                    key: this.apiKeywords,
                    page: this.apiPage,
                    classes: this.selectClasses,
                    potocol: this.protocolId,
                    status: this.status
                })
            },
            // 切换审核状态
            searchStatus(status) {
                this.status = status
                this.QUERY_APP_API({
                    appId: this.currentAppId,
                    appNo: this.selectAppNo,
                    key: this.apiKeywords,
                    page: this.apiPage,
                    classes: this.selectClasses,
                    potocol: this.protocolId,
                    status: this.status
                })
            },
            // 清空筛选值
            clearEx() {
                this.protocolId = ''
                this.status = ''
                this.selectClasses = []
                this.selectAppNo = ''
                this.apiKeywords = ''
                this.QUERY_APP_API({
                    appId: this.currentAppId,
                    appNo: this.selectAppNo,
                    key: this.apiKeywords,
                    page: this.apiPage,
                    classes: this.selectClasses,
                    potocol: this.protocolId,
                    status: this.status
                })
            },
            // 隐藏显示筛选
            moreEx() {
                this.moreFlag = !this.moreFlag
                this.clearEx()
            },
            // app搜索
            appChange() {
                this.QUERY_REGISTER_APPS({ keyword: this.appKeywords, page: this.appPage }).then((data) => {
                    if (data.datas.length > 0) {
                        this.currentAppId = data.datas[0].appId,
                            this.currentAppNo = ''
                        this.QUERY_APP_API({
                            appId: this.currentAppId,
                            appNo: this.selectAppNo,
                            key: this.apiKeywords,
                            page: this.apiPage
                        })
                    } else {
                        this.GET_EMPTY_APPAPI({})
                    }
                })
            },
            // app分页
            appPageChange(num) {
                this.appPage.pageNum = num
                this.QUERY_REGISTER_APPS({ keyword: this.appKeywords, page: this.appPage }).then((data) => {
                    if (data.datas.length > 0) {
                        this.currentAppId = data.datas[0].appId,
                            this.currentAppNo = ''
                        this.QUERY_APP_API({
                            appId: this.currentAppId,
                            appNo: this.selectAppNo,
                            key: this.apiKeywords,
                            page: this.apiPage
                        })
                    } else {
                        this.GET_EMPTY_APPAPI({})
                    }
                })
            },
            // 点击列表选择app
            chooseApp(item, i) {
                if (!item) {
                    return
                }
                this.currentAppId = item.appId
                this.currentAppNo = ''
                this.chooseAppItem = i
                this.QUERY_APP_API({
                    appId: this.currentAppId,
                    appNo: this.selectAppNo,
                    key: this.apiKeywords,
                    page: this.apiPage
                })
            },
            // 复制文本
            onCopy(e) {
                this.$Message.success('复制成功')
            },
            onError(e) {
                console.log('无法复制文本！')
            },

            // 新增应用
            newApplication() {
                this.GENERATE_APP_CODE({}).then((data) => {
                    this.newApp.appCode = data
                    this.isAddApplication = !this.isAddApplication
                })
            },
            
            newApplicationConfirm(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        // 设置为非自动生成appCode
                        this.newApp.autoAppCode = false
                        this.CREATE_APP(this.newApp).then(() => {
                            this.newApp = {}
                            this.QUERY_REGISTER_APPS({ keyword: this.appKeywords, page: this.appPage }).then((data) => {
                                if (data.datas.length > 0) {
                                    this.currentAppId = data.datas[0].appId,
                                        this.currentAppNo = ''
                                    this.QUERY_APP_API({
                                        appId: this.currentAppId,
                                        appNo: this.selectAppNo,
                                        key: this.apiKeywords,
                                        page: this.apiPage
                                    })
                                    // 默认点击选择第一个APP
                                    this.$nextTick(() => {
                                        let item = this.applicationData.datas[0]
                                        this.chooseApp(item, 0)
                                    })
                                } else {
                                    this.GET_EMPTY_APPAPI({})
                                }
                            })
                            this.$Notice.success({ title: '新增应用成功，请给此应用申请API' })
                        }).catch(err => {
                            this.$nextTick(() => {
                                this.isAddApplication = !this.isAddApplication
                                this.$Notice.error({ title: err })
                            })
                        })
                    }
                    else {
                        this.$nextTick(() => {
                            this.isAddApplication = !this.isAddApplication
                            // this.$Notice.error({ title: '操作失败' })
                        })

                    }
                })
            },

            // 查询app下未申请的API
            applyApi() {
                if (!this.currentAppId) {
                    this.$Notice.error({ title: '请先选择某个应用' })
                    return
                }
                this.isApplyApi = !this.isApplyApi
                this.QUERY_APP_NOT_APPLY_API({
                    appId: this.currentAppId,
                    appNo: this.selectAppNo,
                    classes: this.curentApiGrop,
                    key: this.modalKeywords,
                    page: this.modalPage,
                })
            },
            // 展开或收起某一行时触发
            onExpand(row, status) {
                let array = []
                if (this.isApplyApi) {
                    array = this.appNotApi.datas
                }
                else {
                    array = this.appApi.datas
                }
                array.forEach(ele => {
                    ele._expanded = false
                    if (ele.apiId == row.apiId) {
                        ele._expanded = status
                    }
                })
            },
            // 删除应用
            deleteApplication(appId, i) {
                this.$Modal.confirm({
                    title: '确认删除此应用',
                    content: '应用被删除后将无法恢复，你还要继续吗？',
                    onOk: () => {
                        this.DELETE_APP({ appId: appId }).then(() => {
                            this.applicationData.datas.splice(i, 1)
                            this.$Notice.success({ title: '删除应用成功' })
                            this.QUERY_REGISTER_APPS({ keyword: this.appKeywords, page: this.appPage }).then((data) => {
                                if (data.datas.length > 0) {
                                    this.currentAppId = data.datas[0].appId,
                                        this.currentAppNo = ''
                                    this.QUERY_APP_API({
                                        appId: this.currentAppId,
                                        appNo: this.selectAppNo,
                                        key: this.apiKeywords,
                                        page: this.apiPage
                                    })
                                } else {
                                    this.GET_EMPTY_APPAPI({})
                                }
                            })
                            // 默认点击选择第一个APP
                            this.$nextTick(() => {
                                let item = this.applicationData.datas[0]
                                this.chooseApp(item, 0)
                            })
                            // 查询注册的API列表
                            this.QUERY_REGISTER_APIS({ page: this.apiPage })
                        })
                    },
                    onCancel: () => {

                    }
                })
            },

            // modal选择应用
            selectModalApplication() {
                this.QUERY_APP_NOT_APPLY_API({
                    appId: this.currentAppId,
                    appNo: this.selectAppNo,
                    classes: this.curentApiGrop,
                    key: this.modalKeywords,
                    page: this.modalPage,
                })
            },
            // modal选择分类
            modalHandleChange(value, selectedData) {
                this.curentApiGrop = selectedData.map(o => o.value)
                this.QUERY_APP_NOT_APPLY_API({
                    appId: this.currentAppId,
                    appNo: this.selectAppNo,
                    classes: this.curentApiGrop,
                    key: this.modalKeywords,
                    page: this.modalPage,
                })
            },
            // modal选择分页
            modalPageChange(num) {
                this.modalPage.pageNum = num
                this.QUERY_APP_NOT_APPLY_API({
                    appId: this.currentAppId,
                    appNo: this.selectAppNo,
                    classes: this.curentApiGrop,
                    key: this.modalKeywords,
                    page: this.modalPage,
                })
            },
            // modal搜索api
            searchNoApplyApi() {
                this.QUERY_APP_NOT_APPLY_API({
                    appId: this.currentAppId,
                    appNo: this.selectAppNo,
                    classes: this.curentApiGrop,
                    key: this.modalKeywords,
                    page: this.modalPage,
                })
            },
            // modal清空数据
            clearData() {
                this.modalKeywords = ''
                this.selectAppNo = ''
                this.curentApiGrop = []
            },
            // modal选择table项
            selectTable(arr) {
                // 由于arr中当前选中的所有内容，如果不清空原来选中的，则会导致只要选中过都会传入到后端
                this.apiIds = []
                arr.forEach(ele1 => {
                    this.apiIds.push(ele1.apiId)
                })
            },
            // app下申请api
            applyApplication() {
                if (this.apiIds.length == 0) {
                    this.$nextTick(() => {
                        this.isApplyApi = true
                        this.$Notice.error({ title: '请选择API' })
                    })
                } else {
                    let arr = [...new Set(this.apiIds)]

                    this.ADD_APP_API({ apiIds: arr, appId: this.currentAppId }).then(() => {
                        this.apiIds = []
                        this.QUERY_APP_API({ appId: this.currentAppId, key: this.apiKeywords, page: this.apiPage })
                        this.$Notice.success({ title: '申请成功' })
                        this.clearData()
                        // 查询注册的API列表
                        this.QUERY_REGISTER_APIS({ page: this.apiPage })
                    }).catch(error => {
                        this.$Notice.error({ title: error })
                    })
                }

            },

        }
    }
</script>

<style scoped>
    .menu-wrapper {
        height: 430px;
    }

    .span-p {
        color: #2d8cf0;
        cursor: pointer
    }

    .line-height {
        line-height: 35px;
    }

    .add-btn {
        padding-top: 20px;
        padding-bottom: 20px;
    }

    .more-search,
    .table-data {
        padding-top: 20px;
    }

    .more {
        color: #3399ff;
        font-size: 13px;
        line-height: 30px;
        cursor: pointer;
    }

    .application {
        padding-right: 20px;
    }

    .application-wrapper {
        z-index: 10;
    }

    .tooltip-btn {
        width: 100%;
        text-align: right;
        margin: 5px 0;
    }

    .filter-api {
        padding: 15px;
        border: 1px solid #e8e8e8;
    }

    .selected {
        position: absolute;
        left: 16px;
        bottom: 16px;
        cursor: pointer;
    }

    .ivu-menu-item-selected {
        color: #000 !important;
    }

    .table-wrapper {
        height: 350px;
    }

    .list-api {
        min-height: 580px;
    }

    .clear {
        margin-top: 20px;
        text-align: right;
        color: #2d8cf0;
        cursor: pointer;
    }
</style>
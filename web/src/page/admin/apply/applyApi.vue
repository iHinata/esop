<template>
<div class="dev">
    <Tabs type="card" :animated='false' @on-click='onChange'>
        <TabPane label="待审核API" name='0'>
            <Row class="table-data">
                <Col span="6" style='z-Index: 10; padding-right: 20px; '>
                    <Input v-model="appKeywords" icon="ios-search-strong" clearable placeholder="请输入应用名称/ID..." @on-change='appChange' ></Input>
                    <div class='menu-wrapper'>
                        <ul>
                            <li class='menu-item' :class="chooseAppItem==i?'menu-item-active' : ''"
                            v-for='(item,i) in notAuditedApp.datas' :key='i' @click='chooseApp(item.appId, i)' >
                                <p style='font-weight: bold; margin-bottom: 5px; '
                                v-text="item.appName.length>12? item.appName.substring(0,11)+'...':item.appName" :title='item.appName'></p>
                                <p class='menu-item-p'>
                                    <span v-text="item.appCode.length>16? item.appCode.substring(0,16)+'...':item.appCode" :title='item.appCode'></span>
                                    <span class='menu-item-span'
                                        v-clipboard:copy="item.appCode"
                                        v-clipboard:success="onCopy"
                                        v-clipboard:error="onError">复制</span>
                                </p>
                            </li>
                        </ul>
                    </div>
                    <div class="pagination">
                        <Page :total="notAuditedApp.total" :page-size="appPage.pageSize" simple @on-change='appPageChange'></Page>
                    </div>
                </Col>
    
                <Col span="18">
                    <Row class='search' :gutter="12">
                        <Col span="10">
                            <Input v-model="apiKeywords" icon="ios-search-strong" clearable placeholder="请输入..." @on-enter='searchApi'></Input>
                        </Col>
                        <Col span="3" >
                            <Button type="primary" long @click='searchApi'>搜索</Button>
                        </Col>
                    </Row>
    
                    <Row>
                        <Button type="primary" class='btn' @click='allExamine'>批量审核</Button>
                    </Row>
    
                    <div class="list">
                        <div class='table-wrapper'>
                            <Table ref="selection" :columns="apiTitle" :data="notAuditedAppApi.datas" 
                            @on-selection-change='checkAllGroupChange' @on-expand='onExpand'></Table>
                        </div>
                        <div class="pagination">
                            <Page :total="notAuditedAppApi.total" :page-size="apiPage.pageSize" show-elevator @on-change='apiPageChange'></Page>
                        </div>
                    </div>
                </Col>
            </Row>
        </TabPane>


        <TabPane label="已审核API" name='1'>
            <div class="checkedApi">
                <Row class="table-data" >
                    <Col span="6" style='z-Index: 10; padding-right: 20px; '>
                        <Input v-model="appKeywords_1" icon="ios-search-strong" clearable placeholder="请输入应用名称/ID..." @on-change='appChange_1' ></Input>
                        <div class='menu-wrapper'>
                            <ul>
                                <li class='menu-item' :class="chooseAppItem_1==i?'menu-item-active' : ''"
                                v-for='(item,i) in auditedApp.datas' :key='i' @click='chooseApp_1(item.appId, i)' >
                                    <p style='font-weight: bold; margin-bottom: 5px; '
                                    v-text="item.appName.length>12? item.appName.substring(0,11)+'...':item.appName" :title='item.appName'></p>
                                    <p class='menu-item-p'>
                                        <span v-text="item.appCode.length>16? item.appCode.substring(0,16)+'...':item.appCode" :title='item.appCode'></span>
                                        <span class='menu-item-span'
                                            v-clipboard:copy="item.appCode"
                                            v-clipboard:success="onCopy"
                                            v-clipboard:error="onError">复制</span>
                                    </p>
                                </li>
                            </ul>
                        </div>
                        <div class="pagination">
                            <Page :total="auditedApp.total" :page-size="appPage_1.pageSize"  simple @on-change='appPage_1Change'></Page>
                        </div>
                    </Col>
        
                    <Col span="18">
                        <Row class='search' :gutter="12">
                            <Col span="10">
                                <Input v-model="apiKeywords_1" icon="ios-search-strong" clearable placeholder="请输入..." @on-enter='searchApi_1' ></Input>
                            </Col>
                            <Col span="3" >
                                <Button type="primary" long @click='searchApi_1'>搜索</Button>
                            </Col>
                        </Row>
                        <Row style='margin: 10px 0; '>
                            <Col span='3' style='line-height: 30px; font-size: 12px; color: #bbb'>审核状态:</Col>
                            <Col span='21'>
                                <Button :type="!status_1?'primary':'ghost'" @click="radioChange_1('')">全部</Button>
                                <Button :type="status_1==3?'primary':'ghost'" @click="radioChange_1('3')">审核通过</Button>
                                <Button :type="status_1==2?'primary':'ghost'" @click="radioChange_1('2')">审核退回</Button>
                            </Col>
                        </Row>
        
                        <div class="list">
                            <div class='table-wrapper'>
                                <Table :columns="apiTitle_1" :data="auditedAppApi.datas" @on-expand='onExpand_1'></Table>
                            </div>
        
                            <div class="pagination">
                                <Page :total="auditedAppApi.total" :current="apiPage_1.pageNum" :page-size="apiPage_1.pageSize" show-elevator @on-change='apiPageChange_1'></Page>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        </TabPane>
    </Tabs>


    <!-- 审核 -->
    <Modal v-model="isExamineModal" :title="modalTitle" @on-ok="confirm" width='600' :transfer='transfer' @on-cancel='cancel'>
        <Row>
            <Col span='3' style='height: 20px; line-height: 20px; '>审核结果:</Col>
            <Col span='21'>
                <RadioGroup v-model="auditStatus">
                    <Radio label="3">审核通过</Radio>
                    <Radio label="2">审核退回</Radio>
                </RadioGroup>
            </Col>
        </Row>
        <Row style='margin-top: 20px; '>
            <Col span='3' style='height: 20px; line-height: 20px; '>审核意见:</Col>
            <Col span='21'>
                <Input v-model="auditContent" type="textarea"
                :autosize="{ minRows: 4,maxRows: 8 }"
                placeholder="请输入审核意见" ></Input>
            </Col>
        </Row>
    </Modal>
</div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import applyTable from './component/applyTable'

export default {
    data(){
        return {
            /* reviewApi部分 */
            appKeywords: '',
            appPage: {
                pageNum: 1,
                pageSize: 5
            },
            chooseAppItem: '',
            currentAppId: '',
            apiKeywords: '',
            apiPage: {
                pageNum: 1,
                pageSize: 5
            },
            checkAllGroup: [],
            auditStatus: '3',
            auditContent: '',
            transfer: false,
            isExamineModal: false,
            modalTitle: '审核API',
            apiTitle: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    type: 'expand',
                    width: 30,
                    render: (h, params) => {
                        return h(applyTable, {
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
                    title: '申请时间',
                    key: 'applyAccessTime'
                },
                {
                    title: '操作',
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
                                    cursor: 'pointer'
                                },
                                on: {
                                    click: () => {
                                        this.examine( params.row.apiId )
                                    }
                                }
                            }, '审核'),
                        ])
                    }
                },
            ],


            /* checkedApi部分 */
            appKeywords_1: '',
            appPage_1: {
                pageNum: 1,
                pageSize: 5
            },
            chooseAppItem_1: '',
            currentAppId_1: '',
            apiKeywords_1: '',
            apiPage_1: {
                pageNum: 1,
                pageSize: 5
            },
            status_1: '',
            apiTitle_1: [
                {
                    type: 'expand',
                    width: 50,
                    render: (h, params) => {
                        return h(applyTable, {
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
                    title: '申请时间',
                    width: 180,
                    key: 'applyAccessTime'
                },
                {
                    title: '审核状态',
                    width: 100,
                    key: 'statusName'
                }
            ],
        }
    },
    components: {
		applyTable
    },
    computed: {
        ...mapState({
            auditedApp: state => state.admin.auditedApp,
            auditedAppApi: state => state.admin.auditedAppApi,
            notAuditedApp: state => state.admin.notAuditedApp,
            notAuditedAppApi: state => state.admin.notAuditedAppApi,
        }),
    },
    mounted(){

        /* reviewApi部分 */
        this.NOT_AUDITED_APP({ keyword: this.appKeywords, page: this.appPage })  // 查看待审核的APP列表
        setTimeout(() => {
            if(this.notAuditedApp.datas && this.notAuditedApp.datas.length>0) {  // 默认点击选择第一个APP
                let appId = this.notAuditedApp.datas[0].appId
                this.chooseApp( appId, 0)
            }
        }, 500)

        /* checkedApi部分 */
        this.AUDITED_APP({ keyword: this.appKeywords_1, page: this.appPage_1 })   // 查看已经审核的APP列表
        setTimeout(() => {                                                        // 默认点击选择第一个APP
            if(this.auditedApp.datas && this.auditedApp.datas.length>0) {
                let appId = this.auditedApp.datas[0].appId
                this.chooseApp_1( appId, 0)
            }
        }, 500)
        
    },
    methods: {
        ...mapActions([
            'AUDITED_APP',
            'AUDITED_APP_API',
            'NOT_AUDITED_APP',
            'NOT_AUDITED_APP_API',
            'AUDIT_APPLY_API',
            'GET_EMPTY_APPAPI',
        ]),
        onChange(name){
            
        },
        
        // 公共部分复制功能
        onCopy(e) {
            this.$Message.success('复制成功')
        },
        onError(e) {
            console.log('无法复制文本！')
        },



        /******* reviewApi部分 *******/
        // app搜索
        appChange(){
            this.NOT_AUDITED_APP({ keyword: this.appKeywords, page: this.appPage }).then((data) => {
                if (data.length > 0){
                    this.currentAppId = data[0].appId
                    this.apiPage.pageNum = 1
                    this.NOT_AUDITED_APP_API({ appId: this.currentAppId, keyword: this.apiKeywords, page: this.apiPage })
                }else{
                    this.GET_EMPTY_APPAPI({})
                }
            })
        },
        // app分页
        appPageChange(num){
            this.appPage.pageNum = num
            this.NOT_AUDITED_APP({ keyword: this.appKeywords, page: this.appPage }).then((data) => {
                if (data.length > 0){
                    this.currentAppId = data[0].appId
                    this.apiPage.pageNum = 1
                    this.NOT_AUDITED_APP_API({ appId: this.currentAppId, keyword: this.apiKeywords, page: this.apiPage })
                }else{
                    this.GET_EMPTY_APPAPI({})
                }
            })
        },
        // 点击列表选择app
        chooseApp(appId, i){
            if (appId){
                this.currentAppId = appId
                this.chooseAppItem = i
                this.apiPage.pageNum = 1
                this.NOT_AUDITED_APP_API({ appId: this.currentAppId, keyword: this.apiKeywords, page: this.apiPage })
            }
            
        },

        checkAllGroupChange (array) {
            this.checkAllGroup = array.map(ele => { return ele.apiId })
        },
        // 搜索Api
        searchApi(){
            if (this.currentAppId){
                this.NOT_AUDITED_APP_API({ appId: this.currentAppId, keyword: this.apiKeywords, page: this.apiPage })
            }
            
        },
        // 展开或收起某一行时触发
        onExpand(row, status){
            this.notAuditedAppApi.datas.forEach(ele => {
                ele._expanded = false
                if(ele.apiId == row.apiId) {
                    ele._expanded = status
                }
            })
        },
        // ap分页
        apiPageChange(num){
            if (this.currentAppId){
                this.apiPage.pageNum = num
                this.NOT_AUDITED_APP_API({ appId: this.currentAppId, keyword: this.apiKeywords, page: this.apiPage })
            }
            
        },
        // 审核API \ 批量审核API
        examine(apiId){
            this.isExamineModal = !this.isExamineModal
            if(this.isExamineModal) {
                this.checkAllGroup = [apiId]
            }
        },
        // 确认
        confirm(){
            this.modalTitle = this.checkAllGroup.length>1? '批量审核API':'审核API'
            if (!this.auditContent){
                this.$nextTick(() => {
                    this.$Notice.error({  title: '审核意见不能为空'  })
                    this.isExamineModal = true
                })
            }else if (this.auditContent.length > 100){
                this.$nextTick(() => {
                    this.$Notice.error({  title: '审核意见不能超过100个字符'  })
                    this.isExamineModal = true
                })
            }else{
                this.AUDIT_APPLY_API({
                    apiIds: this.checkAllGroup,
                    appId: this.currentAppId,
                    auditContent: this.auditContent,
                    auditStatus: this.auditStatus
                }).then(() => {
                    // 审核完毕后需要重新刷新待审核列表
                    this.NOT_AUDITED_APP({ keyword: this.appKeywords, page: this.appPage }).then((data) => {
                        if (data.datas && data.datas.length > 0){
                            this.currentAppId = data.datas[0].appId
                            this.apiPage.pageNum = 1
                            this.NOT_AUDITED_APP_API({ appId: this.currentAppId, keyword: this.apiKeywords, page: this.apiPage })
                        }else{
                            this.GET_EMPTY_APPAPI({})
                        }
                    })
                    
                    this.checkAllGroup = []
                    this.auditContent = ''
                    // 审核完毕后需要重新刷新已经审核的tab
                    this.appPage_1Change(1)
                    this.$Notice.success({ title: '操作完成' })
                }).catch(error => {
                    this.$Notice.error({ title: error })
                })
            }
        },
        // 取消
        cancel(){
            this.checkAllGroup = []
        },
        allExamine(){
            if(this.checkAllGroup.length == 0){
                this.$Notice.info({ title: '请选择待审核的API' })
            }
            else {
                this.isExamineModal = !this.isExamineModal
            }
        },




        /******* checkedApi部分 *******/
        // 点击列表选择app
        chooseApp_1(appId, i){
            if (appId){
                this.currentAppId_1 = appId
                this.chooseAppItem_1 = i
                this.status_1 = ''
                this.apiPage_1.pageNum = 1
                this.AUDITED_APP_API({ appId: this.currentAppId_1, keyword: this.apiKeywords_1, page: this.apiPage_1, status: this.status_1 })
            }
            
        },
        // app分页
        appPage_1Change(num){
            this.status_1 = ''
            this.appPage_1.pageNum = num
            this.AUDITED_APP({ keyword: this.appKeywords_1, page: this.appPage_1 }).then((data) => {
                if (data.datas && data.datas.length > 0){
                    this.currentAppId_1 = data.datas[0].appId
                    this.apiPage_1.pageNum = 1
                    this.AUDITED_APP_API({ appId: this.currentAppId_1, keyword: this.apiKeywords_1, page: this.apiPage_1, status: this.status_1 })
                }else{
                    this.GET_EMPTY_APPAPI({})
                }
            })
        },
        // app搜索
        appChange_1(){
            this.status_1 = ''
            this.AUDITED_APP({ keyword: this.appKeywords_1, page: this.appPage_1 }).then((data) => {
                if (data.datas && data.datas.length > 0){
                    this.currentAppId_1 = data.datas[0].appId
                    this.apiPage_1.pageNum = 1
                    this.AUDITED_APP_API({ appId: this.currentAppId_1, keyword: this.apiKeywords_1, page: this.apiPage_1, status: this.status_1 })
                }else{
                    this.GET_EMPTY_APPAPI({})
                }
            })
        },
        // 展开或收起某一行时触发
        onExpand_1(row, status){
            this.auditedAppApi.datas.forEach(ele => {
                ele._expanded = false
                if(ele.apiId == row.apiId) {
                    ele._expanded = status
                }
            })
        },
        // api搜索
        searchApi_1(){
            this.apiPage_1.pageNum = 1
            if (this.currentAppId_1){
                this.AUDITED_APP_API({ appId: this.currentAppId_1, keyword: this.apiKeywords_1, page: this.apiPage_1, status: this.status_1 })
            }
        },
        // api分页
        apiPageChange_1(num){
            if (this.currentAppId_1){
                this.apiPage_1.pageNum = num
                this.AUDITED_APP_API({ appId: this.currentAppId_1, keyword: this.apiKeywords_1, page: this.apiPage_1, status: this.status_1 })
            }
            
        },
        // 根据状态筛选
        radioChange_1(st){
            this.apiPage_1.pageNum = 1
            this.status_1 = st
            if (this.currentAppId_1){
                this.AUDITED_APP_API({ appId: this.currentAppId_1, keyword: this.apiKeywords_1, page: this.apiPage_1, status: this.status_1 })
            }
        },


    }
}
</script>

<style scoped>

.table-wrapper {
    height: 425px;
}
.table-data{
    padding-top: 20px;
}
.btn {
    margin: 10px 0;
}
</style>
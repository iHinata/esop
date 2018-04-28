<template>
    <div class="reviewApi">
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
        }
    },
    components: {
        applyTable,
    },
    computed: {
        ...mapState({
            notAuditedApp: state => state.admin.notAuditedApp,
            notAuditedAppApi: state => state.admin.notAuditedAppApi,
        })
    },
    mounted(){
        // 查看待审核的APP列表
        this.NOT_AUDITED_APP({ keyword: this.appKeywords, page: this.appPage })
        // 默认点击选择第一个APP
        setTimeout(() => {
            if(this.notAuditedApp.datas && this.notAuditedApp.datas.length>0) {
                let appId = this.notAuditedApp.datas[0].appId
                this.chooseApp( appId, 0)
            }
        }, 500)
    },
    methods: {
        ...mapActions([
            'NOT_AUDITED_APP',
            'NOT_AUDITED_APP_API',
            'AUDIT_APPLY_API',
            'AUDITED_APP'
        ]),
        // 复制文本
        onCopy(e) {
            this.$Message.success('复制成功: ' + e.text)
        },
        onError(e) {
            console.log('无法复制文本！')
        },
        // app搜索
        appChange(){
            this.NOT_AUDITED_APP({ keyword: this.appKeywords, page: this.appPage })
        },
        // app分页
        appPageChange(num){
            this.appPage.pageNum = num
            this.NOT_AUDITED_APP({ keyword: this.appKeywords, page: this.appPage })
        },
        // 点击列表选择app
        chooseApp(appId, i){
            this.currentAppId = appId
            this.chooseAppItem = i
            this.apiPage.pageNum = 1
            this.NOT_AUDITED_APP_API({ appId: this.currentAppId, keyword: this.apiKeywords, page: this.apiPage })
        },

        checkAllGroupChange (array) {
            this.checkAllGroup = array.map(ele => { return ele.apiId })
        },
        // 搜索Api
        searchApi(){
            this.NOT_AUDITED_APP_API({ appId: this.currentAppId, keyword: this.apiKeywords, page: this.apiPage })
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
            // console.log(num)
            this.apiPage.pageNum = num
            this.NOT_AUDITED_APP_API({ appId: this.currentAppId, keyword: this.apiKeywords, page: this.apiPage })
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
            this.AUDIT_APPLY_API({
                apiIds: this.checkAllGroup,
                appId: this.currentAppId,
                auditContent: this.auditContent,
                auditStatus: this.auditStatus
            }).then(() => {
                this.NOT_AUDITED_APP_API({ appId: this.currentAppId, keyword: this.apiKeywords, page: this.apiPage })
                this.checkAllGroup = []
                this.auditContent = ''
                // 审核完毕后需要重新刷新已经审核的tab
                this.AUDITED_APP({ keyword: '', page: {pageNum: 1,pageSize: 5} })
                this.$Notice.success({ title: '操作完成' })
            }).catch(error => {
                this.$Notice.error({ title: error })
            })
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

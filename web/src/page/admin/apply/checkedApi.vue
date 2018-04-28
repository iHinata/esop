<template>
    <div class="checkedApi">
        <Row class="table-data" >
            <Col span="6" style='z-Index: 10; padding-right: 20px; '>
                <Input v-model="appKeywords_1" icon="ios-search-strong" clearable placeholder="请输入应用名称/ID..." @on-change='appChange' ></Input>
                <div class='menu-wrapper'>
                    <ul>
                        <li class='menu-item' :class="chooseAppItem_1==i?'menu-item-active' : ''"
                        v-for='(item,i) in auditedApp.datas' :key='i' @click='chooseApp(item.appId, i)' >
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
                        <Input v-model="apiKeywords_1" icon="ios-search-strong" clearable placeholder="请输入..." @on-enter='searchApi' ></Input>
                    </Col>
                    <Col span="3" >
                        <Button type="primary" long @click='searchApi'>搜索</Button>
                    </Col>
                </Row>
                <Row style='margin: 10px 0; '>
                    <Col span='3' style='line-height: 30px; font-size: 12px; color: #bbb'>审核状态:</Col>
                    <Col span='21'>
                        <Button :type="!status_1?'primary':'ghost'" @click="radioChange('')">全部</Button>
                        <Button :type="status_1==3?'primary':'ghost'" @click="radioChange('3')">审核通过</Button>
                        <Button :type="status_1==2?'primary':'ghost'" @click="radioChange('2')">审核退回</Button>
                    </Col>
                </Row>

                <div class="list">
                    <div class='table-wrapper'>
                        <Table :columns="apiTitle_1" :data="auditedAppApi.datas" @on-expand='onExpand'></Table>
                    </div>

                    <div class="pagination">
                        <Page :total="auditedAppApi.total" :page-size="apiPage_1.pageSize" show-elevator @on-change='apiPageChange'></Page>
                    </div>
                </div>
            </Col>
        </Row>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import applyTable from './component/applyTable'

export default {
    data(){
        return {
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
        applyTable,
    },
    computed: {
        ...mapState({
            auditedApp: state => state.admin.auditedApp,
            auditedAppApi: state => state.admin.auditedAppApi,
        }),
    },
    mounted(){
        // 查看已经审核的APP列表
        this.appPage_1Change(this.appPage_1.pageNum)
        // this.AUDITED_APP({ keyword: this.appKeywords_1, page: this.appPage_1 })

        // 默认点击选择第一个APP
        setTimeout(() => {
            if(this.auditedApp.datas && this.auditedApp.datas.length>0) {
                let appId = this.auditedApp.datas[0].appId
                this.chooseApp( appId, 0)
            }
        }, 500)
    },
    methods: {
        ...mapActions(['AUDITED_APP', 'AUDITED_APP_API']),
        // 复制文本
        onCopy(e) {
            this.$Message.success('复制成功: ' + e.text)
        },
        onError(e) {
            console.log('无法复制文本！')
        },
        // 点击列表选择app
        chooseApp(appId, i){
    
            this.currentAppId_1 = appId
            this.chooseAppItem_1 = i
            this.status_1 = ''
            this.apiPage_1.pageNum = 1
            this.AUDITED_APP_API({ appId: this.currentAppId_1, keyword: this.apiKeywords_1, page: this.apiPage_1, status: this.status_1 })
        },
        // app分页
        appPage_1Change(num){
            this.appPage_1.pageNum = num
            this.AUDITED_APP({ keyword: this.appKeywords_1, page: this.appPage_1 })
        },
        // app搜索
        appChange(){
            this.AUDITED_APP({ keyword: this.appKeywords_1, page: this.appPage_1 })
        },
        // 展开或收起某一行时触发
        onExpand(row, status){
            this.auditedAppApi.datas.forEach(ele => {
                ele._expanded = false
                if(ele.apiId == row.apiId) {
                    ele._expanded = status
                }
            })
        },
        // api搜索
        searchApi(){
            if (this.currentAppId_1){
                this.AUDITED_APP_API({ appId: this.currentAppId_1, keyword: this.apiKeywords_1, page: this.apiPage_1, status: this.status_1 })
            }
        },
        // api分页
        apiPageChange(num){
            this.apiPage_1.pageNum = num
            this.AUDITED_APP_API({ appId: this.currentAppId_1, keyword: this.apiKeywords_1, page: this.apiPage_1, status: this.status_1 })
        },
        // 根据状态筛选
        radioChange(st){
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

</style>

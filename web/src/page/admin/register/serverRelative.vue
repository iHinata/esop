<template>
    <div class="releaseApi">
        <Row>
            <Col span="6" style='z-Index: 10; padding-right: 20px; '>
                <Input v-model="appKeyword" icon="ios-search-strong" clearable placeholder="请输入应用名称/ID..." @on-change='appChange' ></Input>
                <div class='menu-wrapper'>
                    <ul>
                        <li class='menu-item' :class="chooseAppItem==i?'menu-item-active' : ''"
                        v-for='(item,i) in queryProvideApps.datas' :key='i' @click='chooseApp(item.appNo, i)' >
                            <p style='font-weight: bold; margin-bottom: 5px; '>{{ item.appName }}</p>
                            <p class='menu-item-p'>
                                <span v-text="item.appCode.length>25? item.appCode.substring(0,25)+'...':item.appCode" :title='item.appCode'></span>
                            </p>
                        </li>
                    </ul>
                </div>
                <div class="pagination">
                    <Page :page-size="page.pageSize" :total="queryProvideApps.total" simple @on-change='appPageChange'></Page>
                </div>
            </Col>

            <Col span='18'>
                <div class="min-height">
                    <Row class='search'>
                        <Col span="10">
                            <Input v-model="serversKeyword" icon="ios-search-strong" clearable placeholder="请输入..." @on-enter="searchServers" ></Input>
                        </Col>
                        <Col span="2">
                            <Button type="primary" class='search-btn' long @click='searchServers'>搜索</Button>
                        </Col>
                    </Row>
    
                    <div class='table-wrapper'>
                        <Table border :columns="listTitle" :data="bindedServers"></Table>
                    </div>
                </div>
                
            </Col>
        </Row>

        <!-- model2 绑定服务器 -->
        <Modal v-model="isBindServeModel" title="绑定服务器" width='600' :transfer='transfer'
            class-name="vertical-center-modal" @on-ok="confirm" >
            <Row style='margin: 15px 0; ' :gutter='10'>
                <Col span="16">
                    <Input v-model="modal.keyword" @on-enter="modalSearch" clearable icon="ios-search-strong" placeholder="请输入..." ></Input>
                </Col>
                <Col span="4">
                    <Button type="primary" long @click='modalSearch'>搜索</Button>
                </Col>
            </Row>

            <Table border ref="selection" :columns="modalTitle" :data="allServersWidthRegister.datas" @on-select='selectServes' @on-select-all='selectAllServes' 
            @on-select-cancel='onSelectCancel' @on-selection-change='selectionChange'></Table>

            <div class='pagination'>
                <Page :current="modal.pag" :total="allServersWidthRegister.total" simple @on-change='modalPageChange'></Page>
            </div>

            <Tooltip placement="top-start">
                <Button type="ghost" class='tooltip-btn'>已选择({{ modalBindServers.length }})</Button>
                <div slot="content">
                    <Table border ref="selection" :columns="tooltipTitle" :data="modalBindServers" @on-select-cancel='onSelectCancel' ></Table>
                </div>
            </Tooltip>

        </Modal>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import serverRelativeExpandName from './component/serverRelativeExpandName'
import serverRelativeExpandAddress from './component/serverRelativeExpandAddress'

export default {
    data(){
        return {
            bindedServers: [],
            modalBindServers: [],
            listTitle: [
                {
                    title: '上下文',
                    width: 120,
                    key: 'context',
                },
                {
                    title: '部署服务器名称',
                    render: (h, params) => {
                        return h(serverRelativeExpandName, {
                            props: {
                                servers: params.row.servers
                            }
                        })
                    }
                },
                {
                    title: '部署服务器地址',
                    render: (h, params) => {
                        return h(serverRelativeExpandAddress, {
                            props: {
                                servers: params.row.servers
                            }
                        })
                    }
                },
                {
                    title: '操作',
                    width: 80,
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
                                        // console.log(params.row)
                                        this.modalBindServers = []
                                        if(params.row.servers && params.row.servers.length>0) {
                                            params.row.servers.forEach(ele => {
                                                ele._checked = true
                                            })
                                        }   
                                        params.row.servers.forEach(ele => {
                                            this.modalBindServers.push(ele)
                                        })
                                        this.bindServe(params.row)
                                    }
                                }
                            }, '绑定'),
                        ])
                    }
                }
            ],
            
            appKeyword: '',
            serversKeyword: '',
            page: {
                pageNum: 1,
                pageSize: 5
            },
            chooseAppItem: '',
            currentAppNo: '',
            isBindServeModel: false,
            transfer: false,
            modal: {
                appNo: '',
                context: '',
                keyword: '',
                page: {
                    pageNum: 1,
                    pageSize: 5,
                },
            },
            modalTitle: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '服务器名称',
                    key: 'serverName'
                },
                {
                    title: '服务器地址',
                    key: 'serverAddr'
                }
            ],
            tooltipTitle: [
               {
                    type: 'selection',
                    width: 80,
                    align: 'center',
                },
                {
                    title: '已选择',
                    width: 200,
                    key: 'serverName',  
                },
            ],
        }
    },
    components: {
        serverRelativeExpandName, serverRelativeExpandAddress,
    },
    
    mounted(){
        // 查询提供服务的应用列表
        this.QUERY_PROVIDE_APPS({ keyword: this.appKeyword, page: this.page })
        // 默认点击选择第一个APP
        setTimeout(() => {
            if(this.queryProvideApps.datas && this.queryProvideApps.datas.length>0) {
                let appNo = this.queryProvideApps.datas[0].appNo
                this.chooseApp(appNo, 0 )
            }
        }, 500)
    },
    computed: {
        ...mapState({
            queryProvideApps: state => state.admin.queryProvideApps,
            allServersWidthRegister: state => state.developer.allServersWidthRegister,
        }),
        modalBindServerses(){
            for(let i = 0; i<this.modalBindServers.length;i++) {
                for(let j = 0; j<this.modalBindServers.length;j++) {
                    if(this.modalBindServers[i].serverId == this.modalBindServers[j].serverId) {
                        this.modalBindServers.splice(i, 1)
                        break
                    }
                }
            }
            return this.modalBindServers
        },
    },
    methods: {
        ...mapActions([
            'QUERY_PROVIDE_APPS',
            'QUERY_BINDED_SERVERS',
            'BIND_SERVERS',
            'QUERY_ALL_SERVERS_WIDTH_REGISTER',
        ]),
        // 搜索app
        appChange(){
            this.QUERY_PROVIDE_APPS({ keyword: this.appKeyword, page: this.page })
        },
        // app分页
        appPageChange(num){
            this.page.pageNum = num
            this.QUERY_PROVIDE_APPS({ keyword: this.appKeyword, page: this.page })
        },
        // 点击选择app
        chooseApp(appNo, i){
            this.currentAppNo = appNo
            this.chooseAppItem = i
            // 查询app下的服务器列表
            this.QUERY_BINDED_SERVERS({ keyword: this.serversKeyword, appNo: this.currentAppNo }).then(data => {
                this.bindedServers = data
            })
        },
        // 搜索服务器
        searchServers(){
            this.QUERY_BINDED_SERVERS({ keyword: this.serversKeyword, appNo: this.currentAppNo }).then(data => {
                this.bindedServers = data
            })
        },
        // 绑定服务器
        bindServe(item){
            this.isBindServeModel = !this.isBindServeModel
            this.modal.appNo = item.appNo
            this.modal.context = item.context
            // console.log(this.modal)
            // console.log(item)
            // 查询所有服务器列表，并且标记已经绑定列表
            this.QUERY_ALL_SERVERS_WIDTH_REGISTER({
                checkedServers: this.modalBindServers,
                keyword: this.modal.keyword,
                page: this.modal.page,
            })  
        },
        // modal搜索
        modalSearch(){
            this.QUERY_ALL_SERVERS_WIDTH_REGISTER({
                checkedServers: this.modalBindServers,
                keyword: this.modal.keyword,
                page: this.modal.page,
            })  
        },
        // modal分页
        modalPageChange(num){
            // console.log(num)
            this.modal.page.pageNum = num
            this.QUERY_ALL_SERVERS_WIDTH_REGISTER({
                checkedServers: this.modalBindServers,
                keyword: this.modal.keyword,
                page: this.modal.page,
            })  
        },
        
        // 给应用绑定服务器
        confirm(){
            this.BIND_SERVERS({ appNo: this.modal.appNo, context: this.modal.context, checkedServers: this.modalBindServers }).then(() => {
                this.QUERY_BINDED_SERVERS({ keyword: this.serversKeyword, appNo: this.currentAppNo }).then(data => {
                    this.bindedServers = data
                })
                this.$Notice.success({ title: '绑定服务器成功' })
            }).catch(error => {
                this.$Notice.error({ title: error })
            })
        },
        // 选择服务器
        selectServes(array, row){
            row._checked = true
            this.modalBindServers.push(row)         
        },
        selectAllServes(array){
            array.forEach((ele,i) => {
                let flag = false;
                this.modalBindServers.forEach((el) => {
                    if (ele.serverId == el.serverId){
                        flag = true;
                    }
                })
                if (!flag) {
                    this.modalBindServers.push(ele)   
                }
                
            })
        },
        // 取消选择服务器
        onSelectCancel(array, row){
            this.modalBindServers.forEach((ele,i) => {
                if(ele.serverId == row.serverId) {
                    this.modalBindServers.splice(i, 1)
                }
            })  
            this.QUERY_ALL_SERVERS_WIDTH_REGISTER({
                checkedServers: this.modalBindServers,
                keyword: this.modal.keyword,
                page: this.modal.page,
            })
        },
        // 选项改变时
        selectionChange(array){
            if (array.length == 0){
                for(let i=0;i<this.allServersWidthRegister.datas.length;i++){
                    for(let j=0;j<this.modalBindServers.length; j++) {
                        if(this.allServersWidthRegister.datas[i].serverId == this.modalBindServers[j].serverId) {
                            this.modalBindServers.splice(j, 1)
                        }
                    }
                }
            }
        }

    }
}
</script>

<style scoped>
.ivu-menu-vertical.ivu-menu-light:after {
    width: 0;
}
.min-height {
    min-height: 700px;
}
.menu {
    width: 236px;
    overflow-x: scroll;
    z-index: 10;
    margin-right: 15px;
    border: 1px solid #eee;
}
.span-p{
    color:#2d8cf0;
    cursor:pointer
}
.line-weight{
    line-height: 35px;
}

.more-search,.add-btn,.table-data{
    padding-top: 20px;
}

.more{
    color:#3399ff;
    font-size:13px;
}
.search {
    margin-bottom: 15px;
}
.search-btn {
    margin: 0 10px;
}

.table-title {
    height: 40px;
    line-height: 40px;
    font-size: 12px;
    font-weight: bold;
    background: #eef1f6;
    border-bottom: 1px solid #dbdcf0;
}
.table-common {
    font-size: 12px;
    border-bottom: 1px solid #dbdcf0;
    padding: 20px 0;
}
.operation {
    color: #2d8cf0;
    cursor: pointer;
}
.table-parent {
    display: table;
}
.table-child {
    padding: 5px 0;
    display: table-cell;
    vertical-align: middle;
}
.servers-list-item {
    display: block;
    padding: 5px 0;
}
</style>

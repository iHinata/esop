<template>
    <div class="releaseApi">

        <Row class='search' :gutter="12">
            <Col span="10">
                <Input v-model="keyword" icon="ios-search-strong" placeholder="请输入..." clearable  class='search-input' @on-enter='searchApi'></Input>
            </Col>
            <Col span="2">
                <Button type="primary" class='search-btn' long @click='searchApi'>搜索</Button>
            </Col>
        </Row>

        <Row class='add-btn' :gutter="12">
            <Col span="2">
                <Button  type="primary" class='search-btn' long @click='isAddServer=!isAddServer'>新增</Button>
            </Col>
            <Col span="2">
                <Button  type="error" class='search-btn' long @click='deleteServer'>删除</Button>
            </Col>
        </Row>

        <Row class="table-data">
            <div class='table-wrapper'>
                <Table stripe  :columns="serversTitle" :data="servers.datas" @on-selection-change='onSelect'></Table>
            </div>
            <div class="pagination">
                <Page :total="servers.total" :page-size='page.pageSize' show-elevator @on-change='pageChange'></Page>
            </div>
        </Row>


        <!-- 新增服务器 -->
        <Modal v-model="isAddServer" title="新增服务器" @on-ok="confirm('formItem')" width='800' :transfer='transfer'>
            <Form ref="formItem" :model="formItem" :label-width="90" :rules="formRules">
                <FormItem label="服务器名称" prop='serverName'>
                    <Input v-model="formItem.serverName" placeholder="请输入服务器名称"></Input>
                </FormItem>
                <FormItem label="服务器地址" prop='serverAddr'>
                    <Input v-model="formItem.serverAddr" placeholder="请输入服务器地址"></Input>
                </FormItem>
            </Form>
        </Modal>

        
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
    data(){
        return {
            appNo: '',
            context: '',
            keyword: '',
            page: {
                pageNum: 1,
                pageSize: 8
            },

            formItem: {
                serverName: '',
                serverAddr: '',
            },
            formRules: {
                serverName: [
                    { required: true, message: '内容不得为空', trigger: 'blur' },
                    { type: 'string', max:50, message: '服务器名称不能超过50个字符', trigger: 'blur' }
                ],
                serverAddr: [
                    { required: true, message: '内容不得为空', trigger: 'blur' },
                    { type: 'string', max:50, message: '服务器地址不能超过50个字符', trigger: 'blur' }
                ],
            },
            serverIds: [],
            transfer: false,
            isAddServer: false,
            checkFlag: 'all',
            proFlag: 'all',
            moreFlag:false,
            serversTitle: [
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
                },
                {
                    title: '创建时间',
                    key: 'createTime'
                },
                {
                    title: '更新时间',
                    key: 'updateTime'
                },
                {
                    title: '操作',
                    width: 100,
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
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
                                        this.$Modal.confirm({
                                            title: '确认删除此服务器',
                                            content: '服务器被删除后将无法恢复，你还要继续吗？',
                                            cancelText: '取消',
                                            okText: '继续',
                                            onOk: () => {   
                                                // console.log(params.row.serverId)  
                                                this.DELETE_SERVERS({ serverId: [params.row.serverId] }).then(() => {
                                                    this.QUERY_SERVERS({
                                                        appNo: this.appNo,
                                                        context: this.context,
                                                        keyword: this.keyword,
                                                        page: this.page
                                                    })
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
          
        }
    },

    computed: {
        ...mapState({
            servers: state => state.admin.servers,

        })
    },
    mounted(){
        // 查询服务器列表
        this.QUERY_SERVERS({
            appNo: this.appNo,
            context: this.context,
            keyword: this.keyword,
            page: this.page
        })
    },
    methods: {
        ...mapActions(['QUERY_SERVERS', 'ADD_SERVERS', 'DELETE_SERVERS', ]),
        pageChange(num){
            // console.log(num)
            this.page.pageNum = num
            this.QUERY_SERVERS({
                appNo: this.appNo,
                context: this.context,
                keyword: this.keyword,
                page: this.page
            })
        },

        confirm(name){
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.ADD_SERVERS(this.formItem).then(() => {
                            this.QUERY_SERVERS({
                            appNo: this.appNo,
                            context: this.context,
                            keyword: this.keyword,
                            page: this.page
                        })
                        this.$Notice.success({ title: '新增服务器成功' })
                        this.formItem = {}
                    }).catch(error => {
                        this.$Notice.error({ title: error })
                    })
                } else {
                    this.$nextTick(() => {
                        this.isAddServer = true
                    })
                }
            })
        },

        searchApi(){
            this.QUERY_SERVERS({
                appNo: this.appNo,
                context: this.context,
                keyword: this.keyword,
                page: this.page
            })
        },

        deleteServer(){
            this.$Modal.confirm({
                title: '确认删除此服务器',
                content: '服务器被删除后将无法恢复，你还要继续吗？',
                cancelText: '取消',
                okText: '继续',
                onOk: () => {   
                    this.DELETE_SERVERS({ serverId: this.serverIds }).then(() => {
                        this.QUERY_SERVERS({
                            appNo: this.appNo,
                            context: this.context,
                            keyword: this.keyword,
                            page: this.page
                        })
                        this.serverIds = []
                        this.$Notice.success({ title: '删除服务器成功' })
                    }).catch(error => {
                        this.$Notice.error({ title: error })
                    })
                },
                onCancel: () => {
                }
            })
        },

        onSelect(array){
            this.serverIds = []
            array.forEach(ele => {
                this.serverIds.push(ele.serverId)
            })
        },


    }
}
</script>

<style scoped>

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
    font-size: 13px;
}
.table-wrapper {
    height: 450px;
}
</style>
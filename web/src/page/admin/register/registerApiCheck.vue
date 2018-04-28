<template>
    <div class="releaseApi">
        <!-- 条件筛选 -->
        <Row class='search' :gutter="12">
            <Col span="10">
                <Input v-model="keyWords" icon="ios-search-strong" clearable placeholder="请输入..." @on-enter='searchApi'></Input>
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
                    <Col span='2' offset='4'>所属应用:</Col>
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
            <Col span="3">
                <Button type="primary" long @click='newApi'>批量审核</Button>
            </Col>
            <Col span="6">
                <Tag type="border">此操作仅对待审核的API生效</Tag>
            </Col>
        </Row>
        <Row class="table-data">
            <div class='table-wrapper'>
                <Table stripe id='register-api-check-table'
                    :columns="apiListTtile" 
                    :data="queryApis.datas" 
                    @on-selection-change='onSelect'
                    @on-expand='onExpand'></Table>        
            </div>
            <div class="pagination">
                <Page :total="queryApis.total" :page-size='page.pageSize' show-elevator @on-change='pageChange'></Page>
            </div>
        </Row>

        <!-- 审核 -->
        <Modal v-model="isExamineModal" :title="modalTitle" @on-ok="confirm" width='600' :transfer='transfer'>
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
                    <Input v-model="auditMessage" type="textarea" 
                        :autosize="{minRows: 4,maxRows: 8}" 
                        placeholder="请输入审核意见" ></Input>
                </Col>
            </Row>
        </Modal>

    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import expand from './component/expand'

export default {
    components: {
        expand,
    },
    data(){
        return {
            modalTitle: '审核API',
            keyWords: '',
            selectClasses: [],
            page: {
                pageNum: 1,
                pageSize: 8
            },
            protocolId: '',
            providerId: '',
            status: '',
            apiIds: [],
            appName: '',
            appNo: '',
            auditMessage: '',
            auditStatus: '3',
            isExamineModal: false,
            transfer: false,
            checkFlag: 'all',
            proFlag: 'all',
            moreFlag: false,
            apiListTtile: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center',
                },
                {
                    type: 'expand',
                    width: 30,
                    render: (h, params) => {
                        return h(expand, {
                            props: {
                                row: params.row
                            }
                        })
                    }
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
                                        this.$router.push({ path: '/admin/editApi', query: { apiId: params.row.apiId }  })
                                    }
                                }
                            }, '编辑'),
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
                                        this.$router.push({ path: '/admin/apiDetail', query: { apiId: params.row.apiId, type: '2' }  })
                                    }
                                }
                            }, '详情'),
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
                                        /*
                                        *  状态： 4 关闭状态 / 3 开启状态
                                        *  status关闭状态时参数为3， 开启状态时参数为4 
                                        */
                                        // 
                                        let status = params.row.status==4?'3':'4'
                                        let msg = params.row.status==4?'开启':'关闭'
                                        this.SWITCH_API({ apiId: params.row.apiId, status: status }).then(() => {
                                            this.QUERY_APIS({ 
                                                classId: this.selectClasses,
                                                keyword: this.keyword,
                                                page: this.page,
                                                protocolId: this.protocolId,
                                                providerId: this.selectAppNo,
                                                status: this.status,
                                            })
                                            this.$Notice.success({ title: msg + '成功' })
                                        }).catch(error => {
                                            this.$Notice.success({ title: error })
                                        })
                                    }
                                }
                            }, params.row.status==2 || params.row.status==0?'':params.row.status==4?'开启':'关闭'),
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
                                        this.apiIds = []
                                        this.isExamineModal = !this.isExamineModal
                                        this.apiIds.push(params.row.apiId)   
                                    }
                                }
                            }, params.row.status==2?'':params.row.status==0?'审核':''),
                        ])
                    }
                },
                {
                    title: 'API名称',
                    key: 'apiName'
                },
                {
                    title: '审核状态',
                    width: 100,
                    key: 'statusName'
                },
                {
                    title: '接口协议',
                    width: 100,
                    key: 'protocolName'
                },
                
                {
                    title: '所属应用',
                    width: 150,
                    key: 'providerName'
                }
            ],
        }
    },
    computed: {
        ...mapState({
            queryApis: state => state.admin.queryApis,
            classTrees: state => state.doc.classTrees,
            providerApps: state => state.app.providerApps,
        }),
    },
    mounted(){
        // 查询系统中所有分类
        this.QUERY_CLASS_TREE({})
        // 供API注册时使用的APP列表
        this.GET_All_PROVIDERS({})
        // 管理员查询当前所有API列表
        this.QUERY_APIS({ 
            classId: this.selectClasses,
            keyword: this.keyword,
            page: this.page,
            protocolId: this.protocolId,
            providerId: this.selectAppNo,
            status: this.status,
        })
    },
    methods: {
        ...mapActions(['QUERY_APIS','AUDIT_API', 'SWITCH_API', 'QUERY_CLASS_TREE', 'GET_All_PROVIDERS']),
        // 分类筛选
        handleChange (value, selectedData) {
            this.selectClasses = selectedData.map(o => o.value)
            this.QUERY_APIS({ 
                classId: this.selectClasses,
                keyword: this.keyWords,
                page: this.page,
                protocolId: this.protocolId,
                providerId: this.selectAppNo,
                status: this.status,
            })
        },
        // 分页
        pageChange(num){
            this.page.pageNum = num
            this.QUERY_APIS({ 
                classId: this.selectClasses,
                keyword: this.keyWords,
                page: this.page,
                protocolId: this.protocolId,
                providerId: this.selectAppNo,
                status: this.status,
            })
        },
        // 选择所属应用
        selectApplication(){
            this.QUERY_APIS({ 
                classId: this.selectClasses,
                keyword: this.keyWords,
                page: this.page,
                protocolId: this.protocolId,
                providerId: this.selectAppNo,
                status: this.status,
            })
        },
        // 搜索
        searchApi(){
            this.QUERY_APIS({ 
                classId: this.selectClasses,
                keyword: this.keyWords,
                page: this.page,
                protocolId: this.protocolId,
                providerId: this.selectAppNo,
                status: this.status,
            })
        },
        // 展开或收起某一行时触发
        onExpand(row, status){
            this.queryApis.datas.forEach(ele => {
                ele._expanded = false
                if(ele.apiId == row.apiId) {
                    ele._expanded = status
                }
            })
        },
        // 选择接口协议
        searchPro(protocolId){
            this.protocolId = protocolId
            this.QUERY_APIS({ 
                classId: this.selectClasses,
                keyword: this.keyWords,
                page: this.page,
                protocolId: this.protocolId,
                providerId: this.selectAppNo,
                status: this.status,
            })
        },
        // 切换审核状态
        searchStatus(status) {
            this.status = status
            this.QUERY_APIS({ 
                classId: this.selectClasses,
                keyword: this.keyWords,
                page: this.page,
                protocolId: this.protocolId,
                providerId: this.selectAppNo,
                status: this.status,
            })
        },
        // 清空筛选值
        clearEx() {
            this.protocolId= ''
            this.status = ''
            this.selectClasses = []
            this.selectAppNo = ''
            this.keyWords = ''
            this.QUERY_APIS({ 
                classId: this.selectClasses,
                keyword: this.keyWords,
                page: this.page,
                protocolId: this.protocolId,
                providerId: this.selectAppNo,
                status: this.status,
            })
        },
        // 隐藏显示筛选
        moreEx(){
           this.moreFlag = !this.moreFlag
           this.clearEx()
        },

        // 审核API
        confirm(){
            if (!this.auditMessage){
                this.$nextTick(() => {
                    this.$Notice.error({  title: '审核意见不能为空'  })
                    this.isExamineModal = true
                })
            }else if (this.auditMessage.length > 100){
                this.$nextTick(() => {
                    this.$Notice.error({  title: '审核意见不能超过100个字符'  })
                    this.isExamineModal = true
                })
            }
            else {
                this.AUDIT_API({ 
                    apiIds: this.apiIds, 
                    auditMessage: this.auditMessage, 
                    auditStatus: this.auditStatus
                }).then(() => {
                    this.QUERY_APIS({ 
                        classId: this.selectClasses,
                        keyword: this.keyword,
                        page: this.page,
                        protocolId: this.protocolId,
                        providerId: this.selectAppNo,
                        status: this.status,
                    })
                    this.auditMessage = ''
                    this.$Notice.success({  title: '操作完成'  })
                }).catch(error => {
                    this.$Notice.error({  title: error  })
                })
            }
            
        },
        // 
        onSelect(array){
            this.apiIds = []
            array.forEach(ele => {
                this.apiIds.push(ele.apiId)
            })
            // console.log(this.apiIds)
        },
        newApi(){
            if(!this.apiIds.length) {
                this.$Notice.info({  title: '请选择API'  })
            }
            else {
                this.isExamineModal = !this.isExamineModal
                this.modalTitle = '批量审核API'
            }
        },
        
    }
}
</script>



<style scoped>
.more{
    color:#3399ff;
    font-size: 13px;
    line-height: 30px;
    cursor: pointer;
}
.more-search {
    margin: 10px 0;
}
.line-height{
    line-height: 35px;
}
.span-p{
    color:#2d8cf0;
    cursor: pointer;
    font-size: 12px;
}
.table-wrapper {
    height: 560px;
}

.add-btn {
    margin: 15px 0;
}
</style>
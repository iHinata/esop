<template>
    <div>
        <!-- 云端环境 -->
        <div v-if='!isSchoolEnv'>
            <Row :gutter='10'>
                <Col span='10'>
                <Input v-model="keyword" placeholder="请输入" clearable @on-enter='search'></Input>
                </Col>
                <Col span='2'>
                <Button type="primary" @click='search'>搜索</Button>
                </Col>
            </Row>
            <Button type="primary" @click='addNewSchool' style='margin: 10px 0; '>新增学校</Button>
            <Row :gutter='10'>
                <div class="table">
                    <Table stripe :columns="schoolInfoTitle" :data="schoolInfos.datas" @on-expand='onExpand'></Table>
                </div>
                <div class="pagination">
                    <Page :total="schoolInfos.total" :page-size='page.pageSize' show-elevator @on-change='pageChange'></Page>
                </div>
            </Row>
        </div>

        <!-- 校内环境 -->
        <div v-else>
            <div class="section">
                <span class='title'>{{schoolInfo.name}}
                    <small>({{schoolInfo.id}})</small>
                </span>
                <Button type="primary" class='margin10' @click='modify(schoolInfo.id)'>编辑</Button>
                <Button type="primary" class='margin10' @click='sync(schoolInfo.id)'>同步</Button>
            </div>
            <Form :model="schoolInfo" :label-width="200">
                <FormItem label="学校网关地址：" prop="name">
                    {{schoolInfo.gateway}}
                </FormItem>
                <FormItem label="版本号云端地址：" prop="name">
                    {{schoolInfo.cloudUrl}}
                </FormItem>
                <FormItem label="管理员邮箱：" prop="name">
                    {{schoolInfo.managerEmail}}
                </FormItem>
                <FormItem label="升级时间：" prop="name">
                    {{schoolInfo.upgradeTime}}
                </FormItem>
                <FormItem label="版本号：" prop="name">
                    {{schoolInfo.version}}
                </FormItem>
                <FormItem label="上次数据同步时间：" prop="name">
                    {{schoolInfo.lastSyncTime}}
                </FormItem>
            </Form>
        </div>

        <!-- 新增学校 -->
        <Modal v-model="isAddSchool" :title='title' @on-ok="confirm" width='600' :transfer='transfer'>
            <Form ref="schoolInfo" :model="schoolInfo" :rules="ruleValidate" :label-width="110">
                <FormItem label="学校编码:" prop="id">
                    <Input v-model="schoolInfo.id" placeholder="输入学校编码" :disabled='isEdit'></Input>
                </FormItem>
                <FormItem label="学校名称:" prop="name">
                    <Input v-model="schoolInfo.name" placeholder="输入学校名称"></Input>
                </FormItem>
                <FormItem label="学校图标:">                  
                    <div class="upload">
                        <div class="upload-file">
                            <Icon type="camera" size="20" class='camera'></Icon>
                            <input name="file" type="file" accept="image/png,image/gif,image/jpeg" @change.stop="update" />
                        </div>
                        <div class='upload-file' v-if='iconUrl'>
                            <img :src="iconUrl" alt="" >
                            <div class='btn-group'>
                                <Icon type="android-delete" class='upload-icon' @click.native='deleteImg'></Icon>
                            </div>
                        </div>
                    </div>
                </FormItem>
                <FormItem label="学校网关地址:" prop="gateway">
                    <Input v-model="schoolInfo.gateway" placeholder="输入学校网关地址"></Input>
                </FormItem>
                <FormItem label="云端地址:" v-show='isSchoolEnv' prop="cloudURL">
                    <Input v-model="schoolInfo.cloudUrl" placeholder="输入云端地址"></Input>
                </FormItem>
                <FormItem label="管理员邮箱:" prop="managerEmail">
                    <Input v-model="schoolInfo.managerEmail" placeholder="输入管理员邮箱"></Input>
                </FormItem>
                <!--  -->
                <span @click="handleSubmit('schoolInfo')"></span>
            </Form>
        </Modal>

    </div>
</template>

<script>
import axios from 'axios'
import { mapActions, mapState } from 'vuex'
import expand from './component/expand'

export default {
    components: {
        expand,
    },
    data() {
        return {
            isSchoolEnv: true,
            keyword: '',
            page: {
                pageNum: 1,
                pageSize: 8
            },
            iconUrl: '',
            title: '新增学校',
            isEdit: true,
            isAddSchool: false,
            transfer: false,
            schoolInfo: {},
            ruleValidate: {
                id: [
                    { required: true, message: '学校编码不能为空', trigger: 'blur' }
                ],
                name: [
                    { required: true, message: '学校名称不能为空', trigger: 'blur' }
                ],
                gateway: [
                    { required: true, message: '学校网关地址不能为空', trigger: 'blur' }
                ],
                managerEmail: [
                    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
                ],
            },
            schoolInfoTitle: [
                {
                    type: 'expand',
                    width: 50,
                    render: (h, params) => {
                        return h(expand, {
                            props: {
                                row: params.row
                            }
                        })
                    }
                },
                {
                    title: '学校编码',
                    key: 'id',
                    width: 150
                },
                {
                    title: '学校名称',
                    width: 200,
                    key: 'name'
                },
                {
                    title: '网关地址',
                    key: 'gateway'
                },
                {
                    title: '版本号',
                    width: 150,
                    key: 'version'
                },
                {
                    title: '操作',
                    width: 100,
                    key: 'date',
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
                                        this.modify(params.row.id)
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
                                        this.sync(params.row.id)
                                    }
                                }
                            }, '同步'),
                        ])
                    }
                },
            ],
        }
    },
    created() {
        if (sessionStorage.common) {
            this.isSchoolEnv = JSON.parse(sessionStorage.common).isSchoolEnv
        }
    },
    computed: {
        ...mapState({
            schoolInfos: state => state.admin.schoolInfos,
        })
    },
    mounted() {
        this.getSchoolInfo()
        this.QUERY_SCHOOL_INFOS({ keyword: this.keyword, page: this.page })
    },
    methods: {
        ...mapActions(['GET_SCHOOL_INFO', 'SAVE_SCHOOL_INFO', 'SYNC_DATA', 'QUERY_SCHOOL_INFOS', 'GET_SCHOOL_BY_ID']),
        update(e) {
            let file = e.target.files[0]
            let param = new FormData() 
            const self = this
            param.append('file', file, file.name)

            let config = {      
                headers: { 'Content-Type': 'multipart/form-data' }
            }  
            axios.post('/rest/dic/custom/uploadPicFile', param, config)
                .then(res => {
                    if (res.data.resultCode == 0){
                        self.iconUrl = res.data.datas
                        self.$Notice.success({ title: '图片上传成功' })
                    }else{
                        self.$Notice.error({ title: res.data.resultMessage })
                    }
                })
        },
        deleteImg(){
            this.iconUrl = ''
        },
        confirm() {
            this.handleSubmit('schoolInfo')
        },
        handleSubmit(name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.schoolInfo.iconUrl = this.iconUrl
                    this.SAVE_SCHOOL_INFO(this.schoolInfo).then(() => {
                        this.$Notice.success({ title: '操作成功' })
                        if (this.isSchoolEnv) {
                            this.getSchoolInfo()
                        }
                        else {
                            this.QUERY_SCHOOL_INFOS({ keyword: this.keyword, page: this.page })
                        }
                    }).catch(err => {
                        this.$Notice.error({ title: err })
                    })
                }
                else {
                    this.$nextTick(() => {
                        this.isAddSchool = !this.isAddSchool
                        this.$Notice.error({ title: '操作失败' })
                    })

                }
            })
        },
        // 展开或收起某一行时触发
        onExpand(row, status) {
            this.schoolInfos.datas.forEach(ele => {
                ele._expanded = false
                if (ele.id == row.id) {
                    ele._expanded = status
                }
            })
        },
        pageChange(num) {
            this.page.pageNum = num
            this.QUERY_SCHOOL_INFOS({ keyword: this.keyword, page: this.page })
        },
        getSchoolInfo() {
            if (this.isSchoolEnv) {
                this.GET_SCHOOL_INFO().then(data => {
                    this.schoolInfo = data
                })
            }
        },
        search() {
            this.QUERY_SCHOOL_INFOS({ keyword: this.keyword, page: this.page })
        },
       
        addNewSchool() {
            this.isAddSchool = true
            this.title = '新增学校'
            this.isEdit = false
            this.schoolInfo = {}
            this.iconUrl = ''
        },
        modify(id) {
            this.isAddSchool = true
            this.title = '编辑学校'
            this.isEdit = true
            this.GET_SCHOOL_BY_ID({ id: id }).then(data => {
                this.schoolInfo = data
                this.iconUrl = data.iconUrl
            })
        },
        sync(id) {
            this.SYNC_DATA({ id: id }).then(() => {
                this.$Notice.success({ title: '操作成功' })
                if (this.isSchoolEnv) {
                    this.getSchoolInfo()
                }
                else {
                    this.QUERY_SCHOOL_INFOS({ keyword: this.keyword, page: this.page })
                }
            }).catch(err => {
                this.$Notice.error({ title: err })
            })
        }
    }
}
</script>

<style scoped>
.table {
    height: 540px;
}

.title {
    font-size: 20px;
    font-weight: bold;
}

.title small {
    font-size: 14px;
    font-weight: normal;
}

.margin10 {
    margin: 0 10px;
}

.section-p {
    margin: 15px 0;
}

.section {
    padding-left: 150px;
    padding-bottom: 40px;
}

.ivu-form-item {
    margin-bottom: 24px;
}
</style>
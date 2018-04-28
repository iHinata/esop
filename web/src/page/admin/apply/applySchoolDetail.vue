<template>
    <div class="apply-school-detail">
        <!-- 面包屑 -->
        <Breadcrumb>
            <BreadcrumbItem to="/admin/applySchool">应用接入学校</BreadcrumbItem>
            <BreadcrumbItem>{{$route.query.schoolName}}</BreadcrumbItem>
        </Breadcrumb>

        <h4 class='title'>{{$route.query.schoolName}} <span class='title-note'>({{ $route.query.schoolId }})</span></h4>

        <Row class='search' :gutter="12">
            <Col span="10">
                <Input v-model="keyword" @on-enter="searchApi" icon="ios-search-strong" clearable placeholder="请输入..."  class='search-input'></Input>
            </Col>
            <Col span="3">
                <Button type="primary" class='search-btn' @click='searchApi'>搜索</Button>
            </Col>
        </Row>

        <Button type="primary" class='apply-btn' @click='apply'>新接入应用</Button>

        <Row>
            <Table stripe :columns="appTitle" :data="appAccessedSchools.datas"></Table>
            <div class="pagination">
                <Page :total="appAccessedSchools.total" show-elevator @on-change='pageChange'></Page>
            </div>
        </Row>


        <!-- 新接入应用 -->
        <Modal v-model="isApplyNewApplicaton" title="新接入应用" width='600' :transfer='transfer' @on-ok="confirm">
            <Row style='margin: 15px 0; ' :gutter='12'>
                <Col span="16">
                    <Input v-model="modalKeyword" @on-enter="search" clearable icon="ios-search-strong" placeholder="请输入..." ></Input>
                </Col>
                <Col span="4">
                    <Button type="primary" long @click='search'>搜索</Button>
                </Col>
            </Row>

            <Table border ref="selection"
                @on-selection-change="onSelectionChange"
                :columns="modalTitle"
                :data="allowAccessedApp.datas"></Table>

            <div class='pagination'>
                <Page :total="allowAccessedApp.total" simple  @on-change='modalPageChange' ></Page>
            </div>

            <section class='selected'>
                <p style='color: #2d8cf0;'>已选择({{selectNewApps.length}})</p>
                <!-- <Tooltip placement="top" class='tooltip'> -->
                    <!-- <div slot="content">
                        <CheckboxGroup v-model="fruit" >
                            <Checkbox label="已选的服务器名称0"></Checkbox><br>
                            <Checkbox label="已选的服务器名称1"></Checkbox><br>
                            <Checkbox label="已选的服务器名称2"></Checkbox><br>
                        </CheckboxGroup>
                        <div class='tooltip-btn'>
                            <Button type="primary" size="small" >取消</Button>
                            <Button type="primary" size="small" >确认</Button>
                        </div>
                    </div> -->
                <!-- </Tooltip> -->
            </section>
        </Modal>

    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
    data(){
        return {
            selectNewApps: [],
            isApplyNewApplicaton: false,
            transfer: false,
            keyword: '',
            page: {
                pageSize: 10,
                pageNum: 1,
            },
            modalKeyword: '',
            modalPage: {
                pageSize: 10,
                pageNum: 1,
            },

            fruit: ['已选的服务器名称0'],
            serveName: '',
            modalTitle: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '应用编码',
                    key: 'appCode'
                },
                {
                    title: '应用名称',
                    key: 'appName'
                }
            ],
            appTitle: [
                {
                    title: '应用编码',
                    key: 'appCode'
                },
                {
                    title: '应用名称',
                    width: 200,
                    align: 'center',
                    key: 'appName'
                },
                {
                    title: 'API总数量',
                    width: 100,
                    align: 'center',
                    key: 'applyApiNum'
                },
                {
                    title: '操作',
                    key: 'address',

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
                                        this.$router.push({
                                            path: '/admin/applySchool/applySchoolDetail/applicationDetail',
                                            query: {
                                                schoolId: this.$route.query.schoolId,
                                                schoolName: this.$route.query.schoolName,
                                                appId: params.row.appId,
                                                appName: params.row.appName
                                            }
                                        })
                                    }
                                }
                            }, '查看明细'),
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
                                        this.REACCESS_SCHOOL({
                                            appId: params.row.appId,
                                            schoolId: this.$route.query.schoolId
                                        }).then(() => {
                                            this.$Notice.success({ title: '操作成功' })
                                        }).catch(error => {
                                            this.$Notice.error({ title: error })
                                        })
                                    }
                                }
                            }, '重新接入'),

                        ]);
                    }
                }
            ],

        }
    },
    computed: {
        ...mapState({
            appAccessedSchools: state => state.admin.appAccessedSchools,
            allowAccessedApp: state => state.admin.allowAccessedApp,
        }),
    },
    mounted(){
        // 查询某个学校已经接入的应用列表
        this.QUERY_APPS_ASCCESSED_SCHOOLS({ keyword: this.keyword, page: this.page, schoolId: this.$route.query.schoolId })
    },
    methods: {
        ...mapActions([
            'QUERY_APPS_ASCCESSED_SCHOOLS',
            'ALLOW_ACCESSED_APPS',
            'ACCESS_SCHOOL',
            'REACCESS_SCHOOL',
        ]),
        // 搜索
        searchApi(){
            this.QUERY_APPS_ASCCESSED_SCHOOLS({ keyword: this.keyword, page: this.page, schoolId: this.$route.query.schoolId })
        },
        // 分页
        pageChange(num){
            this.page.pageNum = num
            this.QUERY_APPS_ASCCESSED_SCHOOLS({ keyword: this.keyword, page: this.page, schoolId: this.$route.query.schoolId })
        },
        // 接入应用
        apply(){
            this.isApplyNewApplicaton = !this.isApplyNewApplicaton
            // 查询允许接入学校的应用列表
            this.ALLOW_ACCESSED_APPS({ keyword: this.modalKeyword, page: this.modalPage, schoolId: this.$route.query.schoolId })
        },
        confirm(){
            const appIds = this.selectNewApps.map(app => app.appId)
            this.ACCESS_SCHOOL({ appIds, schoolId: this.$route.query.schoolId }).then(() => {
                this.$Notice.success({title: '操作完成' })
                this.QUERY_APPS_ASCCESSED_SCHOOLS({ keyword: this.keyword, page: this.page, schoolId: this.$route.query.schoolId })
                this.selectNewApps = []
            }).catch(error => {
                this.$Notice.error({title: error })
            })
        },
        // modal分页
        modalPageChange(num){
            this.modalPageChange.pageNum = num
            this.ALLOW_ACCESSED_APPS({ keyword: this.modalKeyword, page: this.modalPage, schoolId: this.$route.query.schoolId })
        },
        // modal搜索
        search(){
            this.ALLOW_ACCESSED_APPS({ keyword: this.modalKeyword, page: this.modalPage, schoolId: this.$route.query.schoolId })
        },
        onSelectionChange(items) {
            this.selectNewApps = items
        }
    }
}
</script>

<style scoped>
.apply-school-detail {
    padding-left: 10px;
}
.title {
    height: 80px;
    line-height: 80px;
    font-weight: bold;
    font-size: 20px;
}
.apply-btn {
    margin: 10px 0;
}
.title-note {
    font-size: 14px;
}

</style>

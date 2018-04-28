<template>
    <div class="apply-school-detail">
        <!-- 面包屑 -->
        <Breadcrumb>
            <BreadcrumbItem to="/admin/applySchool">应用接入学校</BreadcrumbItem>
            <BreadcrumbItem :to="{ path:'/admin/applySchool/applySchoolDetail', query: { schoolId: $route.query.schoolId, schoolName: $route.query.schoolName } }">{{$route.query.schoolName}}</BreadcrumbItem>
            <BreadcrumbItem>{{$route.query.appName}}</BreadcrumbItem>
        </Breadcrumb>

        <h4 class='title'>{{$route.query.appName}} <span class='title-note'>({{$route.query.appId}})</span></h4>

        <Row class='search' :gutter="12">
            <Col span="10">
                <Input v-model="keyword" @on-enter="search" icon="ios-search-strong" clearable placeholder="请输入..."></Input>
            </Col>
            <Col span="3">
                <Button type="primary" class='search-btn' @click='search'>搜索</Button>
            </Col>
        </Row>


        <!-- 条件筛选 -->
        <Row class='more-search'>
            <Card>
                <Row :gutter="6" class="line-weight">
                    <Col span='2'>分类:</Col>
                    <Col span='9'>
                        <ApiClass v-model="apiClasses" @change="search" />
                    </Col>
                </Row>
                <Row :gutter="6" class="line-weight">
                    <Col span='2'>接口协议:</Col>
                    <Col span='9'>
                        <Button v-bind:type="protocol==''?'primary':'ghost'" size="small"  @click='searchPro("")'>全部</Button>
                        <Button v-bind:type="protocol=='1'?'primary':'ghost'" size="small"  @click='searchPro("1")'>SOAP</Button>
                        <Button v-bind:type="protocol=='2'?'primary':'ghost'" size="small"  @click='searchPro("2")'>RESTFUL</Button>
                    </Col>
                </Row>
                <Row>
                    <Col offset='20' span='4'>
                        <span class="span-p"  @click='clearEx'>清空筛选项</span>
                    </Col>
                </Row>
            </Card>
        </Row>


        <Row style='margin-top: 20px; '>
            <Table stripe :columns="schoolAppTitle" :data="schoolAppDetail.datas" @on-expand='onExpand'></Table>
            <div class="pagination">
                <Page :total="schoolAppDetail.total" size="small" show-elevator @on-change='pageChange'></Page>
            </div>
        </Row>

    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import ApiClass from '../../../components/ApiClass.vue';
import applicationDetaiTable from './component/applicationDetaiTable'

export default {
    components: {
        ApiClass
    },
    data(){
        return {
            keyword: '',
            page: {
                pageSize: 10,
                pageNum: 1,
            },
            protocol: '',
            apiClasses: [],
            schoolAppTitle: [
                {
                    type: 'expand',
                    width: 50,
                    render: (h, params) => {
                        return h(applicationDetaiTable, {
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
                    key: 'protocolName'
                },
                {
                    title: '申请接入时间',
                    key: 'applyAccessTime'
                },
            ],
        }
    },
    computed: {
        ...mapState({
            schoolAppDetail: state => state.admin.schoolAppDetail,
        }),
    },
    mounted(){
        this.SCHOOL_APP_DETAIL({
            apiClasses: this.apiClasses,
            appId: this.$route.query.appId,
            keyword: this.keyword,
            page: this.page,
            protocol: this.protocol,
            schoolId: this.$route.query.schoolId,
        })
    },
    methods: {
        ...mapActions(['SCHOOL_APP_DETAIL']),
        search(){
            this.SCHOOL_APP_DETAIL({
                apiClasses: this.apiClasses,
                appId: this.$route.query.appId,
                keyword: this.keyword,
                page: this.page,
                protocol: this.protocol,
                schoolId: this.$route.query.schoolId,
            })
        },
        pageChange(num){
            // console.log(num)
            this.page.pageNum = num
            this.SCHOOL_APP_DETAIL({
                apiClasses: this.apiClasses,
                appId: this.$route.query.appId,
                keyword: this.keyword,
                page: this.page,
                protocol: this.protocol,
                schoolId: this.$route.query.schoolId,
            })
        },
        searchPro(proFlag){
            this.protocol = proFlag
            this.search();
        },
        clearEx(){
             this.protocol=''
             this.apiClasses = [];
             this.search();
        },
        // 展开或收起某一行时触发
        onExpand(row, status){
            this.schoolAppDetail.datas.forEach(ele => {
                ele._expanded = false
                if(ele.apiId == row.apiId) {
                    ele._expanded = status
                }
            })
        },
    }
}
</script>

<style scoped>
.more-search,.add-btn,.table-data{
    padding-top: 20px;
}
.line-weight{
    line-height: 35px;
}
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
.span-p{
    color:#2d8cf0;
    cursor:pointer
}
</style>

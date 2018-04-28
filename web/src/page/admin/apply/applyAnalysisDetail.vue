<template>
<div>
    <Breadcrumb>
        <BreadcrumbItem to="/admin/applyAnalysis">
            统计分析
        </BreadcrumbItem>
        <BreadcrumbItem v-if="!isSchoolEnv && $route.query.from === 'school'" :to="{path: '/admin/applyAnalysis/applyAnalysisSchool', query: {
            apiId: $route.query.apiId,
            from: $route.query.from
        }}">
            学校明细
            ({{$route.query.schoolName}})
        </BreadcrumbItem>
        <BreadcrumbItem>应用明细</BreadcrumbItem>
    </Breadcrumb>
    <h3 class='title'>{{apiDetail.apiName}}</h3>
    <div class='section'>
        <span>访问URI：</span>
        <span>{{apiDetail.accessUri}}</span>
    </div>
    <div class='section'>
        <span>开发者：</span>
        <span>{{apiDetail.userName}}</span>
    </div>

    <h3 class='title'>应用明细</h3>
    <Row :gutter='10'>
        <Col span='10' >
            <Input v-model="keyword" @on-enter="search" clearable placeholder="请输入..."></Input>
        </Col>
        <Col span='4'>
            <Button type="primary" @click="search">搜索</Button>
        </Col>
    </Row>

    <div class="list">
        <div class="table-wrapper">
            <Table :columns="columns1" :data="apiAppMonitor.datas"></Table>
        </div>
        <div class="pagination">
            <Page :total="apiAppMonitor.total" show-elevator size='small' @on-change='apiPageChange'></Page>
        </div>
    </div>

</div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  data() {
    return {
        isSchoolEnv: false,
        keyword: '',
        apiPage: {
            pageSize: 10,
            pageNum: 1
        },
        columns1: [
            {
            title: '应用编码',
            key: 'appCode'
            },
            {
            title: '应用名称',
            key: 'appName'
            },
            {
            title: '调用总次数',
            key: 'totals',
            width: 150
            },
            {
            title: '成功次数',
            key: 'success',
            width: 100
            },
            {
            title: '失败次数',
            key: 'fail',
            width: 100
            },
            {
            title: '操作',
            align: 'center',
            render: (h, params) => {
                return h('div', [
                h(
                    'span',
                    {
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
                            this.$router.push({
                                path: '/admin/applyAnalysis/applyAnalysisAppDetail',
                                query: {
                                    schoolId: this.$route.query.schoolId,
                                    schoolName: this.$route.query.schoolName,
                                    apiId: this.$route.query.apiId ,
                                    appId: params.row.appId,
                                    appCode: params.row.appCode,
                                    from: this.$route.query.from,
                                }
                            });
                        }
                    }
                    },
                    '应用调用明细'
                )
                ]);
            }
        }
      ]
    };
  },
  created() {
    if (sessionStorage.common) {
        this.isSchoolEnv = JSON.parse(sessionStorage.common).isSchoolEnv;
    }
    this.GET_APIINFO({
      apiId: this.$route.query.apiId
    });
    this.search();
  },
  mounted() {
      window.scrollTo(0, 0);
  },
  computed: {
    ...mapState({
    //   adiMonitorDayDetail: state => state.admin.adiMonitorDayDetail,
    //   adiMonitorDetail: state => state.admin.adiMonitorDetail,
      apiAppMonitor: state => state.admin.queryApiAppMonitor,
      apiDetail: state => state.api.apiInfo,
    })
  },
  methods: {
    ...mapActions([
      'GET_APIINFO',
      'QUERY_API_APP_MONITOR'
    //   'API_MONITOR_DAY_DETAIL',
    //   'API_MONITOR_DETAIL'
    ]),
    apiPageChange(num) {
        this.apiPage.pageNum = num;
        this.search();
    },
    search() {
        this.QUERY_API_APP_MONITOR({
            apiId: this.$route.query.apiId,
            page: this.apiPage,
            keyword: this.keyword,
            schoolId: this.$route.query.schoolId
        })
        // if (this.isSchoolEnv) {
        //     this.API_MONITOR_DETAIL({
        //         apiId: this.$route.query.apiId,
        //         appCode: '',
        //         page: this.apiPage,
        //     })
        // } else {
        //     this.API_MONITOR_DAY_DETAIL({
        //         apiId: this.$route.query.apiId,
        //         appCode: '',
        //         page: this.apiPage,
        //         schoolId: this.$route.query.schoolId
        //     })
        // }
    }
  }
};
</script>

<style scoped>
.title {
  font-weight: bold;
  margin: 20px 0;
}

.section {
  font-size: 12px;
  line-height: 20px;
}
.table-wrapper {
  padding-top: 20px;
}
</style>

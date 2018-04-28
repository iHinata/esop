<template>
<div>
    <Breadcrumb>
        <BreadcrumbItem to="/admin/applyAnalysis">统计分析</BreadcrumbItem>
        <BreadcrumbItem>学校明细</BreadcrumbItem>
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

    <h3 class='title'>学校明细</h3>
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
            <Table :columns="columns1" :data="schools.datas"></Table>
        </div>
        <div class="pagination">
            <Page :total="schools.total" show-elevator size='small' @on-change='apiPageChange'></Page>
        </div>
    </div>




</div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  data() {
    return {
      keyword: '',
      apiPage: {
        pageSize: 10,
        pageNum: 1
      },
      columns1: [
        {
          title: '学校编码',
          key: 'schoolId'
        },
        {
          title: '学校名称',
          key: 'schoolName'
        },
        {
          title: '调用总次数',
          key: 'totals'
        },
        {
          title: '成功次数',
          key: 'success'
        },
        {
          title: '失败次数',
          key: 'fail'
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
                            path: '/admin/applyAnalysis/applyAnalysisApp',
                            query: {
                                schoolId: params.row.schoolId,
                                schoolName: params.row.schoolName ,
                                apiId: this.$route.query.apiId,
                                from: 'school'
                            }
                        });
                    }
                  }
                },
                '应用明细'
              )
            ]);
          }
        }
      ]
    };
  },
  mounted() {
    this.GET_APIINFO({
      apiId: this.$route.query.apiId
    });
    this.search();
    window.scrollTo(0, 0);
  },
  computed: {
    ...mapState({
    //   adiMonitorDayDetail: state => state.admin.adiMonitorDayDetail,
    //   adiMonitorDetail: state => state.admin.adiMonitorDetail,
      apiDetail: state => state.api.apiInfo,
      schools: state => state.api.schools
    })
  },
  methods: {
    ...mapActions([
      'GET_APIINFO',
      'QUERY_API_CALL_SCHOOLS'
    ]),
    apiPageChange(num) {
        this.apiPage.pageNum = num;
        this.search();
    },
    search() {
        this.QUERY_API_CALL_SCHOOLS({
            apiId: this.$route.query.apiId,
            keyword: this.keyword,
            page: this.apiPage
        });
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

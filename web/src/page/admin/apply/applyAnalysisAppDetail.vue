<template>
<div>
    <Breadcrumb>
        <BreadcrumbItem to="/admin/applyAnalysis">
            统计分析
        </BreadcrumbItem>
        <BreadcrumbItem v-if="!isSchoolEnv && $route.query.from === 'school'" :to="{path: '/admin/applyAnalysis/applyAnalysisSchool', query: {
            apiId: $route.query.apiId,
            from: $route.query.from,
            schoolName: $route.query.schoolName
        }}">
            学校明细
            ({{$route.query.schoolName}})
        </BreadcrumbItem>
        <BreadcrumbItem :to="{
          path: '/admin/applyAnalysis/applyAnalysisApp',
          query: {
              schoolId: $route.query.schoolId,
              apiId: $route.query.apiId,
              from: $route.query.from,
              schoolName: $route.query.schoolName
            }
        }">应用明细</BreadcrumbItem>
        <BreadcrumbItem>应用调用明细</BreadcrumbItem>
    </Breadcrumb>
    <h3 class='title'>{{apiDetail.apiName}}</h3>
    <div class='section'>
        <span>访问URI：</span>
        <span>{{apiDetail.accessUri}}</span>
    </div>
    <h3 class='title'>{{appInfo.appName}}</h3>
    <div class='section'>
        <span>应用编码：</span>
        <span>{{appInfo.appCode}}</span>
    </div>
    <div class='section'>
        <span>应用描述：</span>
        <span>{{appInfo.appDesc}}</span>
    </div>
    <div class='section'>
        <span>开发者姓名：</span>
        <span>{{appInfo.userName}}</span>
    </div>

    <h3 class='title'>应用调用明细</h3>
    <Row :gutter='10' v-if="isSchoolEnv">
        <Col span='10' >
            <Input v-model="keyword" @on-enter="search" clearable placeholder="请输入..."></Input>
        </Col>
        <Col span='4'>
            <Button type="primary" @click="search">搜索</Button>
        </Col>
    </Row>
    <Row style='margin: 10px 0; '>
        <Col span='21' v-if="isSchoolEnv">
            <DatePicker type="datetimerange" :value="dateGroup" placeholder="请选择时间段" style="width: 350px" @on-change='selectDate'></DatePicker>
        </Col>
        <Col span='21' v-if="!isSchoolEnv">
            <DatePicker type="daterange" :value="dateGroup" placeholder="请选择时间段" style="width: 350px" @on-change='selectDate'></DatePicker>
        </Col>
    </Row>
    <Row style='margin: 10px 0; ' v-if="isSchoolEnv">
        <Col span='2' style='height: 30px; line-height:30px; font-size: 12px; color: bbb'>结果:</Col>
        <Col span='21'>
            <Button :type="!resultCode?'primary':'ghost'" @click="resultSelect('')">全部</Button>
            <Button :type="resultCode=='1'?'primary':'ghost'" @click="resultSelect('1')">成功</Button>
            <Button :type="resultCode=='0'?'primary':'ghost'" @click="resultSelect('0')">失败</Button>
        </Col>
    </Row>
    <div class="list">
        <div class="table-wrapper">
            <Table :columns="columns2" v-if="isSchoolEnv" :data="apps.datas" @on-expand='onExpand'></Table> 
            <Table :columns="columns1" v-else :data="apps.datas"></Table> 
        </div>
        <div class="pagination">
            <Page :total="apps.total" show-elevator size='small' @on-change='apiPageChange'></Page>
        </div>
    </div>

</div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import applyAnalysisDetailTable from './component/applyAnalysisDetailTable'

export default {
  data() {
    return {
      isSchoolEnv: false,
      keyword: '',
      appInfo: {},
      apiDetail: {},
      resultCode: '',
      dateGroup: [],
      apiPage: {
        pageSize: 10,
        pageNum: 1
      },
      columns1: [
        {
          title: '统计时间',
          key: 'monitorDay'
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
        }
      ],
    columns2:  [
        {
            type: 'expand',
            width: 50,
            render: (h, params) => {
                return h(applyAnalysisDetailTable, {
                    props: {
                        row: params.row
                    }
                })
            }
        },
        {
            title: '请求IP',
            key: 'ip',
            width: 150
        }, 
        {
            title: '调用开始时间',
            key: 'beginTime',
            width: 200
        }, 
        {
            title: '耗时/ms',
            key: 'consume',
            width: 100
        }, 
        {
            title: '部署地址',
            key: 'deployHost'
        }, 
        {
            title: '结果',
            key: 'returnCode',
            width: 100
        }
        ]
    };
  },
  components: {
        applyAnalysisDetailTable,
  },
  created() {
    if (sessionStorage.common) {
      this.isSchoolEnv = JSON.parse(sessionStorage.common).isSchoolEnv;
    }
    this.GET_APPINFO_DETAIL({
      appId: this.$route.query.appId
    }).then(data => {
        this.appInfo = data
    })
    this.GET_APIINFO({ apiId: this.$route.query.apiId }).then(data => {
        this.apiDetail = data
    })
    this.search();
  },
  mounted() {
    window.scrollTo(0, 0);
  },
  computed: {
    ...mapState({
        adiMonitorDayDetail: state => state.admin.adiMonitorDayDetail,
        adiMonitorDetail: state => state.admin.adiMonitorDetail,
        apiAppMonitor: state => state.admin.queryApiAppMonitor
    }),
    apps() {
        if (this.isSchoolEnv) {
            return this.adiMonitorDetail
        } else {
            return this.adiMonitorDayDetail
        }
    }
  },
  methods: {
    ...mapActions([
        'GET_APPINFO_DETAIL',
        'API_MONITOR_DAY_DETAIL',
        'API_MONITOR_DETAIL',
        'GET_APIINFO',
    ]),
    apiPageChange(num) {
      this.apiPage.pageNum = num;
      this.search();
    },
    search() {
      if (this.isSchoolEnv) {
          this.API_MONITOR_DETAIL({
              apiId: this.$route.query.apiId,
              appCode: this.$route.query.appCode,
              keyword: this.keyword,
              resultCode: this.resultCode,
              timeRange: this.dateGroup,
              page: this.apiPage,
          })
      } else {
          this.API_MONITOR_DAY_DETAIL({
              apiId: this.$route.query.apiId,
              appCode: this.$route.query.appCode,
              timeRange: this.dateGroup,
              page: this.apiPage,
              schoolId: this.$route.query.schoolId
          })
      }
    },
    // 展开或收起某一行时触发
    onExpand(row, status){
        this.apps.datas.forEach(ele => {
            ele._expanded = false
            if(ele.id == row.id) {
                ele._expanded = status
            }
        })
    },
    // 设置过滤条件
    resultSelect(code){
        this.resultCode = code
        this.search();
    },
    // 当设置时间后的选择
    selectDate(date){
        this.dateGroup[0] = date[0]
        this.dateGroup[1] = date[1]
        this.search();
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

<template>
    <div>
        <Row class='filter'>
            <Col span='8' v-if="!isSchoolEnv">
            <Select v-model="schoolId" style="width:200px" filterable clearable @on-change='selectSchool' placeholder="所有学校">
                <Option v-for="(item, i) in schoolInfos" :value="item.id" :key="i">{{ item.name }}</Option>
            </Select>
            </Col>

            <Col span='8'>
            <div class="tags">
                <span @click='chooseTag(i)' class='tags-span' :class="currentTag==i?'tags-span-active':''" v-for='(item,i) in tagLists' :key='i'>
                    {{ item.name }}
                </span>
            </div>
            </Col>
            <Col span='8' style='text-align: right; '>
            <DatePicker :value="dateGroup" format="yyyy-MM-dd" type="daterange" placement="bottom-end" placeholder="请选择时间段" style="width: 250px"
                @on-change='selectData'></DatePicker>
            </Col>
        </Row>

        <!-- 柱状图 -->
        <div id="main"></div>

        <!-- api被调用列表 -->
        <div class="list">
            <h3 class='list-title'>API调用次数列表</h3>
            <Row class='search' :gutter="10">
                <Col span="8">
                    <Input v-model="keyword" icon="ios-search-strong" placeholder="请输入..." clearable @on-enter='selectSchool'></Input>
                </Col>
                <Col span="2">
                    <Button type="primary" long @click='selectSchool'>搜索</Button>
                </Col>
            </Row>
            <div class='table-wrapper'>
                <Table :columns="apiInvokeColumn" @on-sort-change="sortChange" :data="queryApiMonitor.datas"></Table>
            </div>
            <div class="pagination">
                <Page :total="queryApiMonitor.total" show-elevator @on-change='apiPageChange'></Page>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapActions, mapState } from 'vuex'
    let echarts = require('echarts')

    export default {
        data() {
            return {
                tagLists: [
                    { name: '全部', value: 0 },
                    { name: '今日', value: 1 },
                    { name: '昨日', value: 2 },
                    { name: '近7天', value: 3 },
                    { name: '近30天', value: 4 }
                ],
                currentTag: 0,
                myChart: null,
                dateGroup: [],
                apiPage: {
                    pageSize: 10,
                    pageNum: 1
                },
                orderType: '1',
                schoolId: '',
                isSchoolEnv: false,
                keyword: '',
                apiInvokeColumn: [
                    {
                        title: 'API名称',
                        key: 'apiName'
                    },
                    {
                        title: '调用总次数',
                        key: 'totals',
                        width: 130,
                        sortable: 'custom'

                    },
                    {
                        title: '成功次数',
                        key: 'success',
                        width: 130,
                        sortable: 'custom'
                    },
                    {
                        title: '失败次数',
                        key: 'fail',
                        width: 130,
                        sortable: 'custom'
                    },
                    {
                        title: '操作',
                        width: 100,
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
                                    cursor: 'pointer'
                                },
                                on: {
                                    click: () => {
                                        this.toDetail( params.row)
                                    }
                                }
                            }, '详情'),
                        ])
                    }
                    },
                ]
            };
        },
        created() {
            if (sessionStorage.common) {
                this.isSchoolEnv = JSON.parse(sessionStorage.common).isSchoolEnv;
            }
        },
        computed: {
            ...mapState({
                top10: state => state.admin.top10,
                queryApiMonitor: state => state.admin.queryApiMonitor,
                schoolInfos: state => state.admin.schoolInfos
            }),
        },
        mounted() {
            // 查询Top10的接口调用情况
            this.queryTop10()
            // 查询API调用结果列表
            this.queryApiCallList()
            //  学校列表
            this.QUERY_ALL_SCHOOLINFOS()
        },
        watch: {
            top10() {
                this.initEchart()
            },
            schoolInfos(schools) {
                if (this.isSchoolEnv && schools[0]) {
                    this.schoolId = schools[0].id
                }
            }
        },
        methods: {
            ...mapActions([
                'TOP10_MONITOR',
                'QUERY_API_MONITOR',
                'QUERY_ALL_SCHOOLINFOS'
            ]),
            //
            initEchart() {
                if (!this.myChart) {
                    this.myChart = echarts.init(document.getElementById('main'))
                }
                const xAxis = this.top10.map(item => item.apiName)
                const success = this.top10.map(item => item.success)
                const fail = this.top10.map(item => item.fail)

                let option = {
                    title: {
                        text: 'API调用次数Top10',
                        top: 0,
                        x: 'center',
                        textStyle: {
                            fontWeight: 'bold',
                            fontSize: '18'
                        }
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            // 坐标轴指示器，坐标轴触发有效
                            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                        },
                        formatter: '{b}<br/>成功次数: {c0}<br/>失败次数: {c1}'
                    },
                    legend: {
                        data: ['成功', '失败'],
                        top: 30
                    },
                    grid: {
                        left: '10%',
                        right: '10%',
                        top: '10%',
                        bottom: '0',
                        containLabel: true
                    },
                    xAxis: [
                        {
                            name: 'API名称',
                            type: 'category',
                            data: xAxis,
                            axisTick: {
                                show: false
                            },
                            axisLabel: {  
                                interval:0,  
                                rotate:15  
                            },
                        }
                    ],
                    
                    yAxis: [
                        {
                            name: '次',
                            type: 'value',
                            axisLine: {
                                show: false
                            },
                            axisTick: {
                                show: false
                            },
                            splitLine: {
                                lineStyle: {
                                    type: 'dashed'
                                }
                            }
                        }
                    ],
                    series: [
                        {
                            name: '成功',
                            type: 'bar',
                            stack: '调用次数',
                            color: '#5abfcc',
                            data: success
                        },
                        {
                            name: '失败',
                            type: 'bar',
                            stack: '调用次数',
                            color: '#ed6575',
                            data: fail
                        }
                    ]
                };

                this.myChart.setOption(option)
            },
            //
            chooseTag(i) {
                let now = new Date().getTime()
                this.currentTag = i;
                switch (i) {
                    case 0:
                        this.dateGroup = ['', '']
                        break;
                    case 1:
                        this.dateGroup = [this.formatDate(now), this.formatDate(now)]
                        break;
                    case 2:
                        this.dateGroup = [this.formatDate(now - 86400000), this.formatDate(now - 86400000)]
                        break;
                    case 3:
                        this.dateGroup = [this.formatDate(now - 604800000), this.formatDate(now)]
                        break;
                    case 4:
                        this.dateGroup = [this.formatDate(now - 2592000000), this.formatDate(now)]
                        break;
                }
                this.queryTop10()
                this.queryApiCallList()
            },
            queryTop10() {
                this.TOP10_MONITOR({
                    startDate: this.dateGroup[0]
                        ? this.formatDate(this.dateGroup[0])
                        : undefined,
                    endDate: this.dateGroup[1]
                        ? this.formatDate(this.dateGroup[1])
                        : undefined,
                    schoolId: this.schoolId
                })
            },
            queryApiCallList() {
                this.QUERY_API_MONITOR({
                    startDate: this.dateGroup[0]
                        ? this.formatDate(this.dateGroup[0])
                        : undefined,
                    endDate: this.dateGroup[1]
                        ? this.formatDate(this.dateGroup[1])
                        : undefined,
                    page: this.apiPage,
                    orderType: this.orderType,
                    schoolId: this.schoolId,
                    keyword: this.keyword,
                })
            },
            formatDate(date) {
                const d = new Date(date)
                return `${d.getFullYear()}-${
                    d.getMonth() + 1 >= 10 ? d.getMonth() + 1 : '0' + (d.getMonth() + 1)
                    }-${d.getDate() < 10 ? '0' + d.getDate() : d.getDate()}`
            },
            //
            apiPageChange(num) {
                this.apiPage.pageNum = num
                this.queryApiCallList()
            },
            // 选择某个学校后显示具体数据
            selectSchool() {
                this.queryTop10()
                this.queryApiCallList()
            },
            // 当时间发生变更时调用接口修改数据
            selectData(date) {
                this.dateGroup[0] = date[0]
                this.dateGroup[1] = date[1]
                this.currentTag = -1
                this.queryTop10()
                this.queryApiCallList()
            },
            sortChange(column){
                // 排序方式 0-总数升序 1-总数降序 2-成功数升序 3-成功数降序 4-失败升序 5-失败降序
                if (column.key == 'totals'){
                    if (column.order == 'asc'){
                        this.orderType = '0'
                    }else {
                        this.orderType = '1'
                    }
                } else if (column.key == 'success'){
                    if (column.order == 'asc'){
                        this.orderType = '2'
                    }else {
                        this.orderType = '3'
                    } 
                }else {
                    if (column.order == 'asc'){
                        this.orderType = '4'
                    }else {
                        this.orderType = '5'
                    }
                }
                this.queryApiCallList()
            },
            toDetail(item) {
                if (this.schoolId === '' && !this.isSchoolEnv) {
                    // 全部学校, 进入学校列表页面
                    this.$router.push({
                        path: '/admin/applyAnalysis/applyAnalysisSchool',
                        query: { apiId: item.apiId }
                    })
                } 
                else {
                    const schools = this.schoolInfos.filter(item => item.id === this.schoolId)
                    this.$router.push({
                        path: '/admin/applyAnalysis/applyAnalysisApp',
                        query: { schoolId: this.schoolId, 
                                 schoolName: schools[0].name, 
                                 apiId: item.apiId ,
                                 from: 'school'}
                    })
                }
            }
        }
    }
</script>

<style scoped>
    .filter {
        border: 1px solid #dddee1;
        padding: 10px;
        margin-bottom: 20px;
    }

    #main {
        width: 910px;
        height: 600px;
        padding: 20px 0;
    }

    .tags {
        height: 24px;
        margin: 5px 0;
    }

    .tags-span {
        font-size: 12px;
        width: 45px;
        height: 24px;
        text-align: center;
        line-height: 24px;
        display: inline-block;
        cursor: pointer;
        border: 1px solid #2d8cf0;
        border-radius: 4px;
        color: #2d8cf0;
        margin: 0 4px;
    }

    .tags-span-active {
        background: #2d8cf0;
        color: #fff;
    }

    .list-title {
        font-size: 18px;
        font-weight: bold;
        padding: 20px 0;
    }

    .table-common {
        height: 40px;
        line-height: 40px;
        font-size: 12px;
    }

    .table-common:hover {
        background: #eef1f6;
    }

    .rotate {
        transform: rotate(90deg);
        -ms-transform: rotate(90deg);
        -moz-transform: rotate(90deg);
        -webkit-transform: rotate(90deg);
        -o-transform: rotate(90deg);
        padding-right: 3px;
        padding-bottom: 3px;
        cursor: pointer;
        color: #2d8cf0;
    }
    .search {
        padding-bottom: 20px; 
    }
</style>
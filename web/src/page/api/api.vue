<template>

<div class="api">
    <Breadcrumb v-if='!showTabFlag'>
        <BreadcrumbItem @click.native="toApi" class="bread">API中心</BreadcrumbItem>
        <BreadcrumbItem>搜索结果</BreadcrumbItem>
    </Breadcrumb>

    <Row class='search'>
        <Input v-model="keyword" clearable  placeholder="请输入..." class='search-input' @on-enter='search'></Input>
        <Button type="primary" class='search-btn' @click='search'>搜索</Button>
    </Row>

    <div class="show-result" v-if='!showTabFlag'>共<span style="color: #2d8cf0;"> {{ searchApi.total }} </span>条搜索结果</div>

    <Row class='tabs' v-if='showTabFlag'>
        <Tabs :value="firstClassId" :animated='false' @on-click='chooseTabPane' >
            <TabPane :label="item1.className" :name="item1.classId" v-for='(item1, i1) in firstClass' :key='i1' >
                <Row :gutter='10'>
                    <Col span="5" >
                        <div class='api-left'>
                            <Menu :active-name="secondClassId" 
                            :accordion='true' @on-select='selectMenu' 
                            v-if='childClass.length' 
                            width='auto'>
                                <Submenu :name="item2.classId" v-for='(item2, i2) in childClass' :key='i2' >
                                    <template slot="title">
                                        <span>{{ item2.className }}</span>
                                    </template>
                                    <MenuItem :name="item3.classId" v-for='(item3, i3) in item2.childApiClasses' :key='i3'>
                                        {{ item3.className }}
                                    </MenuItem>
                                </Submenu>
                            </Menu>
                            <div class="empty" v-else >当前列表数据为空 </div>
                        </div>
                    </Col>

                    <Col span="19" >
                        <div class='table-wrapper'>
                            <Table stripe :columns="apiListTtile" :data="api.datas"  @on-expand='onExpand'></Table>
                        </div>
                        <div class="pagination">
                            <Page :total="api.total" :page-size='page.pageSize' show-elevator @on-change='pageChange' ></Page>
                        </div>
                    </Col>
                </Row>
                
            </TabPane>
        </Tabs>
    </Row>

    <div class='list' v-else>
        <div class='table-wrapper'>
            <Table stripe :columns="searchApiTtile" :data="searchApi.datas"  @on-expand='onExpand'></Table>
        </div>
        <div class='pagination'>
            <Page :total="searchApi.total" :page-size='searchApiPage.pageSize' show-elevator @on-change='searchApiPageChange' ></Page>
        </div>
    </div>

</div>

</template>

<script>
import { mapActions, mapState } from 'vuex'
import apiExpand from '@/page/developer/releaseApi/apiExpand'

export default {

    data(){
        return {
            keyword: '',
            showTabFlag: true,
            firstClassId: '',
            secondClassId: '',
            openNameArr: [],
            page: {
                pageNum: 1,
                pageSize: 8,
            },
            apiListTtile: [
                {
                    type: 'expand',
                    width: 50,
                    render: (h, params) => {
                        return h(apiExpand, {
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
                    title: '接口协议',
                    width: 120,
                    key: 'protocolName'
                },
                {
                    title: '标签',
                    width: 120,
                    key: 'labelName'
                },
                {
                    title: '所属应用',
                    width: 120,
                    key: 'providerName'
                },
                {
                    title: '详情',
                    key: 'address',
                    width: 120,
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            h('span', {
                                props: {
                                    type: 'eye',
                                    size: '20',
                                },
                                style: {
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    color: '#2b85e4',
                                },
                                on: {
                                    click: () => {
                                        // console.log(params)
                                        this.$router.push({ path: '/api/apiDetail', query: { apiId: params.row.apiId, type: 0 } })
                                    }
                                }
                            }, '查看')
                        ])
                    }
                }
            ],

            searchApiPage: {
                pageNum: 1,
                pageSize: 8,
            },
            searchApiTtile: [
                {
                    type: 'expand',
                    width: 50,
                    render: (h, params) => {
                        return h(apiExpand, {
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
                    width: 200,
                    key: 'className'
                },
                {
                    title: '接口协议',
                    width: 120,
                    key: 'protocolName'
                },
                {
                    title: '标签',
                    width: 120,
                    key: 'labelName'
                },
                {
                    title: '所属应用',
                    width: 120,
                    key: 'providerName'
                },
                {
                    title: '详情',
                    key: 'address',
                    width: 120,
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            h('span', {
                                props: {
                                    type: 'eye',
                                    size: '20',
                                },
                                style: {
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    color: '#2b85e4',
                                },
                                on: {
                                    click: () => {
                                        // console.log(params)
                                        this.$router.push({ path: '/api/apiDetail', query: { apiId: params.row.apiId, type: '0' } })
                                    }
                                }
                            }, '查看')
                        ])
                    }
                }
            ],

        }
    },

    ompponents: {
        apiExpand,
    },

    computed: {
        ...mapState({
            firstClass: state => state.index.firstClass,
            childClass: state => state.index.childClass,
            api: state => state.api.api,
            searchApi: state => state.api.searchApi,
        }),
    },

    mounted(){
        // 一级分类
        this.GET_FIRST_CLASS({ needDetail: true }).then(data => {
            this.firstClassId = this.$route.query.classId || data[0].classId
            this.chooseTabPane(this.firstClassId)
        })

    },

    methods: {
        ...mapActions([
            'GET_FIRST_CLASS', 
            'GET_CHILD_CLASS',
            'GET_API_LIST_BY_CLASS_ID',
            'SEARCH_API',
        ]),
        // 分页
        pageChange(num){
            this.showTabFlag = true
            this.page.pageNum = num
            this.GET_API_LIST_BY_CLASS_ID({ page: this.page, classId: this.secondClassId })
        },
        // 点击选择tab
        chooseTabPane(val){
            this.showTabFlag = true
            this.GET_CHILD_CLASS({ pid: val })
            this.selectMenu(val)
        },
        // 点击选择列表
        selectMenu(id){
            this.showTabFlag = true
            this.secondClassId = id
            this.GET_API_LIST_BY_CLASS_ID({ page: this.page, classId: this.secondClassId })
        },
        // 展开或收起某一行时触发
        onExpand(row, status){
            let array = []
            if(this.showTabFlag) {
                array = this.api.datas 
            }
            else {
                array = this.searchApi.datas 
            }
            array.forEach(ele => {
                ele._expanded = false
                if(ele.apiId == row.apiId) {
                    ele._expanded = status
                }
            })
        },
        // 搜索api
        search(){
            this.showTabFlag = false
            this.SEARCH_API({ keyword: this.keyword, page: this.searchApiPage })
        },
        // 搜索页分页
        searchApiPageChange(num){
            this.showTabFlag = false
            this.searchApiPage.pageNum = num
            this.SEARCH_API({ keyword: this.keyword, page: this.searchApiPage })
        },
        // 跳转到API分类的页面
        toApi(){
            this.showTabFlag = true
            this.keyword = ''
        }
    },

}
</script>

<style scoped>
.api {
    width: 100%;
    min-height: 700px;
    overflow-x: hidden;
    padding-top: 20px;
    position: relative;
}  

.search {
    margin: 20px 0;
}

.search-input {
    width: 400px;
}

.search-btn {
    width: 80px;
}

.show-result {
    font-size: 14px;
    margin: 20px 0;
}

.ivu-menu {
    z-index: 0 !important;
}
.table-wrapper {
    height: 521px;
}
.api-left {
    min-height: 500px;
}
.api-left .empty {
    margin-top: 240px;
    text-align: center;
    font-size: 12px;
    height: 20px;
    line-height: 20px;
}
.list {
    min-height: 400px;
}
.bread {
    cursor: pointer;
    color: #2d8cf0;
}
</style>
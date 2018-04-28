<template>
    <div class="apply-school-detail">
        <Row class='search' :gutter="12">
            <Col span="10">
                <Input v-model="keyword" icon="ios-search-strong" @on-enter="search" clearable placeholder="请输入..."  class='search-input'></Input>
            </Col>
            <Col span="3">
                <Button type="primary" class='search-btn' @click='search'>搜索</Button>
            </Col>
        </Row>

        <Row >
            <div class='table-wrapper'>
                <Table stripe :columns="appInfoTitle" :data="appInfo.datas"></Table>
            </div>
            
            <div class="pagination" v-if='appInfo.total'>
                <Page :total="appInfo.total" :page-size='page.pageSize' show-elevator @on-change='pageChange'></Page>
            </div>
        </Row>

        <!-- 维护应用 -->
        <Modal v-model="isShowModal" title="维护应用" @on-ok="confirm" width='800' :transfer='transfer'>
            <Form :model="appDetailInfo" :label-width="80">
                <FormItem label="应用编码">
                    <Input v-model="appDetailInfo.appNo" placeholder="自动生成，用户可手动修改" disabled></Input>
                </FormItem>
                <FormItem label="应用名称">
                    <Input v-model.trim="appDetailInfo.appName" placeholder="应用名称"></Input>
                </FormItem>
                <FormItem label="应用描述">
                    <Input type="textarea" v-model="appDetailInfo.appDesc" placeholder="应用描述"></Input>
                </FormItem>
                <FormItem label="开发者维护">
                    <Select v-model="appDetailInfo.users" multiple >
                        <Option v-for="item in allUsers" :value="item.userId" :key="item.userId">{{ item.name }}</Option>
                    </Select>
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
            isShowModal: false,
            transfer: false,
            keyword: '',
            page: {
                pageNum: 1,
                pageSize: 8,
            },
            appDetailInfo: {},
            appInfoTitle: [
                {
                    title: '应用编码',
                    key: 'appNo'
                },
                {
                    title: '应用名称',
                    key: 'appName'
                },
                {
                    title: '开发者账号',
                    key: 'allUsers'
                },
                {
                    title: '操作',
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
                                        this.displayAppDetail(params.row.appId)
                                    }
                                }
                            }, '维护'),
                        ])
                    }
                }
            ],
            allUsers: [],

        }
    },
    computed: {
        ...mapState({
            appInfo: state => state.admin.appInfo,
        }),
    },
    mounted(){
        // 查询系统中提供的APP列表
        this.QUERY_APP_INFOS({ keyword: this.keyword, page: this.page })
    },
    methods: {
        ...mapActions(['QUERY_APP_INFOS', 'MODIFY_APP_INFOS','GET_APPINFO_DETAIL','QUERY_ALL_DEVELOPER']),

        search(){
            this.QUERY_APP_INFOS({ keyword: this.keyword, page: this.page })
        },

        pageChange(num){
            this.page.pageNum = num
            this.QUERY_APP_INFOS({ keyword: this.keyword, page: this.page })
        },
        displayAppDetail(appId){
            this.GET_APPINFO_DETAIL({appId:appId}).then((data) => {
                this.isShowModal = !this.isShowModal
                this.appDetailInfo = data
            })
            this.QUERY_ALL_DEVELOPER({}).then((data) => {
                this.allUsers = data
            })
        },

        confirm(){
            if(!this.appDetailInfo.appName) {
                this.$Notice.info({ title: '应用名称不得为空'})
                return
            }
            if(this.appDetailInfo.appName.length > 50) {
                this.$Notice.info({ title: '名称长度不能超过50位'})
                return
            }
            this.MODIFY_APP_INFOS({
                appDesc: this.appDetailInfo.appDesc,
                appName: this.appDetailInfo.appName,
                appId: this.appDetailInfo.appId,
                userIds: this.appDetailInfo.users,
            }).then(() => {
                this.$Notice.success({ title: '操作完成' })
                this.QUERY_APP_INFOS({ keyword: this.keyword, page: this.page })
            }).catch(error => {
                this.$Notice.error({ title: error })
            })
        },


    }
}
</script>

<style scoped>
.table-wrapper {
    height: 450px;
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
.search {
    margin-bottom: 20px;
}

</style>

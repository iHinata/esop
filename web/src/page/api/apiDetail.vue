<template>
    <div class='api-detail'>
        <Breadcrumb class='breadcrumb'>
            <BreadcrumbItem @click.native='$router.go(-1)'>返回</BreadcrumbItem>
            <BreadcrumbItem>API详情</BreadcrumbItem>
        </Breadcrumb>
        <Row class='detail-section'>{{ detail.apiName||'' }}</Row>
        <Row class='detail-section'>
            <span class='detail-section-tag' v-for='(label, i) in detail.labelNames' :key='i'>{{ label }}</span>
        </Row>
        <Row class='detail-section' v-if='$route.query.type==2'>
            <Col span='2' class='detail-l'>开发者姓名:</Col><Col span='22'>{{ detail.userName }}</Col>
        </Row>
        <Row class='detail-section'>
            <Col span='2' class='detail-l'>分类:</Col><Col span='22'>{{ detail.className }}</Col>
        </Row>
        <Row class='detail-section'>
            <Col span='2' class='detail-l'>接口协议:</Col><Col span='22'>{{ detail.protocolName }}</Col>
        </Row>
        <Row class='detail-section'>
            <Col span='2' class='detail-l'>所属应用:</Col><Col span='22'>{{ detail.providerName }}</Col>
        </Row>
        <Row class='detail-section' v-if='detail.deployUri'>
            <Col span='2' class='detail-l'>部署URI:</Col><Col span='22' style="word-wrap:break-word">{{ detail.deployUri }}</Col>
        </Row>
        <Row class='detail-section'>
            <Col span='2' class='detail-l'>访问URI:</Col><Col span='22' style="word-wrap:break-word">{{ detail.accessUri }}</Col>
        </Row>
        <Row class='detail-section'>
            <Col span='2' class='detail-l'>部署上下文:</Col><Col span='22'>{{ detail.context }}</Col>
        </Row>
        <Row class='detail-section'>
            <Col span='2' class='detail-l'>描述:</Col>
            <Col span='22' style="word-wrap:break-word">{{ detail.apiDesc }}</Col>
        </Row>
        <div class='methods' v-if='detail.apiMethods'>
            <h4 class='title'>API方法信息({{ detail.apiMethods.length }})</h4>
            <Collapse v-model="methodsNum" accordion @on-change='methodsChange'>
                <Panel :name="item.methodId" v-for='(item,i) in detail.apiMethods' :key='i'>
                    <p class="methods-name">方法名称: {{ item.methodName }}</p>
                    <div slot="content">
                        <div class="methods-common">
                            <p>方法描述:</p>
                            <p v-html='item.methodDesc'></p>
                        </div>
                        <div class="methods-common">
                            <p>请求参数:</p>
                            <p v-html='item.reqParam'></p>
                        </div>
                        <div class="methods-common">
                            <p>响应参数:</p>
                            <p v-html='item.rspParam'></p>
                        </div>
                    </div>
                </Panel>
            </Collapse>
        </div>

        <!-- 开发者权限 -->
        <Row v-if='detail.auditInfo'>
            <h4 class='title'>API审核信息</h4>
            <div>
                <p class='result-p' >审核结果: {{ detail.auditInfo.statusName }}</p>
                <p class='result-p' >审核意见: {{ detail.auditInfo.verfyView }}</p>
            </div>
        </Row>
        <div class="edit-btn" v-if='$route.query.type=="2"'>
            <Button type="primary" v-if='detail.status=="0"' @click='isExamineModal=!isExamineModal'>审核</Button>
            <Button type="primary" icon="edit" @click='toEdit'>编辑模式</Button>
        </div>
        <div class="edit-btn" v-if='$route.query.type=="1"'>
            <Button type="primary" icon="edit" @click='toEdit'>编辑模式</Button>
        </div>
        
        <!-- API被调应用列表 -->
        <Row v-if='$route.query.type=="2"'>
            <h4 class='title'>API被调应用列表</h4>
            <Row class='search' :gutter="10">
                <Col span="8">
                    <Input v-model="appKeyword" icon="ios-search-strong"  clearable placeholder="请输入..." @on-enter='searchApp'></Input>
                </Col>
                <Col span="2">
                    <Button type="primary" long @click='searchApp'>搜索</Button>
                </Col>
            </Row>
            <Table stripe :columns="appTitle" :data="invokeApps.datas"></Table>
            <div class="pagintion">
                <Page :total="invokeApps.total" show-elevator size="small" @on-change='appPageChange'></Page>
            </div>
        </Row>

        <!-- 审核 -->
        <Modal v-model="isExamineModal" title="审核API" @on-ok="examineApiConfirm" width='600' :transfer='transfer'>
            <Row>
                <Col span='3' style='height: 20px; line-height: 20px; '>审核结果:</Col>
                <Col span='21'>
                    <RadioGroup v-model="examineResult">
                        <Radio label="3">审核通过</Radio>
                        <Radio label="2">审核退回</Radio>
                    </RadioGroup>
                </Col>
            </Row>
            <Row style='margin-top: 20px; '>
                <Col span='3' style='height: 20px; line-height: 20px; '>审核意见:</Col>
                <Col span='21'>
                    <Input v-model="examineOptions" type="textarea" 
                    :autosize="{minRows: 4,maxRows: 8}" 
                    placeholder="请输入审核意见" ></Input>
                </Col>
            </Row>
        </Modal>


    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
    data(){
        return {
            detail: {},
            invokeApps: {},
            role: '',
            appKeyword: '',
            examineResult: '3',
            examineOptions: '',
            transfer: false,
            isExamineModal: false,
            methodsNum: '1',
            appTitle: [
                {
                    title: '应用编码',
                    key: 'appCode'
                },
                {
                    title: '应用名称',
                    key: 'appName'
                },
            ],
            page: {
                pageNum: 1,
                pageSize: 5
            }
        }
    },    
    mounted(){
        // 获取api详情
        let apiId = this.$route.query.apiId
        // type :0表示游客，1表示开发者，2表示管理员
        let type = this.$route.query.type || '0'    
        switch(type){
            case '0':
                this.GET_VISITOR_API_DETAIL({ apiId: apiId }).then(data => {
                    this.detail = data
                })
                break
            case '1':
                this.GET_API_DETAIL({ apiId: apiId }).then(data => {
                    this.detail = data
                })
                break
            case '2':
                this.GET_API_BASIC_INFO({ apiId: apiId }).then(data => {
                    this.detail = data
                })
                 // 查询某个接入学校的APP的接入详情
                this.QUERY_APP_BY_API({ apiId: this.$route.query.apiId, page: this.page }).then(data => {
                    this.invokeApps = data
                })
                break
        }
    },
    computed: {
    },
    methods: {
        ...mapActions([
            'GET_VISITOR_API_DETAIL',   // 游客
            'GET_API_DETAIL',           // 开发者
            'GET_API_BASIC_INFO',       // 管理员
            'QUERY_APP_BY_API',
        ]),
        // 分页
        appPageChange(num){
            this.page.pageNum = num
            // 查询某个接入学校的APP的接入详情
            this.QUERY_APP_BY_API({ apiId: this.$route.query.apiId, page: this.page,keyword: this.appKeyword }).then(data => {
                this.invokeApps = data
            })
        },
        methodsChange(val) {
            // console.log(val)
        },

        toEdit(){
            this.$router.push({ path: '/developer/editApi', query: { apiId: this.$route.query.apiId } })
        },

        examineApiConfirm(){
            this.$Notice.success({ title: '操作完成' })
        },
        searchApp() {
            this.QUERY_APP_BY_API({ apiId: this.$route.query.apiId, page: this.page,keyword: this.appKeyword }).then(data => {
                this.invokeApps = data
            })
        }
    }
}
</script>

<style scoped>
.breadcrumb {
    margin: 10px 0;
    background: #fff;
    cursor: pointer;
}
.api-detail {
    padding: 20px;
    position: relative;
    min-height: 600px;
}
.detail-section {
    line-height: 20px;
    padding: 15px 0;
}
.detail-section-tag {
    border: 1px solid #2d8cf0;
    padding: 2px 4px;
    color: #2d8cf0;
    border-radius: 5px;
    background: #e6f7ff;
    margin: 0 5px;
}
.detail-section:first-child {
    font-size: 20px;
    font-weight: bold;
}
.pagintion {
    text-align: center;
    padding: 10px 0;
}
.detail-l {
    text-align: right;
    padding-right: 20px;
    font-weight: 550;
}  

.title {
    height: 80px;
    line-height: 80px;
    border-top: 1px solid #eee;
    font-weight: bold;
    font-size: 20px;
}
.methods-name {
    margin-top: -36px; 
    margin-left: 10px;
}
/* 审核信息 */
.result-p {
    margin: 15px 0;
}

.edit-btn {
    position: absolute;
    right: 36px;
    top: 36px; 
}
.methods-common p {
    margin: 10px 0;
}
.search {
    padding-bottom: 20px; 
}
</style>
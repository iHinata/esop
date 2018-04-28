<template>

<div>

    <Row class='search' :gutter="12">
        <Col span="10">
            <Input v-model="keyword" icon="ios-search-strong" clearable placeholder="请输入..."  @on-enter='filter'></Input>
        </Col>
        <Col span="3">
            <Button type="primary" class='search-btn' @click='filter'>搜索</Button>
        </Col>
    </Row>

    <Row style='margin: 10px 0; '>
        <Col span='2' style='height: 30px; line-height:30px; font-size: 12px; color: bbb'>开发者身份:</Col>
        <Col span='22'>
            <Button :type="!source?'primary':'ghost'" @click="choose('')">全部</Button>
            <Button :type="source==1?'primary':'ghost'" @click="choose(1)">校内</Button>
            <Button :type="source==2?'primary':'ghost'" @click="choose(2)">校外</Button>
        </Col>
    </Row>

    <Row>
        <div class="table" v-if="userInfo.roles == 0">
            <Row class='table-common title'>
                <Col span='5'><p>开发者账号</p></Col>
                <Col span='2'><p>用户名</p></Col>
                <Col span='3'><p>手机号</p></Col>
                <Col span='5'><p>邮箱</p></Col>
                <Col span='2'><p>身份</p></Col>
                <Col span='2'><p>免审核</p></Col>
                <Col span='4'><p>管理员权限</p></Col>
                <Col span='1'><p>操作</p></Col>
            </Row>
            <Row class='table-common' v-for='(item, i) in userList.datas' :key='i' >
                <Col span='5'><p v-text="item.userAccount.length>20?item.userAccount.substring(0,19)+'...':item.userAccount" :title="item.userAccount"></p></Col>
                <Col span='2'><p v-if="item.username" v-text="item.username.length>6?item.username.substring(0,5)+'...':item.username" :title="item.username"/><p v-else="item.username">-</p></Col>
                <Col span='3'><p>{{ item.phoneNo }}</p></Col>
                <Col span='5'><p v-if="item.email" v-text="item.email.length>20?item.email.substring(0,19)+'...':item.email" :title="item.email"/><p v-else="item.email">-</p></Col>
                <Col span='2'><p>{{ item.sourceName }}</p></Col>
                <Col span='2'>
                    <p>
                        <i-switch v-model="item.autoCheck" @on-change="switchChange(item)">
                            <span slot="open">开</span>
                            <span slot="close">关</span>
                        </i-switch>
                    </p> 
                </Col>
                <Col span='4' v-if="userInfo.roles == 0">
                    <p>
                        <Select v-model="item.roles" filterable @on-change='selectChange(item)' style='width: 138px;'>
                            <Option v-for="item in powerList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </p>
                </Col>
                <Col span='1'><p style='color: #2d8cf0; cursor:pointer; ' v-if='item.source == 2'   @click='del(item.userId)'>删除</p></Col>
            </Row>
        </div>
        <div v-else>
            <Row class='table-common title'>
                <Col span='5'><p>开发者账号</p></Col>
                <Col span='3'><p>用户名</p></Col>
                <Col span='4'><p>手机号</p></Col>
                <Col span='5'><p>邮箱</p></Col>
                <Col span='2'><p>身份</p></Col>
                <Col span='2'><p>免审核</p></Col>
                <Col span='1'><p>操作</p></Col>
            </Row>
            <Row class='table-common' v-for='(item, i) in userList.datas' :key='i' >
                <Col span='5'><p v-text="item.userAccount.length>20?item.userAccount.substring(0,19)+'...':item.userAccount" :title="item.userAccount"></p></Col>
                <Col span='3'><p v-if="item.username" v-text="item.username.length>6?item.username.substring(0,5)+'...':item.username" :title="item.username"/><p v-else="item.username">-</p></Col>
                <Col span='4'><p>{{ item.phoneNo }}</p></Col>
                <Col span='5'><p v-if="item.email" v-text="item.email.length>20?item.email.substring(0,19)+'...':item.email" :title="item.email"/><p v-else="item.email">-</p></Col>
                <Col span='2'><p>{{ item.sourceName }}</p></Col>
                <Col span='2'>
                    <p>
                        <i-switch v-model="item.autoCheck" @on-change="switchChange(item)">
                            <span slot="open">开</span>
                            <span slot="close">关</span>
                        </i-switch>
                    </p> 
                </Col>
                <Col span='1'><p style='color: #2d8cf0; cursor:pointer; ' v-if='item.source == 2'  @click='del(item.userId)'>删除</p></Col>
            </Row>
        </div>
        
        <div class="pagination">
            <Page :total="userList.total" :page-size='page.pageSize' show-elevator @on-change='pageChange'></Page>
        </div>

    </Row>

</div>

</template>


<script>
import { mapState, mapActions } from 'vuex'

export default {
    data(){
        return {
            keyword: "",
            page: {
                pageNum: 1,
                pageSize: 8
            },
            source: "",
            powerList: [
                {
                    value: '1',
                    label: '关'
                },
                {
                    value: '2',
                    label: '开(收回开发者权限)'
                },
                {
                    value: '3',
                    label: '开(保留开发者权限)'
                },
            ],
        }
    },
    
    mounted(){
        this.QUERY_USER({
            keyword: this.keyword,
            page: this.page,
            source: this.source
        })
    },

    computed: {
        ...mapState({
            userList: state => state.admin.userList,
            userInfo: state => state.user.userInfo,
        })
    },

    methods: {
        ...mapActions(['QUERY_USER', 'CHANGE_AUTO_CHECK', 'DELETE_USER', 'GRANT_USER_TO_MANAGER','GET_USER_INFO']),
        pageChange(num){
            // console.log(num)
            this.page.pageNum = num
            this.QUERY_USER({
                keyword: this.keyword,
                page: this.page,
                source: this.source
            })
        },
        // 
        choose(params){
            this.source = params
            this.QUERY_USER({
                keyword: this.keyword,
                page: this.page,
                source: this.source
            })
        },
        // 搜索筛选
        filter(){
            this.QUERY_USER({
                keyword: this.keyword,
                page: this.page,
                source: this.source
            })
        },
        // 免审核
        switchChange(item){
            // item.autoCheck = !item.autoCheck
            this.$Modal.confirm({
                title: item.autoCheck?'确认开启免审核权限':'确认关闭免审核权限',
                content: item.autoCheck?'开启后此账号的申请将自动被审核通过，你还要继续吗':'关闭后此账号的申请将需要手动审核，你还要继续吗？',
                onOk: () => {
                    this.CHANGE_AUTO_CHECK({ autoCheck: item.autoCheck, userId: item.userId}).then(() => {
                        this.$Notice.success({
                            title: item.autoCheck?'开启免审核成功':'关闭免审核成功',
                        })
                    })
                },
                onCancel: () => {
                    item.autoCheck = !item.autoCheck
                },
                okText: '继续',
                cancelText: '取消'
            })
        },
        // 选择管理员权限
        selectChange(item){
            let content, resultText
            switch(item.roles){
                case '1': 
                    content = '此操作将收回此账号管理员权限，同时恢复其开发者权限，你还要继续吗？'
                    resultText = '收回管理员权限成功'
                    break;
                case '2': 
                    content = '此操作将赋予此账号管理员权限，同时收回其开发者权限，你还要继续吗？'
                    resultText = '赋予管理员权限（收回开发者权限）成功'
                    break;
                case '3': 
                    content = '此操作将赋予此账号管理员权限，同时保留其开发者权限，你还要继续吗？'
                    resultText = '赋予管理员权限（保留开发者权限）成功'
                    break;
            }
            if (item.roles != item.oldRoles){
                this.$Modal.confirm({
                    title: '确认进行此操作',
                    content: content,
                    onOk: () => {
                        this.GRANT_USER_TO_MANAGER({ roles: item.roles, userId: item.userId})
                        this.$Notice.success({
                            title: resultText,
                        })
                    },
                    onCancel: () => {
                        item.roles = item.oldRoles
                    },
                    okText: '继续',
                    cancelText: '取消'
                })
            }
        },

        del(userId){
            this.$Modal.confirm({
                title: '确认删除此开发者',
                content: '开发者被删除后将无法恢复，你还要继续吗？',
                onOk: () => {
                    this.DELETE_USER({ userId: userId }).then(() => {
                        this.QUERY_USER({
                            keyword: this.keyword,
                            page: this.page,
                            source: this.source
                        })
                        this.$Notice.success({
                            title: '删除开发者成功',
                        })
                    })
                    
                },
                onCancel: () => {
                    
                },
                okText: '继续',
                cancelText: '取消'
            })
        }
    }
}
</script>

<style scoped>
.table {
    height: 450px;
}
.table-common {
    width: 910px;
    border-bottom: 1px solid #ccc;
    padding: 0 10px;
    font-size: 12px;
    height: 50px;
    line-height: 50px;
}

.table-common p {
    display: inline-block;
    height: 30px;
    line-height: 30px;
}

.title {
    font-weight: bold;
    background: #eee;
}
</style>
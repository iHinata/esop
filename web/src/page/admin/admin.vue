<template>
    <div class="admin">
        <Row>
            <Col span="5" style='z-Index: 10; '>
                <Menu active-name="/admin/registerApiCheck" :accordion='true' @on-select='select'>
                    <Submenu name="1">
                        <template slot="title">
                            <Icon type="ios-paper"></Icon>注册API管理
                        </template>
                        <MenuItem name="/admin/registerApiCheck">注册API审核</MenuItem>
                        <MenuItem name="/admin/serverManager">服务器管理</MenuItem>
                        <MenuItem name="/admin/serverRelative">服务器绑定服务</MenuItem>
                    </Submenu>
                    <Submenu name="2">
                        <template slot="title">
                            <Icon type="ios-people"></Icon>
                            使用API管理
                        </template>
                        <MenuItem name="/admin/applyApi">申请API审核</MenuItem>
                        <MenuItem name="/admin/applySchool" v-if="!isSchool">应用接入学校</MenuItem>
                        <MenuItem name="/admin/applyAnalysis">统计分析</MenuItem>
                        <MenuItem name="/admin/applyAppInfo">应用信息维护</MenuItem>
                    </Submenu>
                    <MenuItem name="/admin/userManager"> <Icon type="ios-people"></Icon>开发者管理</MenuItem>
                    <Submenu name="4">
                        <template slot="title">
                            <Icon type="flag"></Icon>
                            系统配置管理
                        </template>
                        <MenuItem name="/admin/systemClass">系统分类管理</MenuItem>
                        <MenuItem name="/admin/systemDoc">系统标签管理</MenuItem>
                        <MenuItem name="/admin/systemSchool">邮件模板管理</MenuItem>
                        <MenuItem name="/admin/systemTag">文档管理</MenuItem>
                        <MenuItem name="/admin/informationManagement">学校信息管理</MenuItem>
                    </Submenu>
                </Menu>
            </Col>
            <Col span="19" >
                <div style='padding: 20px'>
                    <router-view></router-view>
                </div>
            </Col>
        </Row>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import checkedApi from './apply/checkedApi'
import reviewApi from './apply/reviewApi'

export default {
    data() {
		return {
			isSchool: true,
		}
    },
    components: {
		checkedApi,reviewApi
    },
    created(){
		if(sessionStorage.common){
			this.isSchool = JSON.parse(sessionStorage.common).isSchoolEnv
		}
		else {
			this.GET_CUSTOM_INFO().then(data => {
				sessionStorage.common = JSON.stringify(data)
				this.isSchool = data.isSchoolEnv
            })
		}
	},
    methods: {
        ...mapActions(['GET_CUSTOM_INFO' ]),
        select(name){
			this.$router.push(name)
		},
    }
}
</script>

<style scoped>
.admin{
    padding-top: 20px; 
}

</style>
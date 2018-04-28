<template>
    <div class='person-info'>
        <h4 class="person-title">个人信息</h4>
        <Form ref="personInfo" :model="personInfo" :rules="rules" :label-width="100" style='width: 500px; '>
            <FormItem label="账号" prop="userAccount">
                <Input v-model="personInfo.userAccount" disabled ></Input>
            </FormItem>
            <FormItem label="用户名" prop="username">
                <Input v-model="personInfo.username"></Input>
            </FormItem>
            <FormItem label="手机号码" prop="phoneNo" >
                <Input v-model="personInfo.phoneNo" ></Input>
            </FormItem>
            <FormItem label="邮箱" prop="email">
                <Input v-model="personInfo.email"></Input>
            </FormItem>
            <FormItem label="单位信息" prop="">
                <Input v-model="personInfo.company"></Input>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="handleSubmit('personInfo')">保存</Button>
                <Button type="ghost" @click="handleReset('personInfo')" style="margin-left: 8px">取消</Button>
            </FormItem>
        </Form>
    </div>        
</template>  

<script>
import { mapActions, mapState } from 'vuex'

export default {
    data(){
        return {
            personInfo: {
                userAccount: '',
                username: '',
                phoneNo: '',
                email: '',
                company: '',
                userId: '',
            },
            rules: {
                userAccount: [
                    { required: true, message: '必填内容', trigger: 'blur' }
                ],
                username: [
                    { required: true, message: '必填内容', trigger: 'blur' },
                    { type: 'string', min: 2, max:50, message: '姓名长度不得少于2位大于50位', trigger: 'blur' }
                ],
                email: [
                    { required: true, message: '必填内容', trigger: 'blur' },
                    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
                ],
                phoneNo: [
                    { type: 'string',pattern: /^\d{11}$/, message: '手机号码格式不正确', trigger: 'blur' }
                ],
            },
        }
    },

    mounted(){
        if (this.userInfo.userAccount){
            this.personInfo = this.userInfo
        }else{
            this.$router.push('/')
        }
        
    },
    computed: {
        ...mapState({
            userInfo: state => state.user.userInfo,
        })
    },
    methods: {
        ...mapActions(['MODIFY_USER']),
        // 保存个人信息
        handleSubmit (params) {
            this.$refs[params].validate((valid) => {
                if (valid) {
                    this.MODIFY_USER({
                        userAccount: this.personInfo.userAccount,
                        phoneNo: this.personInfo.phoneNo,
                        name: this.personInfo.username,
                        email: this.personInfo.email,
                        company: this.personInfo.company,
                        userId: this.personInfo.userId,
                    }).then(data => {
                        // 将用户鉴权信息更新
                        this.$cookies.set('Authorization',data.authorization,'1d','/')
                        this.$Notice.success({ title: '修改成功' })
                    }).catch(err => {
                        this.$Notice.error({ title: err })
                    })
                } 
                else {
                    this.$Notice.error({ title: '操作失败' })
                }
            })
        },
        // 重置个人信息
        handleReset (params) {
            this.$refs[params].resetFields()
        },
        
    },
}
</script>

<style scoped>
.person-info {
    min-height: 600px;
}
.person-title {
    height: 50px;
    line-height: 50px;
    font-weight: bold;
    font-size: 18px;
    margin-bottom: 20px;
}
</style>
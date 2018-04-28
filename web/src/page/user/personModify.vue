<template>
<div class='person-modify'>
    <h4 class="modify-title">密码修改</h4>
    <Form ref="modifyInfo" :model="modifyInfo" :rules="ruleValidate" :label-width="100" style='width: 500px; '>
        <FormItem label="旧密码" prop="oldPassword">
            <Input v-model="modifyInfo.oldPassword" type='password'></Input>
        </FormItem>
        <FormItem label="新密码" prop="newPassword">
            <Input v-model="modifyInfo.newPassword" type='password'></Input>
        </FormItem>
        <FormItem label="确认新密码" prop="confirmPassword" >
            <Input v-model="modifyInfo.confirmPassword" type='password' @on-blur='checkNewPsw'></Input>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="handleSubmit('modifyInfo')">保存</Button>
            <Button type="ghost" @click="handleReset('modifyInfo')" style="margin-left: 8px">取消</Button>
        </FormItem>
    </Form>
</div>        
</template>  

<script>
import { mapActions, mapState } from 'vuex'

export default {
    data(){
        return {
            modifyInfo: {
                oldPassword: '',
                newPassword: '',
                confirmPassword: '',
                userId: '',
            },
            isChecked: false,
            ruleValidate: {
                oldPassword: [
                    { required: true, message: '必填内容', trigger: 'blur' }
                ],
                newPassword: [
                    { required: true, message: '必填内容', trigger: 'blur' }
                ],
                confirmPassword: [
                    { required: true, message: '必填内容', trigger: 'blur' }
                ],
            },
        }
    },
    mounted(){
        if (!this.userInfo.userAccount){
            this.$router.push('/')
        }
    },
    computed: {
        ...mapState({
            userInfo: state => state.user.userInfo,
        })
    },
    methods: {
        ...mapActions(['CHANGE_PSW']),
        // 保存个人信息
        handleSubmit (name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.CHANGE_PSW({
                        newPassword: Base64.encode(this.modifyInfo.newPassword),
                        oldPassword: Base64.encode(this.modifyInfo.oldPassword),
                        userAccount: this.userInfo.userAccount, 
                        userId: this.userInfo.userId,
                    }).then(() => {
                        this.$Notice.success({ title: '修改成功！'})
                    }).catch(error => {
                        this.$Notice.error({ title: error})
                    })
                } else {
                    this.$Notice.error({ title: '操作失败！'}) 
                }
            })
        },
        // 重置
        handleReset (name) {
            this.$refs[name].resetFields()
        },
        // 校验确认密码
        checkNewPsw(){
            if(this.modifyInfo.confirmPassword == this.modifyInfo.newPassword) {
                this.isChecked = true
            }
            else {
                this.isChecked = false
                this.$Message.error('两次密码输入不一致！')
            }
        },
       
    },
}
</script>

<style scoped>
.person-modify {
    min-height: 600px;
}
.modify-title {
    height: 50px;
    line-height: 50px;
    font-weight: bold;
    font-size: 18px;
    margin-bottom: 20px;
}
</style>
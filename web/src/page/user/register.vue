<template>
    <div class='register'>
        <login-wrapper>

            <Row slot="title" class='title'>开发者注册</Row>

            <div slot='content'>
                <Form ref="resignerForm" :model="resignerForm" :rules="formRule" class='form'>

                    <FormItem prop="userAccount">
                        <Input type="text" v-model="resignerForm.userAccount" placeholder="请输入邮箱">
                            <span slot="prepend" class='form-label'><i class='required'>*</i>邮箱:</span>
                        </Input>
                    </FormItem>

                    <FormItem prop="password">
                        <Input type="password" v-model="resignerForm.password" placeholder="请输入密码" @on-change='changePsw' @on-blur='changePsw'>
                            <span slot="prepend" class='form-label'><i class='required'>*</i>密码:</span>
                        </Input>
                        <div class="ivu-form-item-error-tip" >{{pwdError}}</div>
                    </FormItem>

                    <FormItem prop="rePassword">
                        <Input type="password" v-model="resignerForm.rePassword" placeholder="请确认密码" @on-change='changeRePsw'>
                            <span slot="prepend" class='form-label'><i class='required'>*</i>确认密码:</span>
                        </Input>
                        <div class="ivu-form-item-error-tip" >{{rePwdError}}</div>
                    </FormItem>

                    <FormItem prop="name">
                        <Input type="text" v-model.trim="resignerForm.name" placeholder="请输入姓名">
                            <span slot="prepend" class='form-label'><i class='required'>*</i>姓名:</span>
                        </Input>
                    </FormItem>

                    <FormItem prop="phoneNo">
                        <Input type="text" v-model="resignerForm.phoneNo" placeholder="请输入手机号">
                            <span slot="prepend" class='form-label'>手机号:</span>
                        </Input>
                    </FormItem>

                    <FormItem prop="">
                        <Input type="text" v-model="resignerForm.company" placeholder="请输入工作单位">
                            <span slot="prepend" class='form-label'>工作单位:</span>
                        </Input>
                    </FormItem>

                    <FormItem>
                        <Button type="primary" @click="resigner('resignerForm')" long>注册</Button>
                    </FormItem>
                </Form>
            </div>

            <Row slot="foot">
                <div>已有账号？去<router-link to='/user/loginWay'>登录</router-link></div>
            </Row>

        </login-wrapper>
    </div>
</template>

<script>
import loginWrapper from '@/components/loginWrapper'
import { mapActions } from 'vuex'

export default {
    data(){
        return {
            resignerForm: {},
            pwdError: '',
            rePwdError: '',
            formRule: {
                userAccount: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { type: 'email',  message: '邮箱格式不正确', trigger: 'blur' },
                    { type: 'string', max:50, message: '邮箱长度不得大于50位', trigger: 'blur' }
                ],
                // password: [
                //     { required: true, message: '请输入密码', trigger: 'change' },
                // ],
                name: [
                    { required: true, message: '请输入姓名', trigger: 'blur' },
                    { type: 'string', min: 2, max:50, message: '姓名长度不得少于2位大于50位', trigger: 'blur' }
                ],
                phoneNo: [
                    { type: 'string',pattern: /^\d{11}$/, message: '手机号码格式不正确', trigger: 'blur' }
                ],
            },
        }
    },
    components: {
        loginWrapper,
    },
    methods: {

        ...mapActions(['REGISTER', 'CHECK_COMPLEXITY']),
        //注册
        resigner(name){

            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.REGISTER({
                        company: this.resignerForm.company,
                        name: this.resignerForm.name,
                        password: Base64.encode(this.resignerForm.password),
                        phoneNo: this.resignerForm.phoneNo,
                        rePassword: Base64.encode(this.resignerForm.rePassword),
                        userAccount: this.resignerForm.userAccount,
                    }).then(() => {
                        this.$Notice.success({ title: '注册成功！'})
                        this.$router.push('/user/resultStatus')
                    }).catch(err => {
                        this.$Notice.error({ title: err })
                    })
                } 
            })
        },
        //校验密码强度
        changePsw(){
            if (this.resignerForm.password){
                this.CHECK_COMPLEXITY({ password: Base64.encode(this.resignerForm.password) }).then((data) => {
                    this.pwdError = ''
                }).catch(error => {
                    this.pwdError = error
                })
            }else{
                this.pwdError = '请输入密码'
            }
            
        },
        // 确认密码
        changeRePsw() {
            if (this.resignerForm.password != this.resignerForm.rePassword){
                this.rePwdError = '确认密码必须和密码相同'
            }else{
                this.rePwdError = ''
            }
        }
    }
}
</script>

<style scoped>
.register {
    min-height: 600px;
}
.wrapper {
    background: none;
    height: 550px;
    margin-top: -250px;

}
.form {
    text-align: center !important;
    width: 400px;
    margin: 15px auto;
}
.form-label {
    display: inline-block;
    width: 60px;
    font-size: 12px;
}
.ivu-form-item {
    margin-bottom: 22px;
}
.required {
    color: #c00;
    position: relative;
    top: 2px;
    right: 2px;
}
</style>
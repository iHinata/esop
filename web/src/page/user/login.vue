<template>
    <div class="login-container">
        <login-wrapper>
            <div slot='title'>登录</div>
            <div slot='content'>
                <Form ref="loginForm" :model="loginForm" :rules="formRule" class='form'>
                    <FormItem prop="userAccount">
                        <Input type="text" v-model.trim="loginForm.userAccount" placeholder="请输入账号">
                            <span slot="prepend" class='form-label'>账号:</span>
                        </Input>
                    </FormItem>

                    <FormItem prop="userPassword">
                        <Input type="password" v-model="loginForm.userPassword" placeholder="请输入密码">
                            <span slot="prepend" class='form-label'>密码:</span>
                        </Input>
                    </FormItem>

                    <FormItem prop="verifyCode" class='validation' v-if='!ignoreVerify'>
                        <Input type="text" v-model="loginForm.verifyCode" placeholder="请输入验证码" @on-enter="login('loginForm')">
                            <span slot="prepend" class='form-label'>验证码:</span>
                        </Input>
                        <div class="code-wrap" >
                            <!-- 图形验证 -->
                            <div class="dynanic-code" @click='changeDynanicCode' v-if='!dynaVerifyCode'>{{ dynanicCodes.dyncCode }}</div>
                            <!-- 邮箱验证 -->
                            <div class="validation-code" @click='sendCode' v-else>{{ codeText }}</div>
                        </div>
                    </FormItem>

                    <div class="forget_psw" @click='toForgetPsw'>忘记密码？</div>

                    <FormItem>
                        <Button type="primary" @click="login('loginForm')" long class='login'>登录</Button>
                    </FormItem>

                </Form>
            </div>
            <Row slot="foot">没有账号？去<router-link to="/user/register">注册</router-link></Row>
        </login-wrapper>
    </div>
</template>


<script>
import loginWrapper from '@/components/loginWrapper'
import { mapActions, mapState } from 'vuex'

export default {
    data(){
        return {
            codeText: '发送邮箱验证码',
            time: 0,
            ignoreVerify: false,        //是否需要验证码
            dynaVerifyCode: false,      //是否使用动态验证码,
            loginForm: {
                // userAccount: 'sysadmin',
                // userPassword: 'WESBd*&da198',
                userAccount: '',
                userPassword: '',
                verifyCode: '',
                vCode: '',
            },
            formRule: {
                userAccount: [
                    { required: true, message: '请输入账号', trigger: 'blur' },
                ],
                userPassword: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { type: 'string', min: 6, message: '密码长度不得少于6位', trigger: 'blur' }
                ],
                verifyCode: [
                    { required: true, message: '请输入验证码', trigger: 'blur' }
                ],
            },        
        }
    },
    created(){
		if(sessionStorage.common){
            this.ignoreVerify = JSON.parse(sessionStorage.common).ignoreVerify
            this.dynaVerifyCode = JSON.parse(sessionStorage.common).dynaVerifyCode
		}
	},
    components: {
        loginWrapper,
    },
    computed: {
        ...mapState({
            verifyCodes: state => state.user.verifyCodes,
            dynanicCodes: state => state.user.dynanicCodes,
        }),
    },
    mounted(){
        this.changeDynanicCode()
    },
    methods: {

        ...mapActions(['SEND_VERIFY_CODE', 'LOGIN', 'GET_VERIFY_CODE']),

        //登录
        login(name) {
            this.$refs[name].validate(valid => {
                if (valid) {
                    let userPassword = Base64.encode(this.loginForm.userPassword)
                    this.loginForm.vCode = this.dynanicCodes.vCode
                    this.LOGIN({
                        userAccount: this.loginForm.userAccount,
                        userPassword: userPassword,
                        vCode: this.loginForm.vCode,
                        verifyCode: this.loginForm.verifyCode
                    }).then(data => {
                        this.$cookies.set('Authorization',data.datas.authorization,'1d','/')
                        location.href = '/'
                    }).catch(err => {
                        this.$Message.error(err)
                        this.changeDynanicCode()
                    })
                } 
            })
        },

        toForgetPsw(){
            this.$router.push('/user/forgetPassword')
        },

        //点击改变图形验证码
        changeDynanicCode(){
            this.GET_VERIFY_CODE({ userAccount: this.loginForm.userAccount })
        },

        //发送邮箱验证码
        sendCode(){
            if(this.time) {
                return
            }
            this.SEND_VERIFY_CODE({ userAccount: this.loginForm.userAccount })
            this.time = 60
            let timer = setInterval(() => {
                this.time--
                this.codeText = '已发送('+this.time+'s)'
                if(this.time <= 0 ) {
                    clearInterval(timer)
                    this.codeText = '重新发送'
                }
            }, 1000)
           
        },
    }
}
</script>

<style scoped>
.login-container {
    min-height: 600px;
}
.title {
    font-size: 26px;
    font-weight: 500;
    color: #1890ff;
    height: 80px;
    line-height: 80px;
}

.form-label {
    display: inline-block;
    width: 60px;
    font-size: 12px;
}
.form {
    text-align: center !important;
    width: 400px;
    margin: 15px auto;
}

.validation {
    position: relative;
    width: 100%;
}
.validation-code {
    position: absolute;
    right: 8px;
    top: 6px;
    z-index: 9;
    height: 24px;
    line-height: 24px;
    color: #1890ff;
    cursor: pointer;
}
.dynanic-code {
    position: absolute;
    right: 8px;
    top: 8px;
    z-index: 9;
    width: 90px;
    height: 20px;
    text-align: center;
    line-height: 20px;
    background: #eee;
    cursor: pointer;
    letter-spacing: 5px;
}

.forget_psw {
    font-size: 12px;
    width: 300px;
    text-align: left;
    margin-bottom: 10px;
    color: #1890ff;
    cursor: pointer;
}

.login {
    font-size: 14px;
}

</style>
<template>
    <div id='forget-psw'>
        <login-wrapper>
            <Row slot="title" class='title'>ESOP能力开放平台</Row>
            <Row slot="content">
                <p>重置登录密码:</p>
                <Input v-model="newPsw" type='password' placeholder="请输入新密码" 
                style="width: 300px; margin-top: 24px;" @on-blur='changePsw'></Input>
                <div class="error-tip" >{{pwdError}}</div>
                <Input v-model="confirmPsw" type='password' placeholder="请确认新密码" 
                style="width: 300px; margin: 10px 0;" @on-blur='checkConfirmPsw'></Input>
                <p><Button type="primary" @click='resetPsw'>确认</Button></p>
            </Row>
            <Row slot="foot">
                <div class="foot"></div>
            </Row>
        </login-wrapper>
    </div>
    
</template>

<script>
import { mapActions } from 'vuex'
import loginWrapper from '@/components/loginWrapper'

export default {
    data(){
        return {
            newPsw: '',
            confirmPsw: '',
            isEqual: false,
            pwdError: '',
        }
    },
    components: {
        loginWrapper,
    },
    methods: {
        ...mapActions(['RESET_PSW', 'CHECK_COMPLEXITY']),
        resetPsw(){
            if(this.isEqual && !this.pwdError) {
                this.RESET_PSW({ password: Base64.encode(this.newPsw), s: this.$route.query.s, userAccount: this.$route.query.u }).then(() => {
                    this.$router.push('/user/resetPswStatus')
                })
            }
        },
        //校验密码强度
        changePsw(){
            if (this.newPsw){
                this.CHECK_COMPLEXITY({ password: Base64.encode(this.newPsw) }).then(data => {
                    this.pwdError = ''
                }).catch(error => {
                    this.pwdError = error
                })
            }else{
                this.pwdError = '密码不能为空'
            }
            
        },
        // 校验密码
        checkConfirmPsw(){
            if (this.confirmPsw) {
                if(this.newPsw != this.confirmPsw) {
                    this.$Notice.info({ title: '输入密码和确认密码不一致' })
                    this.isEqual = false
                }
                else {
                    this.isEqual = true
                }
            }
            
        },

    }
}
</script>

<style scoped>
#forget-psw {
    min-height: 700px;
}
.wrapper {
    border: none;
    text-align: left;
    background: none;
}
.wrapper .foot {
    background:#fff;
}
.error-tip {
    color: #c00;
    font-size: 12px;
    height: 20px;
    line-height: 20px;
}
</style>
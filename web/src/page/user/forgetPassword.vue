<template>
    <div class='forget-password'>
        <login-wrapper id='forget-psw'>
            <Row slot="title" class='title'>ESOP能力开放平台</Row>
            <Row slot="content">
                <p>通过注册邮箱找回密码:</p>
                <Form ref="form" :model='form' :rules="formRule" class='form'>
                    <FormItem prop="userAccount">
                        <Input type="text" v-model="form.userAccount" placeholder="请输入注册邮箱">
                        </Input>
                    </FormItem>
                    <FormItem>
                        <Button type="primary" :loading="loading" @click="findPsw('form')">找回密码</Button>
                    </FormItem>
                </Form>
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
            loading: false,
            form: {
                userAccount: '',
            },
            formRule: {
                userAccount: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
                ],
            },
        }
    },
    components: {
        loginWrapper,
    },
    methods: {
        ...mapActions(['FORGET_PSW']),

        findPsw(name){
            this.loading = true

            this.$refs[name].validate((valid) => {
                if (valid) {
                   this.FORGET_PSW({ userAccount: this.form.userAccount }).then(() => {
                        this.loading = false
                        this.$router.push({ path: '/user/forgetPasswordStatus', query: { userAccount: this.form.userAccount } })
                    }).catch(error => {
                        setTimeout(() => {
                            this.loading = false
                        }, 2000)
                        
                        this.$Notice.error({ title: error })
                    })
                } 
            })
        },

    }
}
</script>

<style scoped>
.forget-password {
    min-height: 600px;
}
.wrapper {
    border: none;
    text-align: left;
    background: none;
    box-shadow: none;
}

.btn {
    font-size: 14px;
}

.wrapper .foot {
    background: #fff !important;
}
</style>
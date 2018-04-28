<template>
    <login-wrapper id='reseet-psw-status'>
        <Row slot="title" class='title'>ESOP能力开放平台</Row>
        <Row slot="content" class='result_status'>
            <p>重置密码成功！</p>
            <p><router-link to="/">点此进入</router-link>ESOP能力开放平台首页</p>
        </Row>
    </login-wrapper>
</template>

<script>
import loginWrapper from '@/components/loginWrapper'

export default {
    data(){
        return {
            email: '',
        }
    },
    components: {
        loginWrapper,
    },
    methods: {

    }
}
</script>

<style scoped>
.wrapper {
    border: none;
    text-align: left;
    background: none;
}
.result_status p{
    line-height: 20px;
    font-size: 12px;
}
</style>
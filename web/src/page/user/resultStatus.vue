<template>
<div class='result-status'>
    <login-wrapper>
        <Row slot="title" class='title'>ESOP能力开放平台</Row>
        <Row slot="content" class='result_status'>
            <p>注册成功！</p>
            <p>我们已向您的邮箱{{ $route.query.userAccount }}发送了一封验证邮件。请登录邮箱查收邮件，完成账号激活。</p>
        </Row>
        <Row slot="foot"></Row>
    </login-wrapper>
</div>
    
</template>

<script>
import loginWrapper from '@/components/loginWrapper'

export default {
    components: {
        loginWrapper,
    },
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
.result_status p:first-child {
    font-size: 16px;
}
</style>
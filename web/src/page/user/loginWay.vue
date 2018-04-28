<template>
    <div class="login-way">
        <login-wrapper>
            <Row slot="title">登录ESOP</Row>
                <Row slot="content">
                    <Col span='12' class='section'>
                        <a :href="idsLoginURL">
                        <!-- <router-link to="" > -->
                            <p class='section-p'><Icon type="ios-home-outline" size='80' color='#000' /></p>
                            <span class='section-span'>使用学工号登陆</span>
                        <!-- </router-link> -->
                        </a>
                    </Col>
                    <Col span='12' class='section'>
                        <router-link to="/user/login" >
                            <p class='section-p'><Icon type="ios-email-outline" size='80' color='#000' /></p>
                            <span class='section-span'>使用邮箱登陆</span>
                        </router-link>
                    </Col>
                </Row>
            <Row slot="foot">没有账号？去<router-link to="/user/register">注册</router-link></Row>
        </login-wrapper>
    </div>
</template>

<script>
import loginWrapper from '@/components/loginWrapper'

export default {
    data(){
        return {
            idsLoginURL: '',
        }
    },
    created(){
		if(sessionStorage.common){
			this.idsLoginURL = JSON.parse(sessionStorage.common).idsLoginURL + "?ts=" + Math.ceil(Math.random()*100000)
		}
		else {
			this.GET_CUSTOM_INFO().then(data => {
				sessionStorage.common = JSON.stringify(data)
				this.idsLoginURL = data.idsLoginURL + "?ts=" + Math.ceil(Math.random()*100000)
            })
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
.login-way {
    min-height: 600px;
}
.section {
    height: 240px;
    padding-top: 40px;
    font-size: 14px;
}

.section-p {
    width: 150px;
    height:  150px;
    line-height: 200px;
    background: #eee;
    border-radius: 50%;
    text-align: center;
    margin: 0 auto;
    color: #000;
    margin-bottom: 30px;
}

.section-span {
    color: #000;
}


</style>
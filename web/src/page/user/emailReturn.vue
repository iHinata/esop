<template>
<div class='result-status'>
    <login-wrapper>
        <div slot='title'>{{ webName }}</div>
        <div slot="content" class='result_status'>
            <p>{{ msg }}</p>
        </div>
    </login-wrapper>
</div>
</template>


<script>
import { mapActions } from 'vuex'
import loginWrapper from '@/components/loginWrapper'

export default {
    data(){
        return {
            msg: '',
            webName: '',
        }
    },
    components: {
        loginWrapper,
    },
    created(){
		if(sessionStorage.common){
			this.webName = JSON.parse(sessionStorage.common).name
		}
		else {
			this.GET_CUSTOM_INFO().then(data => {
				sessionStorage.common = JSON.stringify(data)
				this.webName = data.name
            })
		}
		
	},
    mounted(){
        this.ACTIVATION({ 
            u: this.$route.query.u, 
            s: this.$route.query.s 
        }).then(data => {
            this.msg = '您的账户已经激活成功，请点击登录。'
        }).catch(data => {
            this.msg = data
        })
    },
    methods: {
        ...mapActions(['ACTIVATION']),
    }
}
</script>

<style scoped>

.wrapper {
    border: none;
    text-align: left;
    background: none;
    margin-top: -80px;
}
.result_status p{
    line-height: 20px;
    font-size: 12px;
}
.result_status p:first-child {
    font-size: 16px;
}
</style>
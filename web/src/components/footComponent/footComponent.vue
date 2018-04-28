<template>
    <Footer class='f' ref='foot'>{{ copyright }}</Footer>
</template>

<script>
import { mapActions } from 'vuex' 

export default {
	data(){
		return {
            copyright: '',
		}
	},
	created(){
		if(sessionStorage.common){
			this.copyright = JSON.parse(sessionStorage.common).copyright
        }
        else {
			this.GET_CUSTOM_INFO().then(data => {
				sessionStorage.common = JSON.stringify(data)
				this.copyright = data.copyright
            })
		}
    },
    methods: {

        ...mapActions(['GET_CUSTOM_INFO' ]),
    }
}
</script>

<style scoped>
.f {
	width: 100%; 
    text-align: center;
    font-size: 12px;
    height: 60px; 
    margin-top: 20px;
	line-height: 60px;
	background: rgba(35,37,38,1);
	color: #fff;
	padding: 0;
	z-index: 999;
    position: fixed; 
    bottom: 0;
}

</style>
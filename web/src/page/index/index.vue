<template>
    <div class="index">
        <section class="index_wrap">
            <div class="index_title">
                <h1>{{advertTitle}}</h1>
                <p>{{advertSecondTitle}}</p>
                <p>{{advertThirdTitle}}</p>
            </div>
        </section>

        <section class='index_section'>
            <div class="index_section_top">
                <h1>{{contentTitle}}</h1>
                <p>{{contentSecondTitle}}</p>
            </div>
            <div class="swiper">
                <div class='swiper-container'>
                    <swiper :options="swiperOption" class='swiper-content'>
                        <swiper-slide v-for='(item,i) in firstClass' :key='i' class="swiper-slide" 
                        :style="item.imgUrl? `background: url(${item.imgUrl})` : `background: url(../../static/img/bg${i%4}.png)` " >
                            <img :src="`../../static/img/icon${i%4}.png`" class='swiper-slide-img' />
                            <div class="swiper-slide-line"></div>
                            <div class="swiper-slide-title">{{ item.className }}</div>
                            <div class="swiper-slide-detail">
                                <p v-if="item.classDesc" v-text="item.classDesc.length>70?item.classDesc.substring(0,69):item.classDesc" :title="item.classDesc"/><p v-else="item.classDesc">-</p>
                                <span @click='toDetail(item.classId)'>查看详情</span>
                            </div>
                        </swiper-slide>
                        <!-- <div class="swiper-pagination" slot="pagination"></div> -->
                    </swiper>
                    <div class="swiper-button-prev swiper-button-white" slot="button-prev"></div>
                    <div class="swiper-button-next swiper-button-white" slot="button-next"></div>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { swiper, swiperSlide } from 'vue-awesome-swiper'

export default {
    data(){
        return {
            advertTitle: '',
            advertSecondTitle: '',
            advertThirdTitle: '',
            contentTitle: '',
            contentSecondTitle: '',
            swiperOption: {
                slidesPerView: 4,
                spaceBetween: 0,
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
            },
        }
    },
    created(){
		if(sessionStorage.common){
            this.advertTitle = JSON.parse(sessionStorage.common).advertTitle
            this.advertSecondTitle = JSON.parse(sessionStorage.common).advertSecondTitle
            this.advertThirdTitle = JSON.parse(sessionStorage.common).advertThirdTitle
            this.contentTitle = JSON.parse(sessionStorage.common).contentTitle
            this.contentSecondTitle = JSON.parse(sessionStorage.common).contentSecondTitle
		}
        else {
			this.GET_CUSTOM_INFO().then(data => {
				sessionStorage.common = JSON.stringify(data)
				this.advertTitle = JSON.parse(sessionStorage.common).advertTitle
                this.advertSecondTitle = JSON.parse(sessionStorage.common).advertSecondTitle
                this.advertThirdTitle = JSON.parse(sessionStorage.common).advertThirdTitle
                this.contentTitle = JSON.parse(sessionStorage.common).contentTitle
                this.contentSecondTitle = JSON.parse(sessionStorage.common).contentSecondTitle
            })
		}
	},
    mounted(){
        //获取个性化信息获取接口
        this.GET_CUSTOM_INFO()
        //获取一级分类
        this.GET_FIRST_CLASS({ needDetail: true })
    },
    components: {
        swiper,
        swiperSlide,
    },
    computed: {
		...mapState({
            customInfo: state => state.index.customInfo,
            firstClass: state => state.index.firstClass,
        }),
	},
    methods: {

        ...mapActions(['GET_CUSTOM_INFO', 'GET_FIRST_CLASS']),
        // 
        toDetail(classId){
            this.$router.push({ path: '/api', query: { classId: classId } })
        },

    }
}
</script>

<style scoped>

.index {
    width: 100%;
    min-height: 1270px;
    overflow-x: hidden;
}

.index_wrap{
    width: 100%;
    height: 600px;
    position: absolute;
    top: 64px;
    left: 0;
    overflow: hidden;
    background: #eee url('../../assets/img/book.png') no-repeat;
    background-size: cover;
}

.index_title {
    width: 100%;
    margin-top: 320px;
    text-align: center;
    color: #fff; 
}
.index_title h1{
    height: 46px; 
    font-size: 48px;
    margin-bottom: 29px;
    line-height: 0px;
}

.index_title p{
    height: 18px; 
    font-size: 18px;
    line-height: 0px;
    margin: 16px 0;
    color: #eee;
}

.index_section {
    position: absolute;
    top: 700px;
    left: 0;
    width: 100%;
    text-align: center;
}

.index_section_top {
    height: 130px;
}

.index_section_top h1{
    margin: 50px 0 20px;
    height: 30px; 
    font-size: 30px;
    color: rgba(51,51,51,1);
}
.index_section_top p{
    font-size: 18px;
    color: rgba(102,102,102,1);
}

.swiper {
    width: 100%;
    height: 420px;
    background:rgba(55,61,65,1);
}

.swiper-container {
    position: relative;
    width: 1200px;
    height: 420px;
    margin: 0 auto;
    overflow: hidden;
}

.swiper-content {
    width: 1000px;
    height: 420px;
    margin: 0 auto;
    position: relative;
}

.swiper-slide {
    width: 260px;
    height: 420px;
    padding: 128px 0 0;
    border-left: 1px dashed #fff;
    margin-left: -1px;
	color: #fff;
	font-size: 14px;
	text-align: center;
    cursor: pointer;
    z-index: 99;
    transition: all 0.3s;
    -moz-transition: all 0.3s; /* Firefox 4 */
    -webkit-transition: all 0.3s; /* Safari 和 Chrome */
    -o-transition: all 0.3s; /* Opera */
}

.swiper-slide .swiper-slide-detail {
    display: none;
}

.swiper-slide:hover {
    padding-top: 70px;
    background-color: #24a9fd !important;
}
.swiper-slide:hover .swiper-slide-detail{
    display: block;
    word-break:break-all;
}

.prev {
    width: 80px;
    height: 420px;
    line-height: 420px;
    position: absolute;
    left: 0;
    top: 0;
    background:rgba(55,61,65,1);
    color: #fff;
    z-index: 99;
    cursor: pointer;
}

.next {
    width: 80px;
    height: 420px;
    line-height: 420px;
    position: absolute;
    right: 0;
    top: 0;
    background:rgba(55,61,65,1);
    color: #fff;
    z-index: 99;
    cursor: pointer;
} 

.swiper-slide-img {
    width: 74px;
    height: 74px;
    margin-bottom: 24px;
}

.swiper-slide-line {
    width: 20px;
    height: 1px;
    background: #fff;
    margin:  0 auto;
    margin-bottom: 36px;
}

.swiper-slide-title {
    font-size: 24px;
    line-height: 0;
    margin-bottom: 30px;
}

.swiper-slide-detail p{
    line-height: 24px;
    font-size: 14px;
    margin-bottom: 35px;
}

.swiper-slide-detail span {
    width: 122px;
    height: 38px; 
    line-height: 38px;
    font-size: 14px;
    display: inline-block;
    border: 1px solid #fff;
    color: #fff;
}

.append-buttons {
    text-align: center;
    margin-top: 20px;
}
.append-buttons a {
    display: inline-block;
    margin: 0 10px;
}
.swiper-button-prev {
    position: absolute;
    left: 0;
    top: 0;
    width: 80px;
    height: 440px;
}
.f {
    margin-top: 830px;
}


</style>
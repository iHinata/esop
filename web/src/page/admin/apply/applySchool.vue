<template>
    <div>
        <Row class='search' :gutter="12">
            <Col span="10">
                <Input v-model="keyword" @on-enter="search" icon="ios-search-strong" clearable placeholder="请输入..."  class='search-input'></Input>
            </Col>
            <Col span="3">
                <Button type="primary" class='search-btn' long @click='search'>搜索</Button>
            </Col>
        </Row>

        <Row class='dev' :gutter="12">
            <Col span="6" class-name="school-card" v-for='(item, i) in accessedSchools.datas' :key='i'>
                <Card @click.native="toDetail(item.schoolId, item.schoolName)">
                    <div class='school-img'>
                        <img :src="item.schoolUri? item.schoolUri:imgUrl"  height="110" />
                    </div>
                    <p class='margin10'>{{ item.schoolId }}</p>
                    <p class='school-name' :title='item.schoolName' >{{ item.schoolName }}</p>
                    <p>已接入应用 {{item.accessAppNum}}/个</p>
                </Card>
                <br>
            </Col>
        </Row>

        <div class="pagination">
            <Page :total="accessedSchools.total" :page-size="page.pageSize" show-elevator @on-change='pageChange'></Page>
        </div>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'


export default {
    data(){
        return {
            keyword: '',
            page: {
                pageSize: 8,
                pageNum: 1,
            },
        }
    },
    
    computed: {
        ...mapState({
            accessedSchools: state => state.admin.accessedSchools,
        }),
        imgUrl(){
            return '/static/img/school-default.png'
        }
    },
    mounted(){
        // 查询每个学校接入的应用的数量
        this.QUERY_ASCCESSED_SCHOOLS({ keyword: this.keyword, page: this.page })
    },
    methods: {
        ...mapActions(['QUERY_ASCCESSED_SCHOOLS']),
        // 搜索
        search(){
            this.QUERY_ASCCESSED_SCHOOLS({ keyword: this.keyword, page: this.page })
        },
        // 分页
        pageChange(num){
            this.page.pageNum = num
            this.QUERY_ASCCESSED_SCHOOLS({ keyword: this.keyword, page: this.page })
        },
        //
        toDetail(schoolId, schoolName){
            this.$router.push({ path: '/admin/applySchool/applySchoolDetail', query: { schoolId: schoolId, schoolName } })
        },
        
    }
}
</script>

<style scoped>
.search {
    padding-bottom: 20px;
}
.dev {
    height: 490px;
}
.school-card {
    text-align: center;
    cursor: pointer;
}
.margin10 {
    margin-bottom: 10px;
}
.school-name {
    width: 180px;
    font-size: 22px; 
    margin-bottom: 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.school-img {
    width: 180px;
    height: 110px;
    text-align: center;
    margin-bottom: 10px;
    overflow: hidden;
}
.school-img img{
    height: 100%;
}
</style>

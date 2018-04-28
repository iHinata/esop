<template>
    <div class='doc-detail'>
        <div class="doc-detail-top">
            <p class="doc-note">帮助文档</p>
        </div>
        <div>
            <Row class="doc-detail-bottom" :gutter='10' >
                <Col span='6' >
                    <Menu accordion width='auto' active-name="1-1" :open-names="['1']" @on-select="onSelect">
                        <Submenu :name="i1" :class="i1" v-for='(item1, i1) in documentList' :key='i1'>
                            <template slot="title" >
                                <Icon type="ios-paper"></Icon>{{ item1.className }}
                            </template>
                            <MenuItem v-for='(item2, i2) in item1.docList' :key='i2' :name="item2.docId" 
                             :class="`${i1}-${i2}`" >
                                {{ item2.docName }}
                            </MenuItem>
                        </Submenu> 
                    </Menu>
                </Col>
                <Col span='18'>
                    <Row>
                        <Col span="10" offset="2">
                            <h1 class='font-t'>{{ documentDetail.docName }}</h1>
                        </Col>
                        <Col span="6" offset="6">
                            <span class='font'>{{ documentDetail.createTime }}</span>
                        </Col>
                    </Row>
                    <br>
                    <hr>
                    <div class="body" v-html="documentDetail.docDesc"></div>
                </Col>
            </Row>
        </div>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
    data(){
        return {
            documentDetail: {},
        }
    },
    computed: {
        ...mapState({
            documentList: state => state.admin.documentList,
        })
    },
    mounted(){
        // 查询文档列表
        this.GET_DOCUMENT_CLASS_LIST({ pageSize: -1 })
        // 获取文档详情
        this.onSelect(this.$route.query.docId)
    },
    methods: {
        ...mapActions(['GET_DOCUMENT_CLASS_LIST', 'GET_DOCUMENT_DETAIL']),
        //
        onSelect(docId){
            this.GET_DOCUMENT_DETAIL({ docId: docId }).then(data =>{
                this.documentDetail = data
                // this.$nextTick(() => {
                //     this.$refs.menu.updateOpened()
                //     this.$refs.menu.updateActiveName()
                // })
            })
        },

    }
}
</script>

<style scoped>
.doc-detail {
    padding-top: 220px;
    min-height: 600px;
}
.doc-detail-top {
    position: absolute;
    top: 64px;
    left: 0;
    width: 100%;
    height: 122px;
    background: #eee url('../../assets/img/doc_bg02.png') no-repeat;
    background-size: cover;
}

.doc-note {
    width: 1200px;
    margin: 40px auto;
    font-size: 30px;
    color: #fff;
} 
.font-t {
    font-size: 18px;
}
.font {
    font-size: 14px;
    font-weight: normal;
}
.doc-detail-bottom {
    position: relative;
    z-index: 0;
    height: auto;
}

</style>
<template>
    <div class='doc'>
        <div class="doc-top">
            <div class="doc-note">
                <h4>ESOP能力开放平台</h4>
                <p>你所需要的平台接入、业务说明都在这里你所需要的平台接入、业务说明都在这里</p>
            </div>
        </div>
        <Row class='doc-menu'>
            <Col span='6' offset='2' v-for='(item1,i1) in documentList' :key='i1'>
                <Menu active-name="" @on-select='onSelect' width='480px'>
                    <MenuGroup :title="item1.className"></MenuGroup>
                        <MenuItem :name="item2.docId" v-for='(item2, i2) in item1.docList' :key='i2'>{{ item2.docName }}</MenuItem>
                    </MenuGroup>
                </Menu>
            </Col>
        </Row>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
    data(){
        return {
            
        }
    },
    computed: {
        ...mapState({
            documentList: state => state.admin.documentList,
        })
    },
    mounted(){
        this.GET_DOCUMENT_CLASS_LIST({ pageSize:7 })
    },
    methods: {
        ...mapActions(['GET_DOCUMENT_CLASS_LIST']),
        //
        onSelect(docId){
            // console.log(docId)
            this.$router.push({ path: '/doc/docDetail', query: { docId: docId } })
        }
    }
}
</script>

<style scoped>
.doc {
    min-height: 700px;
}
.doc-top {
    position: absolute;
    top: 64px;
    left: 0;
    width: 100%;
    height: 255px;
    background: #eee url('../../assets/img/doc_bg01.png') no-repeat;
    background-size: cover; 
}
.doc-note {
    width: 1200px;
    margin: 80px auto;
    color: #fff;
    font-size: 16px;
}
.doc-note h4 {
    font-size: 30px;
    margin-bottom: 20px;
}
.ivu-menu-item-selected {
    border-right: none !important;
}
.ivu-menu-vertical.ivu-menu-light:after {
    width: 0;
}
.doc-menu {
    margin-top: 330px;
    position: relative;
    z-index: 0;
}
</style>
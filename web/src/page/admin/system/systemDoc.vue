<template>
<div class='system-doc'>
    <div class='container'>
        <Row :gutter='10'>
            <Col span='10'>
                <Input v-model="keyword" placeholder="请输入..." clearable @on-enter='search'></Input>
            </Col>
            <Col span='2'>
                <Button type="primary" @click='search'>搜索</Button>
            </Col>
            <Col span='2'>
                <Button type="primary" @click='add'>新增标签</Button>
            </Col>
        </Row>
        <Row :gutter='10'>
            <Col span='6' v-for='(item, i) in labelList.datas' :key='i'>
                <Card class='card'>
                    <h4 class='title'>{{ item.labelName }}</h4>
                    <Tag>{{ item.originName }}</Tag>
                    <div class="icon">
                        <Icon type="edit" color='#2d8cf0' size='14' v-show="item.schoolId==item.sourceId" @click.native.stop='modify(item.labelId,item.labelName)'></Icon>
                        <Icon type="trash-a" color='#2d8cf0' size='16' v-show="item.schoolId==item.sourceId" @click.native.stop='del(item.labelId)'></Icon>
                    </div>
                </Card>
            </Col>
        </Row>
    </div>
    
    <div class="pagination">
        <Page :total="labelList.total" :page-size="page.pageSize" show-elevator @on-change='labelPageChange'></Page>
    </div>

    <!-- 添加标签 -->
    <Modal v-model="isaddLabels" :title='title' :transfer='transfer' @on-ok="confirm" width='600'>
        <Row>
            <Col span='4' class='tags'>
                <span>标签名称</span>
            </Col>
            <Col span='20'>
                <Input v-model="labelName" placeholder="请输入标签名称" ></Input>
            </Col>
        </Row>
    </Modal>


</div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
    data(){
        return {
            isaddLabels: false,
            labelId: '',
            labelName: '',
            thirdKeyWords: '',
            transfer: false,
            keyword: '',
            title: '添加标签',
            page: {
                pageNum: 1,
                pageSize: 12
            },
        }
    },
    computed: {
        ...mapState({
            labelList: state => state.admin.labels
        }),
        checkInput(){
            let check = false
            if(!this.labelName) {
                this.$Notice.error({ title: '标签不能为空' })
            }
            else if(this.labelName.length > 8 ){
                this.$Notice.error({ title: '标签名称不得超过8个字符' })
            }
            else {
                check = true
            }
            return check
        }
    },
    mounted(){
        this.QUERY_LABELS({ keyword: this.keyword, page: this.page })
    },
    methods: {
        ...mapActions(['QUERY_LABELS', 'ADD_LABELS', 'DELETE_LABELS','MODIFY_LABEL' ]),

        search(){
            this.QUERY_LABELS({ keyword: this.keyword, page: this.page })    
        },
        labelPageChange(num){
            this.page.pageNum = num
            this.QUERY_LABELS({ keyword: this.keyword, page: this.page }) 
        },

        confirm(){
            if(!this.checkInput) {
                this.$nextTick(() => {
                    this.isaddLabels = true
                    return
                })
               
            } else {
                if (this.labelId){
                    this.MODIFY_LABEL({labelId: this.labelId, labelName: this.labelName}).then(() => {
                        this.$Notice.success({
                            title: '修改标签成功',
                        })
                        this.page.pageNum = 1
                        this.QUERY_LABELS({ keyword: this.keyword, page: this.page })
                        this.labelName = ''
                        this.labelId = ''
                    })
                }else {
                    this.ADD_LABELS({ labelName: this.labelName}).then(() => {
                        this.$Notice.success({
                            title: '添加标签成功',
                        })
                        this.page.pageNum = 1
                        this.QUERY_LABELS({ keyword: this.keyword, page: this.page })
                        this.labelName = ''
                    }).catch(err => {
                        this.$Notice.error({
                            title: err,
                        })
                    })
                }
            }
            
        },
        add(){
            this.isaddLabels = !this.isaddLabels
            this.title = '添加标签'
            this.labelName = ''
        },
        modify(labelId,labelName){
            this.isaddLabels = !this.isaddLabels
            this.title = '修改标签'
            this.labelId = labelId
            this.labelName = labelName
        },

        del(labelId){
            this.$Modal.confirm({
                title: '确认删除此标签',
                content: '删除后，所有使用它的API将丢失此标签，你还要继续吗？',
                onOk: () => {
                    this.DELETE_LABELS({ labelId: labelId }).then(() => {
                        this.page.pageNum = 1
                        this.QUERY_LABELS({ keyword: this.keyword, page: this.page })
                        this.$Notice.success({
                            title: '删除标签成功',
                        })
                    }).catch( err => {
                        this.$Notice.error({
                            title: err,
                        })
                    })
                },
                onCancel: () => {
                    
                }
            })
        },
    }
}
</script>


<style scoped>
.system-doc {
    min-height: 600px;
}
.container {
    width: 100%;
    height: 420px;
}
.card {
    height: 110px;
    text-align: center;
    position: relative;
    cursor: pointer;
    margin: 10px 0;
}
.title {
    margin: 15px 0;
    font-size: 18px;
}
.icon {
    position: absolute;
    right: 10px;
    top: 10px;
    display: none;
}
.tags {
    text-align: center;
    line-height: 32px;
}
.card:hover {
    border: 1px solid #2d8cf0;
}
.card:hover .icon{
    display: block;
}
</style>
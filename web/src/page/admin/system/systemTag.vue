<template>

    <div class='system-tag'>
        <Row>
            <Col span='8' v-for='(item1,i1) in documentList' :key='i1'>
                <div class='section'>
                    <div class='title'>{{ item1.className }}</div>
                    <Row class='add-doc'>
                        <Icon type="plus-circled" color='#2d8cf0'></Icon>
                        <span style='color: #2d8cf0; cursor: pointer; ' @click='addDoc(item1.classId)'>新增文档</span>
                    </Row>
                    <div class="menu-wrapper">
                        <div class="menu-item" v-for='(item2, i2) in item1.docList' :key='i2'>
                            <span :title='item2.docName' v-text="item2.docName.length>20?item2.docName.substring(0,19)+'...':item2.docName"></span> 
                            <p class='icon-group'>
                                <!-- TODO 暂时不做 -->
                                <!-- <Icon type="arrow-down-a" color='#2d8cf0' class='icon' @click.native='down'></Icon>
                                <Icon type="arrow-up-a" color='#2d8cf0' class='icon' @click.native='up'></Icon> -->
                                <Icon type="edit" color='#2d8cf0' class='icon' @click.native='edit(item2)'></Icon>
                                <Icon type="trash-a" color='#2d8cf0' class='icon' @click.native='del(item2.docId)'></Icon>
                            </p>     
                        </div>
                    </div>
                </div>
            </Col>
        </Row>

        <!-- 新增文档 -->
        <Modal v-model="isAddDoc" :title='title' :transfer='false' @on-ok="confirm" width='600'>
            <Form ref="docForm" :model="docForm" :rules="ruleValidate" :label-width="80">
                <FormItem label="文档名称" prop="docName">
                    <Input v-model="docForm.docName" placeholder="请输入文档名称"></Input>
                </FormItem>
                <FormItem label="文档分类" prop="classId">
                    <Select v-model="docForm.classId" placeholder="请选择文档分类">
                        <Option v-for="(item, i) in classList" :value="item.classId"  :key="i">{{ item.className }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="文档内容" prop="docDesc">
                    <vue-summernote ref="editer"></vue-summernote>
                </FormItem>
            </Form>
        </Modal>


    </div>
</template>


<script>
import { mapActions, mapState } from 'vuex'

export default {
    data(){
        return {
            isAddDoc: false,
            title: '新增文档',
            docForm: {
                docId: '',
                docName: '',
                classId: '',
                docDesc: '',
            },
            ruleValidate: {
                docName: [
                    { required: true, message: '文档名称不能为空', trigger: 'blur' }
                ],
                classId: [
                    { required: true, message: '文档分类不能为空', trigger: 'blur' }
                ],
                docDesc: [
                    { required: true, message: '文档内容不能为空', trigger: 'blur' },
                    { type: 'string', max: 50, message: '最多输入50个字符', trigger: 'blur' }
                ]
            },
            page: {
                pageNum: 1,
                pageSize: 10
            },
        }
    },

    computed: {
        ...mapState({
            documentList: state => state.admin.documentList,
            classList: state => state.admin.classList,
        }),
        checkForm(){
            let check = false
            if(!this.docForm.docName) {
                this.$Notice.error({ title: '标题不能为空' })
            }
            else if(this.docForm.docName.length > 10 ){
                this.$Notice.error({ title: '标题字数不得超过10个' })
            }
            else if(!this.docForm.docDesc) {
                this.$Notice.error({ title: '内容不能为空' })
            }
            else if(!this.docForm.classId) {
                this.$Notice.error({ title: '文档分类不能为空' })
            }
            else {
                check = true
            }
            return check
        },
    },

    mounted(){
        // 查询文档分类列表(下拉菜单)
        this.QUERY_CLASS()
        // 管理员查询文档列表
        this.QUERY_DOCUMENTS({ keyword: '', page: this.page })
        // 初始化富文本框
        this.initSummerNote()
    },

    methods: {
        ...mapActions(['QUERY_DOCUMENTS', 'ADD_DOCUMENT_DETAIL', 'QUERY_CLASS', 'DELETE_DOCUMENT', 'GET_MANAGE_DOCUMENT_DETAIL','MODIFY_DOCMENT']),

        confirm(){
            if(!this.checkForm) {
                this.$nextTick(() => {
                    this.isAddDoc = true
                    return
                })
            }else {
                if (this.docForm.docId){
                    this.MODIFY_DOCMENT(this.docForm).then(() => {
                        this.$Notice.success({
                            title: '修改文档成功',
                        })
                        this.QUERY_DOCUMENTS({ keyword: '', page: this.page })
                        this.docForm = {}
                        this.setVal('')
                    }).catch(err => {
                        this.$Notice.error({
                            title: err,
                        })
                    })
                }else {
                    this.ADD_DOCUMENT_DETAIL(this.docForm).then(() => {
                        this.$Notice.success({
                            title: '新增文档成功',
                        })
                        this.QUERY_DOCUMENTS({ keyword: '', page: this.page })
                        this.docForm = {}
                        this.setVal('')
                    }).catch(err => {
                        this.$Notice.error({
                            title: err,
                        })
                    })
                }
            }
        },
        addDoc(classId){
            this.isAddDoc = !this.isAddDoc
            this.docForm.classId = classId
            this.title = '新增文档'
        },
        
        del(id){
            this.$Modal.confirm({
                title: '确认删除此文档',
                content: '删除后，文档中心的相关内容将被情况，你还要继续吗？',
                onOk: () => {
                    this.DELETE_DOCUMENT({ id: id }).then(() => {
                        this.$Notice.success({
                            title: '删除文档成功',
                        })
                        this.QUERY_DOCUMENTS({ keyword: '', page: this.page })
                    })
                },
                onCancel: () => {
                    
                }
            })
        },
        // 初始化富文本框
        initSummerNote(){
            const self = this
            const editer = self.$refs.editer
            editer.$on('onImageUpload', function (files, editor, $editable) {
                let formdata = new FormData()  
                formdata.append("file", $('.note-image-input')[0].files[0])  
                $.ajax({  
                    data : formdata,  
                    type : "POST",  
                    url : "/rest/dic/custom/uploadPicFile",     //图片上传出来的url，返回的是图片上传后的路径，http格式  
                    cache : false,  
                    contentType : false,  
                    processData : false,  
                    dataType : "json",  
                    success: function(data) {   
                        editer.run('insertImage', data.datas)
                    },  
                    error: function(){  
                        alert("上传失败")  
                    }  
                })  
            }),
            // 当富文本框内容发生变化时
            editer.$on('onChange', function (data) {
                self.docForm.docDesc = data
            })

        },
        setVal(val) {
            // 设置初始值
            this.$refs.editer.run('code', val)
        },

        down(){
            alert('down')
        },
        up(){
            alert('up')
        },
        edit(item){
            this.isAddDoc = !this.isAddDoc
            this.title = '编辑文档'
            this.GET_MANAGE_DOCUMENT_DETAIL({ docId: item.docId }).then(data => {
                this.docForm = data
            })
        },
        ctnChange (obj) {
            this.docForm.docDesc = obj
        }

    }
}

</script>


<style scoped>
.system-tag {
    min-height: 600px;
}
.section {
    border: 1px solid #d8dcf0;
    margin: 10px;
}
.title {
    height: 50px;
    line-height: 50px;
    text-indent: 15px;
    background: #f2f2f2;
}
.add-doc {
    height: 50px;
    line-height: 50px;
    text-indent: 5px;
}
.sub-title {
    height: 50px;
    line-height: 50px;
    background: #eef1f6;
    border-top: 1px solid #d8dcf0;
    border-bottom: 1px solid #d8dcf0;
    cursor: pointer;
}
.menu-wrapper {
    height: 400px;
    overflow-y: auto;
    clear: both;
}
.menu-item {
    height: 45px;
    line-height: 40px;
    padding: 1px 1px 1px 10px;   
    position: relative; 
    overflow-x: unset;
}
.menu-item:hover {
    background: #eee;
}
.menu-item:hover .icon-group{
    display: block;
}
.icon-group {
    position: absolute;
    right: 0;
    top: 0;
    display: none;
}
.icon {
    margin: 0;
    padding: 0;
    width: 20px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    cursor: pointer;
}
</style>
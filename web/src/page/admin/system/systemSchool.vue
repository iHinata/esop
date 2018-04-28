<template>
    <div class='system-school'>
        <Row :gutter='10'>
            <Col span='6' v-for='(item,i) in templateList' :key='i'>
                <Card class='card'>
                    <h4 class='title' :title='item.name' 
                        v-text="item.name.length>10?item.name.substring(0,9)+'...':item.name"></h4>
                    <span :title='item.mailTitle' v-text="item.mailTitle.length>10?item.mailTitle.substring(0,9)+'...':item.mailTitle"></span>
                    <div class="icon">
                        <Icon type="edit" color='#2d8cf0' size='14' @click.native.stop='showModal(item.id)'></Icon>
                    </div>
                </Card>
            </Col>
        </Row>

        <!-- 编辑邮件 -->
        <Modal v-model="isEditEmailTemplate" title='编辑邮件' :transfer='false' @on-ok="confirm" width='600' >
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
                <FormItem label="模板ID" prop="id" hidden>
                    <Input v-model="formValidate.id" placeholder="模板ID不可编辑" disabled></Input>
                </FormItem>
                <FormItem label="模板名称" prop="name">
                    <Input v-model="formValidate.name" placeholder="模板名称不可编辑" disabled></Input>
                </FormItem>
                <FormItem label="邮件标题" prop="mailTitle">
                    <Input v-model="formValidate.mailTitle" placeholder="邮件标题" ></Input>
                </FormItem>
                <FormItem label="邮件内容" prop="mailContent">
                    <vue-summernote ref="editer"></vue-summernote>
                </FormItem>
            </Form>
        </Modal>

    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
    data(){
        return {
            isEditEmailTemplate: false,
            formValidate: {
                id: '',
                name: '',
                mailTitle: '',
                mailContent: '',
            },
      
            ruleValidate: {
                id: [
                    { required: true, message: '', trigger: 'blur' },
                ],
                name: [
                    { required: true, message: '', trigger: 'blur' },
                ],
                mailTitle: [
                    { required: true, message: '邮件标题不得为空', trigger: 'blur' },
                    { type: 'string', max: 20, message: '最多输入20个字符', trigger: 'blur' }
                ],
                mailContent: [
                    { required: true, message: '邮件内容不得为空', trigger: 'blur' },
                    { type: 'string', max: 50, message: '最多输入50个字符', trigger: 'blur' }
                ],
            },
            page: {
                pageNum: 1,
                pageSize: 10
            }
        }
    },

    computed: {
        ...mapState({
            templateList: state => state.admin.templateList,
        }),
        checkForm(){
            let check = false
            if(!this.formValidate.mailTitle) {
                this.$Notice.error({ title: '标题不能为空' })
            }
            else if(this.formValidate.mailTitle.length > 10 ){
                this.$Notice.error({ title: '标题字数不得超过10个' })
            }
            else if(!this.formValidate.mailContent) {
                this.$Notice.error({ title: '内容不能为空' })
            }
            else {
                check = true
            }
            return check
        }
    },

    mounted(){
        this.QUERY_TEMPLATE({ keyword: '', page: this.page })
        
        // 初始化富文本框
        this.initSummerNote()
    },
    
    methods: {
        ...mapActions(['QUERY_TEMPLATE', 'MODIFY_TEMPLATE', 'GET_TEMPLATE_DETAIL']),
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
                self.formValidate.mailContent = data
                // console.log(self.formValidate.mailContent)
            })

        },
        setVal(val) {
            // 设置初始值
            this.$refs.editer.run('code', val)
        },


        // 编辑modal
        showModal(id){
            this.GET_TEMPLATE_DETAIL({ id: id }).then( data =>{
                this.formValidate = data
                this.isEditEmailTemplate = !this.isEditEmailTemplate
                this.setVal(this.formValidate.mailContent)
            })
        },
        
        confirm(){
            if(!this.checkForm) {
                return
            }
            this.MODIFY_TEMPLATE(this.formValidate).then(() => {
                this.formValidate = {}
                this.$Notice.success({ title: '编辑成功' })
                this.QUERY_TEMPLATE({ keyword: '', page: this.page })
            }).catch(err =>{
                this.$Notice.error({  title: err })
            })
        },
    }
}
</script>

<style scoped>
.system-school {
    min-height: 600px;
}
.card {
    height: 140px;
    text-align: center;
    position: relative;
    cursor: pointer;
}
.title {
    margin: 30px 0;
    font-size: 18px;
}
.icon {
    position: absolute;
    right: 10px;
    top: 10px;
    display: none;
}
.card:hover {
    border: 1px solid #2d8cf0;
}
.card:hover .icon{
    display: block;
}


</style>
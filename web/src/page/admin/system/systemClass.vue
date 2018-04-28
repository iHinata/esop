<template>
    <div>
        <div class='container'>
            <Row :gutter="16">
                <Col span='6' class='margin10'>
                <Card class='card' @click.native='addClass'>
                    <div style="margin-top: 60px;">
                        <Icon type="plus" size='40' color='#ccc'></Icon>
                        <p>添加分类</p>
                    </div>
                </Card>
                </Col>
                <Col span='6' v-for='(item,i) in systemClass.datas' :key='i' class='margin10'>
                <Card class='card' @click.native='getClassDetail(item)'>
                    <h4 slot="title" class='title' :title='item.className' v-text="item.className.length>15?item.className.substring(0,15)+'...':item.className"></h4>
                    <p class='card-content' v-text='item.classDesc' :title='item.classDesc'></p>
                    <Row style='height: 30px; line-height: 30px; '>
                        <Col span='10' style='text-align: left; '>
                        <Tag color="blue">{{ item.originName }}</Tag>
                        </Col>
                        <Col span='14' style='text-align: right; '>
                        <span>二级分类({{ item.childCount }})</span>
                        </Col>
                    </Row>
                    <div class="icon">
                        <Icon type="edit" color='#2d8cf0' size='14' v-show="item.schoolId==item.sourceId" @click.native.stop='modify(item.classId)'></Icon>
                        <Icon type="trash-a" color='#2d8cf0' size='16' v-show="item.schoolId==item.sourceId" @click.native.stop='del(item.classId,1)'></Icon>
                    </div>
                </Card>
                </Col>
            </Row>
        </div>

        <div class="pagination">
            <Page :total="systemClass.total" :page-size="page.pageSize" show-elevator @on-change='pageChange'></Page>
        </div>

        <!-- 分类详情 -->
        <Modal v-model="isShow" width='600' :transfer='transfer'>
            <div sot='header'>
                <h4 class='title'>{{firstClassName}}</h4>
                <p class='header-p'>{{firstClassDesc}}</p>
            </div>
            <Collapse v-model="value" accordion>
                <Panel :name="item.classId" v-for='(item,i) in classDetail' :key='i'>
                    {{item.className}}
                    <p v-for='(child,j) in item.childApiClasses' :key='j' slot="content">{{child.className}}</p>
                </Panel>
            </Collapse>
        </Modal>

        <!-- 添加分类 -->
        <Modal v-model="isAddClass" :title='title' width='800' :transfer='transfer'>
            <div class="step">
                <Steps :current="current">
                    <Step title="新建一级分类" content=""></Step>
                    <Step title="新建子分类" content=""></Step>
                </Steps>
            </div>
            <!-- step1 -->
            <div v-show='current==0'>
                <Form :model="formItem" :label-width="100">
                    <FormItem label="分类ID" hidden>
                        <Input v-model="formItem.classId"></Input>
                    </FormItem>
                    <FormItem label="一级分类名称:">
                        <Input v-model="formItem.className" placeholder="输入一级分类名称"></Input>
                    </FormItem>
                    <FormItem label="一级分类描述:">
                        <Input v-model="formItem.classDesc" type='textarea' placeholder="输入一级分类描述"></Input>
                    </FormItem>
                    <FormItem label="上传分类图片:">
                        <div class="upload">
                            <div class="upload-file">
                                <Icon type="camera" size="20" class='camera'></Icon>
                                <input name="file" type="file" accept="image/png,image/gif,image/jpeg" @change.stop="update" />
                            </div>
                            <div class='upload-file' v-if='imgUrl'>
                                <img :src="formItem.imgUrl" alt="">
                                <div class='btn-group'>
                                    <Icon type="android-delete" class='upload-icon' @click.native='deleteImg'></Icon>
                                </div>
                            </div>
                        </div>
                    </FormItem>
                </Form>
            </div>

            <!-- step2 -->
            <div class="step2" v-show='current==1'>
                <Row>
                    <Col span='6' class='second-class'>
                    <div class="menu-wrapper">
                        <MenuItem :name="index" v-for="(item,index) in secondClass" :key='index' @click.native.stop='selectSecondClass(item.classId, index)'
                            class='second-menu' :active-name='index' :class="secondIndex==index?'current-active':''">
                        <Row class='application-name'>
                            <span>{{item.className}}</span>
                            <Icon type="trash-a" color='#2d8cf0' size='14' class='application-name-trash' @click.native.stop='del(item.classId,2)'></Icon>
                        </Row>
                        </MenuItem>
                    </div>
                    <div class='add-second'>
                        <Button long class='add-btn' @click='isAddnewApplicattion=!isAddnewApplicattion' v-if='isAddnewApplicattion'>创建分类</Button>
                        <div v-else>
                            <Col span='18'>
                            <Input v-model="secondClassName" placeholder='添加二级分类' clearable></Input>
                            </Col>
                            <Col span='2'>
                                <Icon type="plus-circled" color='#2d8cf0' size='20' style='line-height: 32px; margin: 0 5px; cursor: pointer;' 
                                @click.native.stop='addChildClass(formItem.classId, secondClassName, 2)'></Icon>
                            </Col>
                        </div>
                    </div>
                    </Col>
                    <Col span='18' class='third-class' :gutter='20'>

                    <Row class="third-input">
                        <Col span='18'>
                        <Input v-model="thirdClassName" placeholder="输入三级分类名称" clearable></Input>
                        </Col>
                        <Col span='2'>
                        <Icon type="plus-circled" color='#2d8cf0' size='20' style='line-height: 32px; cursor: pointer; ' @click.native.stop='addChildClass(selSecondClassId, thirdClassName, 3)'></Icon>
                        </Col>
                    </Row>
                    <MenuItem :name="index" v-for="(item,index) in thirdClass.datas" :key='index' class='third-menu'>
                    <Row>
                        <Col span='18'>
                        <span>{{item.className}}</span>
                        </Col>
                        <Col span='2'>
                        <Icon type="trash-a" color='#2d8cf0' size='20' @click.native.stop='del(item.classId,3)'></Icon>
                        </Col>
                    </Row>
                    </MenuItem>

                    <div class="pagination">
                        <Page :total="thirdClass.total" :page-size="page.pageSize" simple @on-change='thirdPageChange'></Page>
                    </div>
                    </Col>
                </Row>
            </div>

            <div class='modal-footer' slot='footer'>
                <Button type="ghost" v-show='current==1' @click='previous'>上一步</Button>
                <Button type="primary" @click='next' v-show='current==0'>下一步</Button>
                <Button type="primary" @click='finish' v-show='current==1'>完成</Button>
            </div>

        </Modal>


    </div>
</template>


<script>
    import { mapActions, mapState } from 'vuex'
    import axios from 'axios'

    export default {
        data() {
            return {
                page: {
                    pageNum: 1,
                    pageSize: 7,
                },
                isAddnewApplicattion: true,
                second: {},
                secondKeyWords: '',
                thirdKeyWords: '',
                isAddSecondClass: true,
                current: 0,
                secondIndex: 0,
                transfer: false,
                isAddClass: false,
                isShow: false,
                value: '1',
                formItem: {
                    classId: '',
                    className: '',
                    classDesc: '',
                    imgUrl: '',
                    pid: '',
                },
                imgUrl: '',
                title: '添加分类',
                firstClassName: '',
                firstClassDesc: '',
                secondClassName: '',
                thirdClassName: '',
                selSecondClassId: '',
                classDetail: {},
                secondClass: [],
                thirdClass: {},
            }
        },

        mounted() {
            this.QUERY_CLASSES({ page: this.page })
        },

        computed: {
            ...mapState({
                systemClass: state => state.admin.systemClass,
            }),
            checked() {
                let check = false
                if (!this.formItem.className) {
                    this.$Notice.error({ title: '分类名称不得为空!' })
                }
                else if (this.formItem.className && this.formItem.className.length > 8) {
                    this.formItem.className.substring(0, 7)
                    this.$Notice.error({ title: '分类名称不得大于8个字符!' })
                }
                else if (!this.formItem.classDesc) {
                    this.$Notice.error({ title: '分类描述不得为空!' })
                }
                else if (this.formItem.classDesc && this.formItem.classDesc.length > 500) {
                    this.formItem.classDesc.substring(0, 29)
                    this.$Notice.error({ title: '分类描述不得大于500个字符!' })
                }
                else {
                    check = true
                }
                return check
            },
        },

        methods: {
            ...mapActions([
                'QUERY_CLASSES',
                'GET_CLASS_DETAIL',
                'DELETE_CLASS',
                'SAVE_CLASS',
                'QUERY_CURRENTLEVEL_CLASS',
                'GET_CURRENT_CLASS_DETAIL'
            ]),
            addClass(){
                this.isAddClass = !this.isAddClass
                this.formItem = {}
                this.imgUrl = ''
            },
            getClassDetail(item) {
                this.GET_CLASS_DETAIL({ classId: item.classId }).then((data) => {
                    this.classDetail = data
                    this.isShow = !this.isShow
                    this.firstClassName = item.className
                    this.firstClassDesc = item.classDesc
                }).catch(err => {
                    this.$Notice.error({ title: err })
                })
            },
            pageChange(num) {
                this.page.pageNum = num
                this.QUERY_CLASSES({ page: this.page })
            },
            update(e) {
                let file = e.target.files[0]
                let param = new FormData()
                const self = this
                param.append('file', file, file.name)

                let config = {
                    headers: { 'Content-Type': 'multipart/form-data' }
                }
                axios.post('/rest/dic/custom/uploadPicFile', param, config)
                    .then(res => {
                        if (res.data.resultCode == 0){
                            self.formItem.imgUrl = res.data.datas
                            self.imgUrl = res.data.datas
                            self.$Notice.success({ title: '图片上传成功' })
                        }else{
                            self.$Notice.error({ title: res.data.resultMessage })
                        }
                        
                    })
            },
            deleteImg() {
                this.formItem.imgUrl = ''
                this.imgUrl = ''
            },
            modify(classId) {
                this.isAddClass = !this.isAddClass
                this.title = '修改分类'
                this.GET_CURRENT_CLASS_DETAIL({ classId: classId }).then(data => {
                    this.imgUrl = data.imgUrl
                    this.formItem = data
                }).catch(err => {
                    this.$Notice.error({ title: err })
                })
            },

            del(classId, level) {
                this.$Modal.confirm({
                    title: '确认删除此分类',
                    content: '分类被删除后，它的子分类也将被删除，你还要继续吗？',
                    onOk: () => {
                        this.DELETE_CLASS({ classId: classId }).then(() => {
                            this.$Notice.success({ title: '删除分类成功' })
                            if (level == 1) {
                                this.QUERY_CLASSES({ page: this.page })
                            }
                            else if (level == 2) {
                                // 查询二级分类
                                this.QUERY_CURRENTLEVEL_CLASS({ pid: this.formItem.classId, page: { pageNum: -1, pageSize: 10 } }).then((secData) => {
                                    this.secondClass = secData.datas
                                    // 二级分类新增完毕后，将选择项设置到第一个
                                    this.selSecondClassId = secData.datas[0].classId
                                    this.thirdClass = {}
                                })
                            }
                            else {
                                this.QUERY_CURRENTLEVEL_CLASS({ pid: this.selSecondClassId, page: { pageNum: 1, pageSize: 7 } }).then((data) => {
                                    this.thirdClass = data
                                })
                            }
                        }).catch(error => {
                            this.$Notice.error({ title: error })
                        })

                    },
                    onCancel: () => {

                    }
                })
            },

            next() {
                if (!this.checked) {
                    return
                }
                this.formItem.pid = '-1'
                this.SAVE_CLASS(this.formItem).then((data) => {
                    this.formItem = data
                    this.current = 1
                    // 查询二级分类
                    this.QUERY_CURRENTLEVEL_CLASS({
                        pid: this.formItem.classId,
                        page: { pageNum: -1, pageSize: 10 }
                    }).then(secData => {
                        this.secondClass = secData.datas
                        if (secData.datas[0]){
                            this.selectSecondClass(secData.datas[0].classId, 0)
                        }
                    })
                }).catch(err => {
                    this.$Notice.error({ title: err })
                })
            },
            // 点击选择二级分类
            selectSecondClass(pid, i) {
                this.secondIndex = i
                this.selSecondClassId = pid
                // 查询三级分类
                this.QUERY_CURRENTLEVEL_CLASS({ pid: pid, page: { pageNum: 1, pageSize: 7 } }).then((data) => {
                    this.thirdClass = data
                })
            },
            // 三级分类分页
            thirdPageChange(num) {
                this.QUERY_CURRENTLEVEL_CLASS({
                    pid: this.selSecondClassId,
                    page: { pageNum: num, pageSize: 7 }
                }).then(data => {
                    this.thirdClass = data
                })
            },

            previous() {
                this.current = 0
            },

            finish() {
                this.formItem = {}
                this.current = 0
                this.thirdClass = {}
                this.QUERY_CLASSES({ page: this.page }).then(() => {
                    this.isAddClass = false
                    this.$Notice.success({ title: '新建分类成功' })
                })
            },

            // 添加子分类
            addChildClass(pid, className, level) {
                if(className == '') {
                    this.$Notice.error({ title: '分类名称不得为空' })
                    return
                }
                if(className.length > 8) {
                    this.$Notice.error({ title: '分类名称不能大于8个字符' })
                    return
                }
                this.SAVE_CLASS({ pid: pid, className: className }).then((data) => {
                    // 查询二级分类
                    if (level == 2) {
                        // 查询二级分类 二级分类不分页
                        this.QUERY_CURRENTLEVEL_CLASS({ pid: this.formItem.classId, page: { pageNum: -1, pageSize: 10 } }).then(secData => {
                            this.secondClass = secData.datas
                            // 二级分类新增完毕后，将选择项设置到第一个
                            this.selSecondClassId = secData.datas[0].classId
                            this.thirdClass = {}
                        })
                    }
                    else {
                        this.QUERY_CURRENTLEVEL_CLASS({ pid: this.selSecondClassId, page: { pageNum: 1, pageSize: 7 } }).then(data => {
                            this.thirdClass = data
                        })
                    }
                    this.isAddnewApplicattion = true
                    this.secondClassName = ''
                    this.thirdClassName = ''
                }).catch(err => {
                    this.$Notice.error({ title: err })
                })
            },
        },
    }
</script>

<style scoped>
    .card {
        height: 220px;
        text-align: center;
        position: relative;
        cursor: pointer;
    }

    .icon {
        position: absolute;
        right: 10px;
        top: 10px;
        display: none;
    }

    .step {
        width: 100%;
        text-align: center;
        padding: 15px 0;
    }

    .title {
        font-size: 20px;
    }

    .text {
        color: #999;
        font-size: 12px;
        margin-left: 10px;
    }

    .header-p {
        margin: 10px 0;
        word-wrap: break-word;
    }

    .card:hover {
        border: 1px solid #2d8cf0;
    }

    .card:hover .icon {
        display: block;
    }

    .card-content {
        width: 100%;
        height: 120px;
        overflow: hidden;
    }

    .add-second-class {
        width: 100%;
        height: 60px;
        background: #f7f7f7;
        color: #2d8cf0;
        font-size: 16px;
        text-align: center;
        line-height: 60px;
        cursor: pointer;
    }

    .input {
        width: 100%;
        height: 60px;
        line-height: 60px;
        background: #f7f7f7;
        text-align: center;
    }

    .second-class {
        border: #f2f2f2 1px solid;
        height: 300px;
        position: relative;
    }

    .menu-wrapper {
        height: 268px;
        overflow-y: scroll;
    }

    .add-btn {
        position: absolute;
        bottom: 0;
        left: 0;
        height: 32px;
    }

    .second-menu {
        width: 100%;
        height: 30px;
        line-height: 30px;
        padding-left: 10px;
    }

    .application-name-trash {
        display: none;
    }

    .second-menu:hover {
        background: #b7b7b7;
        color: #fff;
    }

    .current-active {
        background: #b7b7b7;
        color: #fff;
    }

    .second-menu:hover .application-name-trash {
        display: block;
    }

    .third-class {
        height: 300px;
        position: relative;
    }

    .pagination {
        width: 100%;
        text-align: center;
        position: absolute;
        bottom: 0;
    }

    .third-menu {
        width: 100%;
        height: 30px;
        line-height: 30px;
        text-indent: 30px;
    }

    .third-input {
        margin: 10px 30px;
        text-align: center;
        line-height: 32px;
    }

    .application-name {
        font-weight: inherit;
        padding: 0 10px;
        position: relative;
    }

    .application-name-trash {
        position: absolute;
        right: 10px;
        top: 9px;
    }

    .margin10 {
        margin: 10px 0;
    }

    .container {
        width: 100%;
        height: 540px;
    }
</style>
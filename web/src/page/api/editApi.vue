<template>
    <div class="edit-api">
        <!-- 面包屑 -->
        <Breadcrumb class='breadcrumb'>
            <BreadcrumbItem @click.native='$router.go(-1)'>返回</BreadcrumbItem>
            <BreadcrumbItem>编辑API详情</BreadcrumbItem>
        </Breadcrumb>
        <Form ref="editForm" :model="editForm" :rules="editFormRule" :label-width="100">
            <!-- API基本信息 -->
            <div class="title">API基本信息</div>

            <Row :gutter='20'>
                <Col span='12'>
                <FormItem label="API名称:" prop="apiName">
                    <Input v-model="editForm.apiName" placeholder="发消息上传附件接口"></Input>
                </FormItem>
                </Col>
                <Col span='12'>
                <FormItem label="API分类:" prop="classId">
                    <Cascader :data="classTrees" v-model="editForm.classId"></Cascader>
                </FormItem>
                </Col>
            </Row>

            <FormItem label="API标签:" prop="labels">
                <Select v-model="editForm.labelIds" multiple placeholder="请选择标签（最多5个）">
                    <Option v-for="item in apiLabels" :value="item.labelId" :key="item.labelId">{{ item.labelName }}</Option>
                </Select>
            </FormItem>

            <Row>
                <Col span='12'>
                <FormItem label="接口协议" prop="protocolId">
                    <RadioGroup v-model="editForm.protocolId">
                        <Radio label="1">SOAP</Radio>
                        <Radio label="2">RESTFUL</Radio>
                    </RadioGroup>
                </FormItem>
                </Col>
                <Col span='12'>
                <FormItem label="所属应用:" prop="appNo">
                    <Select v-model="editForm.providerId" placeholder="请选择所属应用" class='api-belong'>
                        <div class="app-search">
                            <Input v-model="appName" placeholder="请输入APP名称"></Input>
                        </div>
                        <Option v-for="(item, i) in providerApps" :value="item.appNo" :key="i">{{ item.appName }}</Option>
                        <div class="add-application-wrap">
                            <Row class='add-application' v-if='isAdd'>
                                <Col span='18'>
                                <Input v-model="addAppName"></Input>
                                </Col>
                                <Col span='3'>
                                <span style='color: #2d8cf0' @click="addNewProviderApp">确认</span>
                                </Col>
                                <Col span='3'>
                                <span @click="cancelAddNewProviderApp">取消</span>
                                </Col>
                            </Row>
                            <span v-else @click="isAdd=true">新增应用</span>
                        </div>
                    </Select>
                </FormItem>
                </Col>
            </Row>

            <FormItem label="部署URI:" prop="deployUri">
                <Input v-model="editForm.deployUri" placeholder="请输入部署URI"></Input>
            </FormItem>

            <FormItem label="访问URI:" prop="accessUri">
                <Input v-model="editForm.accessUri" placeholder="根据接口地址自动生成，支持用户修改" disabled></Input>
            </FormItem>

            <FormItem label="部署上下文:" prop="context">
                <Input v-model="editForm.context" placeholder="根据接口地址自动生成，支持用户修改"></Input>
            </FormItem>

            <FormItem label="描述:" prop="">
                <Input v-model="editForm.apiDesc" type='textarea' placeholder="请输入描述"></Input>
            </FormItem>
            
            <!-- API方法信息 -->
            <div class="methods">
                <div class="title">API方法信息</div>
                <Collapse v-model="methodsNum" accordion  v-if="editForm.apiMethods">
                    <Panel :name="i+''" v-for='(item, i) in editForm.apiMethods' :key='i'>
                        <span v-text='item.methodName'></span>
                        <span @click.stop='deleteMethods(item)'>
                            <Icon type="android-delete" color='#2d8cf0' style='position: absolute; top:10px; right:10px;'></Icon>
                        </span>
                        <div slot="content" class='method-pane'>
                            <Row class='line-h'>
                                <Col span='4' class='line-h-l'>方法名称</Col>
                                <Col span='16'>
                                    <Input v-model="item.methodName" placeholder="请输入"></Input>
                                </Col>
                            </Row>
                            <Row class='line-h'>
                                <Col span='4' class='line-h-l'>方法描述</Col>
                                <Col span='16'>
                                    <Input v-model="item.methodDesc" placeholder="请输入" type='textarea'></Input>
                                </Col>
                            </Row>
                            <Row class='line-h'>
                                <Col span='4' class='line-h-l'>请求参数</Col>
                                <Col span='16'>
                                    <vue-summernote :ref="'editerReq'+i" @onChange='reqChange'></vue-summernote>
                                </Col>
                            </Row>
                            <Row class='line-h'>
                                <Col span='4' class='line-h-l'>响应参数</Col>
                                <Col span='16'>
                                    <vue-summernote :ref="'editerRes'+i" @onChange='resChange'></vue-summernote>
                                </Col>
                            </Row>
                        </div>
                    </Panel>
                </Collapse>
                <div class="add-methods" @click='addMethods'>添加方法</div>
            </div>

            <div class="submit">
                <Button type="primary" @click.native='save'>保存</Button>
                <Button type="ghost" @click.native='cancel'>取消</Button>
            </div>
        </Form>

    </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  data() {
    return {
      methodsNum: '0',
      value1: '1',
      isAdd: false,
      appName: "",
      editForm: {
        apiId: "",
        apiName: "",
        classId: [],
        labels: [],
        labelIds: [],
        protocolId: "",
        appNo: [],
        deployUri: "",
        accessUri: "",
        context: "",
        apiDesc: "",
        servers: [],
        apiMethods: [],
        providerId: ""
      },
      
      editFormRule: {
        apiName: [
          { required: true, message: "该内容不得为空", trigger: "blur" }
        ],
        protocolId: [
          { required: true, message: "该内容不得为空", trigger: "blur" }
        ],
        deployUri: [
          { required: true, message: "该内容不得为空", trigger: "blur" }
        ],
        accessUri: [
          { required: true, message: "该内容不得为空", trigger: "blur" }
        ],
        context: [
          { required: true, message: "该内容不得为空", trigger: "blur" }
        ],
        servers: [
          { required: true, message: "该内容不得为空", trigger: "blur" }
        ]
      }
    };
  },
  computed: {
    ...mapState({
      classTrees: state => state.doc.classTrees,
      apiLabels: state => state.doc.apiLabels,
      providerApps: state => state.app.providerApps,
      getApiDetail: state => state.api.getApiDetail
    })
  },
  mounted() {
    this.QUERY_CLASS_TREE({});
    this.QUERY_LABEL({});
    this.GET_All_PROVIDERS({});
    this.GET_API_DETAIL({ apiId: this.$route.query.apiId, editer: "1" }).then(
      data => {
        this.editForm = data;
        this.initEdit();
      }
    );
  },
  methods: {
    ...mapActions([
      "QUERY_LABEL",
      "GET_All_PROVIDERS",
      "QUERY_CLASS_TREE",
      "GET_API_DETAIL",
      "MODIFY_API",
      "DELETE_API_METHODS"
    ]),
    reqChange(contents) {
      let i = this.methodsNum;
      this.editForm.apiMethods[i].reqParam = contents;
    },
    resChange(contents) {
      let i = this.methodsNum;
      this.editForm.apiMethods[i].rspParam = contents;
    },
    deleteMethods(item, i) {
      this.$Modal.confirm({
        title: "确认删除此方法",
        content: "此操作将无法保留您对方法一进行的所有操作，还要继续吗？",
        cancelText: "取消",
        okText: "继续",
        onOk: () => {
          if (item.methodId) {
            this.DELETE_API_METHODS({ methodId: item.methodId })
              .then(() => {
                this.editForm.apiMethods.splice(i, 1);
                this.$Notice.success({ title: "删除成功！" });
              })
              .catch(error => {
                this.$Notice.error({ title: error });
              });
          } else {
            this.editForm.apiMethods.splice(i, 1);
            this.$Notice.success({ title: "删除成功！" });
          }
        },
        onCancel: () => {}
      });
    },

    initEdit() {
      let i = this.methodsNum;
      let req = "editerReq" + i;
      let res = "editerRes" + i;
      if (
        this.getApiDetail.apiMethods &&
        this.getApiDetail.apiMethods.length > 0
      ) {
        this.editForm.apiMethods[i].reqParam = this.getApiDetail.apiMethods[
          i
        ].reqParam;
        this.editForm.apiMethods[i].rspParam = this.getApiDetail.apiMethods[
          i
        ].rspParam;
        this.setVal(req, this.editForm.apiMethods[i].reqParam);
        this.setVal(res, this.editForm.apiMethods[i].rspParam);
      }
    },
    // 设置初始值
    setVal(index, value) {
      this.$nextTick(() => {
        this.$refs[index][0].run("code", value);
      });
    },

    //取消
    cancel() {
      this.$Modal.confirm({
        title: "确认取消此方法",
        content: "此操作将无法保留您对方法一进行的所有操作，还要继续吗？",
        cancelText: "取消",
        okText: "继续",
        onOk: () => {
          this.editForm = {};
          this.$router.go(-1);
        },
        onCancel: () => {}
      });
    },

    //保存
    save() {
      let params = {
        accessUri: this.editForm.accessUri,
        apiDesc: this.editForm.apiDesc,
        apiId: this.editForm.apiId,
        apiMethods: this.editForm.apiMethods,
        apiName: this.editForm.apiName,
        classId: this.editForm.classId,
        context: this.editForm.context,
        deployUri: this.editForm.deployUri,
        labelIds: this.editForm.labelIds,
        protocolId: this.editForm.protocolId,
        providerId: this.editForm.providerId
      };
 
      this.MODIFY_API(params)
        .then(() => {
          this.$Notice.success({ title: "编辑API成功" });
          this.$router.go(-1);
        })
        .catch(error => {
          this.$Notice.error({ title: error });
        });
    },
    // 添加方法
    addMethods() {
      this.editForm.apiMethods.push({});
      this.methodsNum = (this.editForm.apiMethods.length - 1) + ''  
    }
  }
};
</script>

<style scoped>
.breadcrumb {
  margin: 10px 0;
  background: #fff;
  cursor: pointer;
}
.title {
  height: 80px;
  line-height: 80px;
  border-top: 1px solid #eee;
  font-weight: bold;
  font-size: 20px;
}

.add-methods {
  width: 100%;
  height: 60px;
  line-height: 60px;
  text-align: center;
  background: #f7f7f7;
  color: #2d8cf0;
  cursor: pointer;
}

.submit {
  width: 100%;
  text-align: center;
  margin: 20px 0;
}

.line-h {
  line-height: 32px;
  margin: 10px 0;
}
.method-pane {
  height: 300px;
  overflow-y: scroll;
}
.line-h-l {
  text-align: center;
}
</style>
<template>
    <div class='user'>
        <Row :gutter='20'>
            <Col span='4'>
                <Menu @on-select='onSelect' active-name='personInfo' width='auto' style='z-Index: 0; '>
                    <MenuItem name="personInfo">个人信息</MenuItem>
                    <MenuItem name="personModify" v-if="userInfo.source==2">密码修改</MenuItem>
                </Menu>
            </Col>
            <Col span='20'>
               <router-view></router-view>
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
            userInfo: state => state.user.userInfo,
        })
    },
    mounted(){
        this.onSelect('personInfo')
    },
    methods: {
        //
        onSelect(name){
            // console.log(name)
            this.$router.push(`/user/${name}`)
        }
    }
}
</script>

<style scoped>
.user {
    padding: 20px;
}
/* .ivu-menu-item-selected {
    border-right: none !important;
}
.ivu-menu-vertical.ivu-menu-light:after {
    width: 0;
}  */

</style>
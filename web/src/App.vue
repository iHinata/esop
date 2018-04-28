<template>
	<div id="app">	
        <head-component></head-component>
        <div id='esop'>
            <router-view/>
        </div>
        <foot></foot>
	</div>
</template>

<script>
import { mapActions } from 'vuex'
import headComponent from './components/headComponent'

export default {
	components: {
		headComponent,
    },
    
    mounted(){
        if(!sessionStorage.common) {
            this.GET_CUSTOM_INFO().then(data => {
                sessionStorage.common = JSON.stringify(data)
            })
        }
        
    },
    methods: {
        ...mapActions(['GET_CUSTOM_INFO']),
    },
}
</script>

<style>
@import './assets/css/reset.css';

#app {
    width: 100%;
    height: 100%;
    position: relative;
    padding-bottom: 60px
}
#esop {
    min-height: 800px;
}
.note-editable {
    height: 200px !important;
}
.modal-backdrop {
    display: none !important;
}

html {
    -ms-overflow-style: none;
    overflow: -moz-scrollbars-none;
}
html::-webkit-scrollbar{
    width: 0px;
}
#esop {
	padding: 64px 0 0;
    margin: 0 auto;
	font-size: 14px;
	width: 1200px;
    height: 100%;
    overflow-x: hidden;
}
.result-status .foot {
    background: #fff !important;
}
.ivu-tooltip-inner {
    background: #fff!important;
}
#forget-psw .foot {
    display: none;
}
#reseet-psw-status .foot {
	display: none;
	background: #fff;
}

/* common */

.pagination {
    padding: 10px 0;
    width: 100%;
    text-align: center;
    margin: 0;
}
.selected {
    position: absolute;
    left: 16px;
    bottom: 16px;
    cursor: pointer;
}
.ivu-card-head {
    border: none !important;
}
.application-name {
    font-weight: bold;
    margin-bottom: 5px;
}
.ivu-page-simple .ivu-page-simple-pager input{
    width: 35px !important;
}
.ivu-table-overflowX{
    overflow-x: hidden;
}

/* app-l */
.menu-wrapper {
    height: 370px;
    overflow: hidden;
}
.menu-item {
    overflow-x: hidden; 
    padding: 15px 10px;
    cursor: pointer;
    position: relative;
}
.menu-item-active {
    background: #d7d7d7;
}
.menu-item .ivu-icon-trash-b {
    position: absolute;
    top: 14px;
    right: 16px;
    color: #2d8cf0;
    display: none;
}
.menu-item:hover {
    background: #d7d7d7;
}
.menu-item:hover .ivu-icon-trash-b {
    display: block;
}
.menu-item-p {
    font-size: 12px;
    position: relative;
}
.menu-item-span {
    position: absolute;
    right: 0;
    color: #2d8cf0;
}


/* upload */
.upload::after {
    content: '';
    clear: both;
    display: block;
}
.upload-file {
    width: 50px;
    height: 50px;
    overflow: hidden;
    border: 1px solid #eee;
    float: left;
    margin: 0 5px;
    text-align: center;
    position: relative;
    cursor: pointer;
}
.upload-file input {
    opacity: 0;
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 10;
}
.upload-file .camera {
    width: 100%;
    height: 100%;
    line-height: 50px;
    text-align: center;
    position: absolute;
    left: 0;
    z-index: 1;
}
.upload-file img {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 100%;
    height: auto;
}
.upload-file:hover .btn-group {
    display: block;
}
.upload-file .btn-group {
    position: absolute;
    left: 0;
    top: 0;
    background: rgba(0,0,0, 0.5);
    width: 100%;
    height: 100%;
    line-height: 50px;
    display: none;
}
.upload-file .upload-icon {
    color: #fefefe;
    font-size: 18px;
}



/* 
审核api/待审核api
*/
.table-title {
    height: 40px;
    line-height: 40px;
    background: #f8f8f9;
    border-bottom: 1px solid #dddee1;
    font-weight: bold;
    font-size: 12px;
}
.table-common {
    clear: both;
    width: 100%;
    line-height: 1;
    border-bottom: 1px solid #dddee1;
}
.table-common-center {
    font-size: 12px;
    line-height: 1;
}
.center-p {
    margin: 6px 0;
}
.width50 {
    display: inline-block;
    width: 45%;
}
.table-span {
    display: inline-block;
    width: 100px;
    text-align: right;
    padding-right: 10px;
    color: #9dacc2;
}
.operation {
    font-size: 12px;
    color: #2d8cf0;
    cursor: pointer;
}

/* 
富文本
 */
 .my-vue-editor .toolbar .tabs .btn:hover {
    border: none;
    background: #f8f8f8;
 }
 .ivu-table-cell {
     overflow: visible;
 }

</style>
<template>
<div class="wrapper">
    <div class='title'>
        <slot name='title' ></slot>
    </div>
    <div class="content">
        <slot name='content'></slot>
    </div>
    <div class="foot">
        <slot name='foot'></slot>
    </div>
</div>
</template>

<style>
.wrapper{
    width: 480px;
    height: 480px;
    border: 1px solid #eee;
    border-radius: 5px;
    overflow: hidden;
    position: fixed;
    top: 50%;
    left: 50%;
    margin-left: -240px;
    margin-top: -240px;
    text-align: center;
    background: #fff;
    /* box-shadow: 1px 1px 20px #000; */
} 
.wrapper .title {
    font-size: 36px;
    font-weight: 400;
    color: #1890ff;
    height: 100px;
    line-height: 120px;
}
.wrapper .foot {
    width: 100%;
    height: 50px;
    line-height: 50px;
    background: #f2f2f2;
    position: absolute;
    bottom: 0;
}

.wrapper .foot a {
    color: #1890ff;
}
</style>
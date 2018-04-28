<template>
    <div>
        <Row class="expand-row">
            <Col span="22">
                <span class="expand-key">访问URI: </span>
                <span class='expand-value'>{{ row.accessUri || '-' }}</span>
            </Col>
            <Col span="2">
                <span class='common-span'  
                    v-clipboard:copy="row.accessUri"
                    v-clipboard:success="onCopy"
                    v-clipboard:error="onError">复制</span>
            </Col>
        </Row>
    </div>
</template>


<script>
export default {
    props:['row'],
    methods: {
        // 复制文本
        onCopy(e) {
            this.$Message.success('复制成功')
        },
        onError(e) {
            console.log('无法复制文本！')
        },
    }
}
</script>

<style scoped>

.expand-key {
    width: 100px;
    line-height: 1;
    display: inline-block;
    color: #bdbdbd;
}
.common-span {
    display: inline-block;
    width: 100%;
    color: #2d8cf0;
    cursor: pointer;
    text-align: right;
    line-height: 1;
}
.expand-value {
    width: 500px;
    line-height: 1;
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

</style>

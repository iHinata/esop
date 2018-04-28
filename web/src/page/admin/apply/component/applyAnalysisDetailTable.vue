
<template>
<div>
    <Row class="expand-row">
        <Col span="4">
            <span class="expand-key">错误描述:</span>
        </Col>
        <Col span="16">
            <span class="expand-value">{{ row.errorMessage || '-' }}</span>
        </Col>
    </Row>
    <Row class="expand-row">
        <Col span="4">
            <span class="expand-key">日志ID:</span>
        </Col>
        <Col span="16">
            <span class="expand-value">{{ row.logId || '-' }}</span>
        </Col>
    </Row>
    <Row class="expand-row">
        <Col span="4">
            <span class="expand-key">期待Token:</span>
        </Col>
        <Col span="16">
            <span class="expand-value">{{ row.accessToken || '-' }}</span>
        </Col>
        <Col span="4">
            <span class='common-span'  
                    v-clipboard:copy="row.accessToken"
                    v-clipboard:success="onCopy"
                    v-clipboard:error="onError">复制</span>
        </Col>
    </Row>
    <Row class="expand-row">
        <Col span="4">
            <span class="expand-key">实际Token:</span>
        </Col>
        <Col span="16">
            <span class="expand-value">{{ row.reqAccessToken || '-' }}</span>
        </Col>
        <Col span="4">
            <span class='common-span'  
                    v-clipboard:copy="row.reqAccessToken"
                    v-clipboard:success="onCopy"
                    v-clipboard:error="onError">复制</span>
        </Col>
    </Row>
</div>
</template>

<script>
export default {
    props: {
        row: Object
    },
    methods: {
        // 复制文本
        onCopy(e) {
            this.$Message.success('复制成功')
        },
        onError(e) {
            console.log('无法复制文本！')
        },
    },
}
</script>

<style scoped>
.expand-row {
    margin: 15px 0;
}
.expand-key {
    width: 100px;
    display: inline-block;
    color: #bdbdbd;
    line-height: 1;
}
.common-span {
    color: #2d8cf0;
    cursor: pointer;
    line-height: 1;
}
.expand-value {
    width: 370px;
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 1;

}
</style>
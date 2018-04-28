<template>
<div>
    <Row class="expand-row">
        <Col span="22">
        <span class="expand-key">升级时间: </span>
        <span class='expand-value'>{{ row.upgradeTime || '-' }}</span>
        </Col>
        <Col span="2">
        <!-- <span class='common-span'  
                        v-clipboard:copy="item.appCode"
                        v-clipboard:success="onCopy"
                        v-clipboard:error="onError">复制</span> -->
        </Col>
    </Row>
    <Row class="expand-row">
        <Col span="22">
        <span class="expand-key">上次同步时间: </span>
        <span class='expand-value'>{{ row.lastSyncTime || '-' }}</span>
        </Col>
        <Col span="2">
        <!-- <span class='common-span' v-clipboard:copy="row.accessUri" v-clipboard:success="onCopy" v-clipboard:error="onError">复制</span> -->
        </Col>
    </Row>
    <Row class="expand-row">
        <Col span="22">
        <span class="expand-key">管理员邮箱: </span>
        <span class='expand-value'>{{ row.managerEmail || '-' }}</span>
        </Col>
        <Col span="2">
        <!-- <span class='common-span' v-clipboard:copy="row.deployUri" v-clipboard:success="onCopy" v-clipboard:error="onError">复制</span> -->
        </Col>
    </Row>
</div>
</template>

<script>
export default {
props: ['row'],
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
.expand-row {
    margin: 8px 0;
}

.expand-key {
    width: 100px;
    display: inline-block;
    color: #bdbdbd;
    line-height: 1;
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
    width: 600px;
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 1;

}
</style>
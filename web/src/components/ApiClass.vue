<template>
    <Cascader :data="classTrees" :value="value" @on-change='handleChange'></Cascader>
</template>
<script>
import { mapState, mapActions } from 'vuex'

export default {
    model: {
        prop: 'value',
        event: 'change'
    },
    props: {
        value: Array
    },
    computed: {
        ...mapState({
            classTrees: state => state.doc.classTrees,
        })
    },
    methods: {
        ...mapActions([
            'QUERY_CLASS_TREE'
        ]),
        handleChange (value, selectedData) {
            // this.value = selectedData.map(o => o.value);
            this.$emit('change', selectedData.map(o => o.value));
            // this.selectClasses = selectedData.map(o => o.value)
        }
    },
    created() {
        this.QUERY_CLASS_TREE({})
    }
}
</script>


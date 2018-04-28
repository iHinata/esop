<template>
<div>  
    <p v-for='(item, i) in servers' :key='i' class="expand-row">{{ item.serverName }}</p>
</div>
</template>

<script>
export default {
    props: ['servers'],
}
</script>

<style scoped>
.expand-row {
    margin: 10px 0;
}


</style>
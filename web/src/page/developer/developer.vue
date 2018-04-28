<template>
    <div class="dev">
        <Tabs type="card" :animated="false">
            <TabPane label="发布API" name='0'>
                <release-api></release-api>
            </TabPane>
            <TabPane label="使用API" name='1'>
                <use-api ref='useApi'></use-api>
            </TabPane>
        </Tabs>
    </div>
</template>

<script>
import releaseApi from './releaseApi/releaseApi'
import useApi from './useApi/useApi'


export default {
    components: {
		releaseApi,useApi
	},
}
</script>

<style scoped>
    
.dev{
    padding-top: 20px; 
}
</style>
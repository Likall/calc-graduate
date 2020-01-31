<template>
	<div class="headerContainer" v-if="currentUser.length > 0">
		<div style="display: inline-block;" v-if="currentUser[0].role === '2'">
			<a-input-search 
				:placeholder='placeHolderContent' 
				@search="onSearch" 
				enterButton 
				size="large"/>
		</div>
		
	</div>
</template>
<script>
	import FormWork from './FormWork'
import { mapGetters } from 'vuex'
	export default {
		name: 'Header',
		data() {
			return {
				placeHolderContent: '输入内容'
			}
		},
		computed:{
			...mapGetters({
				currentUser: 'currentUser',				// 当前登录用户信息
			})
		},
		methods: {
			onSearch(){}
		}
	}
</script>
<style lang="scss" scoped>
	.headerContainer{
		width: 250px;
		margin-top: 45px;
		
	}
	
</style>
<template>
	<div class="tabTitleContainer" 
		:style="{'width': posTabWidth.width, 'left': posTabWidth.left}">
		<a-tabs
			hideAdd 
			:activeKey="activeKey"
			type="editable-card"
			@edit="editTab"
			@change="handleChangeTabs">
			<a-tab-pane
				v-for="(item, index) in tabTitleItem" 
				:key="item.key"
				:closable="true">
				<span slot="tab">
					<i class="iconfont" :class="item.datas.icon"></i>
					{{item.datas.title}}
				</span>
			</a-tab-pane>
		</a-tabs> 
	</div>
</template>
<script>
	import {mapGetters, mapActions} from 'vuex';
	export default {
		name: 'TabTitle',
		props: [
			'activeKey'
		],
		data(){
			return{
				// activeKey: ''
			}
		},
		computed: {
			...mapGetters({
				posTabWidth: 'header/posTabWidth',								// tab宽度与左边距
				tabTitleItem: 'tabTitleItem',									// 顶部tab项
				leftBarList: 'leftBarList',										// 左侧边栏栏项
			})
		},
		mounted() {
			// if(this.tabTitleItem.length !== 0){
			// 	this.activeKey = this.tabTitleItem[0].key
			// }
		},
		watch: {
			// tabTitleItem(New, Old){
			// 	if(New){
			// 		if(this.activeKey === ''){
			// 			this.activeKey = this.tabTitleItem[0].key
			// 		}
			// 	}
			// },

		},
		methods:{
			...mapActions({
				setDetailCurrentComponent: 'setDetailCurrentComponent',				// 设置当前详情加载的组件
			}),
			editTab(targetKey, action){
				console.log(targetKey, action)
			},
			// tab切换事件
			handleChangeTabs(key){
				console.log(typeof key)
				// 设置当前击中key
				this.$emit('activeKey', key+'')
				for(let i = 0; i < this.tabTitleItem.length; i++){
					if(this.tabTitleItem[i].key === key){
						this.setDetailCurrentComponent(this.tabTitleItem[i].datas.component)
					}
				}
			}
		}
	}
</script>
<style lang="scss" scoped>
	.tabTitleContainer{
		height: 40px;
		position: fixed;
		top: 60px;

	}
</style>
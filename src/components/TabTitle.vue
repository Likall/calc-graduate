<template>
	<div class="tabTitleContainer" 
		:style="{'width': posTabWidth.width, 'left': posTabWidth.left}"
		>
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
		},
		methods:{
			...mapActions({
				setDetailCurrentComponent: 'setDetailCurrentComponent',				// 设置当前详情加载的组件
				setTabTitleItem: 'setTabTitleItem',									// 设置tab项
			}),
			editTab(targetKey, action){
				this[action](targetKey);
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
			},
			// tab删除事件
			remove(targetKey) {
				let activeKey = this.activeKey;
				let lastIndex;
				this.tabTitleItem.forEach((pane, i) => {
					if (pane.key === targetKey) {
						lastIndex = i - 1;
					}
				});
				const panes = this.tabTitleItem.filter(pane => pane.key !== targetKey);
				if (panes.length && activeKey === targetKey) {
					if (lastIndex >= 0) {
						activeKey = panes[lastIndex].key;
					} else {
						activeKey = panes[0].key;
					}
				}
				// 设置tab项和击中key
				this.setTabTitleItem(panes);
				this.$emit('activeKey', activeKey)
				// 如果tab项为0，则设置当前详情组件为空
				if(this.tabTitleItem.length === 0){
					this.setDetailCurrentComponent('')
				}else{
					// tab项不为0时，向后/向前加载
					let exsist = this.tabTitleItem.filter(data => {
						return data.key === activeKey
					})
					console.log(exsist)
					if (exsist.length !== 0){
						this.setDetailCurrentComponent(exsist[0].datas.component)
					}
				}
			},
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
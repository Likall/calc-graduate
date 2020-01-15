<template>
	<div class="leftBarContainer"
		:class="collapsed === false ? 'collapsed' : 'notcollapsed'">
		<a-menu
			mode="inline"
			theme="dark"
			:inlineCollapsed="collapsed">
			<a-sub-menu key="sub1">
				<span slot="title"><i class="iconfont icon-xuesheng paddingRigTwenty icon-eighteen" /><span>学生</span></span>
				<a-menu-item key="6"
					@click="handleMenuChange('6', '0', '成绩', 'StudentGrade')">
					<span class="sub-title">
						成绩
					</span>
				</a-menu-item>
				<a-menu-item key="7"
					@click="handleMenuChange('7', '0', '成绩统计', 'StudentAnalysis')">
					<span class="sub-title">
						成绩统计
					</span>
				</a-menu-item>
			</a-sub-menu>
			<a-menu-item 
				v-for="(item, index) in leftBarList" 
				:key="item.key"
				@click="handleMenuChange(item.key, '1')"
				>
				<i class="iconfont paddingRigTwenty icon-eighteen" :class="item.icon"></i>
				<span>{{item.title}}</span>
			</a-menu-item>
			<!-- <a-sub-menu key="sub1">
				<span slot="title"><a-icon type="mail" /><span>Navigation One</span></span>
				<a-menu-item key="5">Option 5</a-menu-item>
				<a-menu-item key="6">Option 6</a-menu-item>
				<a-menu-item key="7">Option 7</a-menu-item>
				<a-menu-item key="8">Option 8</a-menu-item>
			</a-sub-menu>
			<a-sub-menu key="sub2">
				<span slot="title"><a-icon type="appstore" /><span>Navigation Two</span></span>
				<a-menu-item key="9">Option 9</a-menu-item>
				<a-menu-item key="10">Option 10</a-menu-item>
				<a-sub-menu key="sub3" title="Submenu">
				<a-menu-item key="11">Option 11</a-menu-item>
				<a-menu-item key="12">Option 12</a-menu-item>
				</a-sub-menu>
			</a-sub-menu> -->
		</a-menu>
	</div>
</template>
<script>
	import {mapGetters, mapActions} from 'vuex'
	import tools from '@/public/tools/tools'
	export default {
		name: 'LeftBar',
		props: [
			'tabs'
		],
		data(){
			return{
				activeKey: '',					// 击中项key
			}
		},
		computed:{
			...mapGetters({
				collapsed: 'header/collapsed',										// menu 折叠
				tabTitleItem: 'tabTitleItem',										// 顶部tab项
				leftBarList: 'leftBarList',											// 左侧边栏栏项
				detailCurrentComponent: 'detailCurrentComponent',				     // 详情加载的组件
			})
		},
		methods: {
			...mapActions({
				setTabTitleItem: 'setTabTitleItem',									// 设置顶部tab项
				setDetailCurrentComponent: 'setDetailCurrentComponent',				// 设置当前详情加载的组件
			}),

			/**
			* Introduction 菜单项点击向右顶侧tab添加
			* @author 刘莉
			* @since 1.0
			* @param {key} key值 
			* @param {type} 0 - 折叠菜单下子项，1-非折叠菜单
			* @param {desc} 折叠菜单下的子项名称
			*/
			handleMenuChange(key, type, desc, com){
				let tempTabArr = tools.deepClone(this.tabTitleItem)
				// 是否存在
				let exsist = tempTabArr.filter(item => {
					return item.key === key
				})
				// 存在不向数组中插入数据
				if(exsist.length !== 0){
					this.$emit('activeKey', key+'')
					return
				}else{
					// 非折叠菜单子项
					if(type === '0'){
						let newArrayTemp = {
							key: key,
							datas: {
								icon: '',
								title: desc,
								key: key,
								component: com
							}
						}
						// 插入数据
						let newTabArr = tools.deepClone(this.tabTitleItem)
						newTabArr.push(newArrayTemp)
						this.setTabTitleItem(newTabArr)
						this.setDetailCurrentComponent(com)

					}else{
						let newArrayTemp = {
							key: key,
							datas: this.leftBarList[key -1]
						}
						let newTabArr = tools.deepClone(this.tabTitleItem)
						newTabArr.push(newArrayTemp)
						this.setTabTitleItem(newTabArr)
						this.setDetailCurrentComponent(this.leftBarList[key -1].component)
					}
					this.$emit('activeKey', key+'')
					
				}
			}
		},
	}
</script>
<style lang="scss" scoped>
	.leftBarContainer{
		height: calc(100% - 60px);
		position: fixed;
		top: 60px;

		.ant-menu{
			width: 100%;
			height: 100%;
			position: relative;

			.ant-menu-item{
				padding-left: 30px;
			}

			.iconfont{
				margin-left: -6px;
			}

			
		}

		.ant-menu-item-active,
		.ant-menu-item-selected{
			border-left: 4px solid #0080C0;

			.iconfont{
				margin-left: -10px;
			}

			.sub-title{
				display: inline-block;
				margin-left: -4px;
			}
		}
	}

	.collapsed{
		width: 240px;
	}
	.notcollapsed{
		width: 66px;
		
		.ant-menu-item{
			padding: 0 31px !important;
		}
	}
</style>
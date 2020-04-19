<template>
	<div class="leftBarContainer"
		:class="collapsed === false ? 'collapsed' : 'notcollapsed'">
		<!-- menu 教师与学生 -->
		<div v-if="currentUser[0].role === '2'" class="leftBarBox">
			<a-menu
				mode="inline"
				theme="dark"
				:inlineCollapsed="collapsed">
				<a-sub-menu key="sub1">
					<span slot="title"><i class="iconfont icon-xuesheng paddingRigTwenty icon-eighteen" /><span>学生</span></span>
					<a-menu-item key="6"
						@click="handleMenuChange('6', '0', '学生列表', 'StudentDetailList', '')">
						<span class="sub-title">
							学生列表
						</span>
					</a-menu-item>
					<a-menu-item key="14"
						@click="handleMenuChange('14', '0', '课程与学生关系', 'StudentGrade', '')">
						<span class="sub-title">
							课程与学生关系
						</span>
					</a-menu-item>
					<a-menu-item key="7"
						@click="handleMenuChange('7', '0', '统计', 'StudentAnalysis', '')">
						<span class="sub-title">
							统计
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
				<a-sub-menu key="sub2">
					<span slot="title"><i class="iconfont icon-xuesheng paddingRigTwenty icon-tongji"/><span>达成度</span></span>
					<a-menu-item key="15"
						@click="handleMenuChange('15', '0', '达成度计算', 'AchevementDetail', '')">
						<span class="sub-title">
							达成度计算
						</span>
					</a-menu-item>
					<a-menu-item key="16"
						@click="handleMenuChange('16', '0', '达成度统计', 'AchievmentAnalysis', '')">
						<span class="sub-title">
							达成度统计
						</span>
					</a-menu-item>
				</a-sub-menu>
				<!-- <a-menu-item key="17"
					@click="handleMenuChange('17', '0', '专业计划', 'PlanDetail', 'icon-jihua')">
					<span class="title">
						<i class="iconfont icon-jihua paddingRigTwenty icon-eighteen" />
						专业计划
					</span>
				</a-menu-item> -->
			</a-menu>
		</div>
		<!-- 管理员 -->
		<div v-if="currentUser[0].role === '1'" class="leftBarBox">
			<a-menu
				mode="inline"
				theme="dark"
				:inlineCollapsed="collapsed">
				<a-sub-menu key="sub1">
					<span slot="title">
						<i class="iconfont icon-renyuanguanli paddingRigTwenty icon-eighteen" />
						<span>人员管理</span>
					</span>
					<a-menu-item key="9">
						<span class="sub-title" @click="handleMenuChange('9', '0', '人员列表', 'RoleStuDetail', '')">人员列表</span>
					</a-menu-item>
				</a-sub-menu>
			</a-menu>
		</div>
		<!-- 学生 -->
		<div v-if="currentUser[0].role === '3'" class="leftBarBox">
			<a-menu
				mode="inline"
				theme="dark"
				:inlineCollapsed="collapsed">
				<a-menu-item key="7"
					@click="handleMenuChange('7', '0', '统计', 'StudentAnalysis', '')">
					<span class="sub-title">
						统计
					</span>
				</a-menu-item>
			</a-menu>
		</div>
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
				tabTitleItem: 'publicData/tabTitleItem',										// 顶部tab项
				leftBarList: 'leftBarList',											// 左侧边栏栏项
				detailCurrentComponent: 'publicData/detailCurrentComponent',				     // 详情加载的组件
				currentUser: 'currentUser',				 // 当前登录用户信息
			})
		},
		mounted(){
			// console.log(this.$cookie.get('username'))
		},
		methods: {
			...mapActions({
				setTabTitleItem: 'publicData/setTabTitleItem',									// 设置顶部tab项
				setDetailCurrentComponent: 'publicData/setDetailCurrentComponent',				// 设置当前详情加载的组件
			}),

			/**
			* Introduction 菜单项点击向右顶侧tab添加
			* @author 刘莉
			* @since 1.0
			* @param {key} key值 
			* @param {type} 0 - 折叠菜单下子项，1-非折叠菜单
			* @param {desc} 折叠菜单下的子项名称
			* @param {com} 当前组件名称
			* @param {icon} 当前列表图标
			*/
			handleMenuChange(key, type, desc, com, icon){
				let tempTabArr = tools.deepClone(this.tabTitleItem)
				// 是否存在
				let exsist = tempTabArr.filter(item => {
					return item.key === key
				})
				// 存在不向数组中插入数据
				if(exsist.length !== 0){
					// 设置当前击中的key与当前详情组件
					if(type === '0'){
						this.setDetailCurrentComponent(com)
					} else {
						this.setDetailCurrentComponent(this.leftBarList[key -1].component)
					}
					this.$emit('activeKey', key+'')
					return
				}else{
					// 非折叠菜单子项
					if(type === '0'){
						let newArrayTemp = {
							key: key,
							datas: {
								icon: icon,
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

		.leftBarBox{
			height: 100%;
		}

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
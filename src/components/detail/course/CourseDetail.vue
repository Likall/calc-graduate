<template>
	<div class="courseDetailContainer">
		
		<!-- <a-spin :spinning="spinning"> -->
		<!-- 搜索按钮 -->
		<Header style="margin-top:0;" :placeData="placeData"></Header>
		<!-- 列表 -->
		<table-list 
			:title="tabTitle"
			:com="currentCom">
		</table-list>
		<!-- </a-spin> -->
	</div>
</template>
<script>
	import Header from '@/components/detail/public/Header'
	import FormWork from '@/components/detail/public/FormWork'
	import FormTable from '@/components/detail/public/FormTable'
	import TableList from '@/components/detail/public/TableList'
	import StepDetail from '@/components/detail/public/StepDetail'
	import { mapGetters } from 'vuex'
	import config from '@/api/config.js'
	export default {
		name: 'CourseDetail',
		components: {
			Header,
			FormWork,
			FormTable,
			TableList,
			StepDetail
		},
		data(){
			return {
				spinning: false,			// loading 状态
				tableListSpinning: false,	// table列表loading
				dataSource: [],				// 列表数据源
				columns: [					// 列表列数据
					{
						title: '课程号',
						slot: 'courseId'
					},
					{
						title: '课程名称',
						slot: 'courseName'
					},
					{
						title: '课程学分',
						slot: 'courseCredit',
						sortable: true
					},
					{
						title: '课程学期',
						slot: 'courseTerm',
						sortable: true
					},
					{
						title: '课程平均分',
						slot: 'courseAverage',
						sortable: true
					},
					{
						title: '课程总分制',
						slot: 'courseTotalGrade',
						sortable: true
					},
					{
						title: '操作',
						slot: 'action'
					}
				],
				tabTitle: '课程列表',
				coursePagination: {current: 1, total: 0, pageSize: 10, page: 1},			// 分页信息
				disableOfBtn: true,
				isSuccess: false,			// 导入文件是否成功
				responseData: {},			// 接口返回数据
				placeData: '请输入课程名称', 
				currentCom: 'CourseDetail',	// 当前组件名称
			}
		},
		computed:{
			...mapGetters({
				currentUser: 'currentUser',				 // 当前登录用户信息
				detailCurrentComponent: 'publicData/detailCurrentComponent',	// 当前详情加载的组件
				courseColumns: 'courseColumns',						// 课程模板文件列
				courseData: 'courseData',							// 课程模板文件数据
			})
		},
		watch:{
			// 设置button是否是可点击
			// detailCurrentComponent(New, Old){
			// 	if (New === 'CourseDetail') {
			// 		if (this.courseColumns.length !== 0 && this.courseData.length !== 0) {
			// 			this.disableOfBtn = false
			// 		}else {
			// 			this.disableOfBtn = true
			// 		}
			// 	}
			// }
		},
		mounted(){
			// 获得所有课程列表
			// this.getCourseInfoList()
		},
		methods: {
			// 处理文件上传
			handleFileChange(info){
				this.spinning = true;
				if (info.file.status === 'done') {
					this.isSuccess = true;
					this.spinning = false;
					// 执行成功
					this.responseData = info.file.response
					this.$message.success('上传成功');
				} else if (info.file.status === 'error') {
					this.$message.error('上传失败');
					this.isSuccess = false;
					this.spinning = false;
				}
			},

			

			/**
			* Introduction 分页，页数change事件
			* @author 刘莉
			* @since 1.0
			* @param {page} 当前点击的page
			*/
			changePage(page){
				const coursePagination = {...this.coursePagination}
				coursePagination.page = page
				coursePagination.current = page
				this.coursePagination = coursePagination
				this.getCourseInfoList()
			},

			/**
			* Introduction 子组件接收的loading状态 
			* @author 刘莉
			* @since 1.0
			* @param {flag} false：关闭，true开启
			*/
			getTableLoading(flag){
				this.tableListSpinning = flag
			},

			/**
			* Introduction 向父组件传递当前击中的key
			* @author 刘莉
			* @since 1.0
			* @param {key} 从StepDetail接收的key
			*/
			setActiveKey(key){
				// 设置当前击中key
				this.$emit('activeKey', key+'')
			}
		}
	}
</script>
<style lang="scss" scoped>
	.courseDetailContainer{
		position: relative;
		width: 100%;
		height: 100%;
		padding-top: 10px;
		box-sizing: border-box;
		-webkit-box-sizing: border-box;
		-moz-box-sizing: border-box;
		padding: 20px 15px;

		.btn-form{
			// display: flex;
			// justify-content: flex-end;
			// margin-right: 10px;
			position: relative;
			width: 100%;
			top: 30px;

			button{
				margin-right: 15px;
			}

			.uploadCsvContainer{
				display: inline-block; 
				position: relative; 
			}
		}
	}
</style>
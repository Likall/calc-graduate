<template>
	<div class="courseDetailContainer">
		
		<a-spin :spinning="spinning">
			<div class="btn-form" v-if="currentUser.length > 0">
				<form-work v-if="detailCurrentComponent === 'CourseDetail'" ></form-work>
				<div class="uploadCsvContainer" v-if="currentUser[0].role === '2'">
					<!-- 导入文件 -->
					<a-upload
						name="file"
						:multiple="false"
						@change="handleFileChange"
						action="http://localhost:8091/gacs/course/uploadfile"
					>
					<a-button type="primary" size="large" :disabled="disableOfBtn"> <a-icon type="upload" />导入CSV文件</a-button>
					</a-upload>
				</div>
				
			</div>
			<a-spin :spinning="tableListSpinning" v-if="currentUser.length > 0 "> 
				<Header></Header>
				<!-- 列表 -->
				<course-table-list 
					:columns="columns"
					:dataSource="dataSource"
					:title="tabTitle"
					@tableLoading="getTableLoading"
				></course-table-list>
				<!-- table默认一页显示10条数据 -->
				<div style="margin: 10px 10px 30px 10px;overflow: hidden" v-if="currentUser[0].role === '2'">
					<div style="float: right;">
						<Page :total="coursePagination.total" :current="1" @on-change="changePage"></Page>
					</div>
				</div>
			</a-spin>
		</a-spin>
	</div>
</template>
<script>
	import Header from '@/components/detail/public/Header'
	import FormWork from '@/components/detail/public/FormWork'
	import FormTable from '@/components/detail/public/FormTable'
	import CourseTableList from '@/components/detail/course/CourseTableList'
	import { mapGetters } from 'vuex'
	import config from '@/api/config.js'
	export default {
		name: 'CourseDetail',
		components: {
			Header,
			FormWork,
			FormTable,
			CourseTableList
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
			}
		},
		computed:{
			...mapGetters({
				currentUser: 'currentUser',				 // 当前登录用户信息
				detailCurrentComponent: 'detailCurrentComponent',	// 当前详情加载的组件
				courseColumns: 'courseColumns',						// 课程模板文件列
				courseData: 'courseData',							// 课程模板文件数据
			})
		},
		watch:{
			// 设置button是否是可点击
			detailCurrentComponent(New, Old){
				if (New === 'CourseDetail') {
					if (this.courseColumns.length !== 0 && this.courseData.length !== 0) {
						this.disableOfBtn = false
					}else {
						this.disableOfBtn = true
					}
				}
			}
		},
		mounted(){
			// 获得所有课程列表
			this.getCourseInfoList()
		},
		methods: {
			// 处理文件上传
			handleFileChange(info){
				if (info.file.status === 'done') {
					this.$message.success('上传成功');
				} else if (info.file.status === 'error') {
					this.$message.error('上传失败');
				}
			},

			// 获得课程信息列表
			getCourseInfoList(){
				let self = this
				// 开启loading
				self.tableListSpinning = true;
				let page = parseInt(self.coursePagination.page)
				let	pageSize = parseInt(self.coursePagination.pageSize)
				
				self.axios.post(config.GET_ALL_COURSE_LIST + '?page=' +page +'&pageSize=' + pageSize).then(response =>{
					// 查询成功
					if (response.data.code === '200'){
						// 有数据
						if (response.data.data.data.length > 0){
							// 分页信息
							const coursePagination = {...self.coursePagination}
							// 总数
							coursePagination.total = parseInt(response.data.data.count)
							self.coursePagination = coursePagination
							self.dataSource = response.data.data.data
						}
					}
					// 关闭loading
					self.tableListSpinning = false
				})
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

		.btn-form{
			display: flex;
			justify-content: flex-end;
			margin-right: 10px;
			position: relative;
			width: 100%;

			.uploadCsvContainer{
				display: inline-block; 
				left: calc(290px - 100%); 
				position: relative; 
				top: 2px;
			}
		}
	}
</style>
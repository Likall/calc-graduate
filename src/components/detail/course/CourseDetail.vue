<template>
	<div class="courseDetailContainer">
		<div class="content-box">
			<a-spin :spinning="spinning" tip="正在生成模板文件,请等待....">
				<div class="btn-form">
					<a-button @click="openAddCourse" size="large"><a-icon type="plus" />添加课程</a-button>
					<a-button @click="exportExcel" size="large"><a-icon type="download" />下载课程信息模板</a-button>
					<div class="uploadContainer">
						<!-- 导入文件 -->
						<a-upload
							name="file"
							:multiple="false"
							@change="handleFileChange"
							action="http://localhost:8091/gacs/excel/course"
						>
						<a-button type="primary" size="large"> <a-icon type="upload" />导入课程信息文件</a-button>
						</a-upload>
					</div>	
				</div>
				<!-- 搜索按钮 -->
				<Header style="padding:10px 0px 0px 10px;margin-top: 0px;" :placeData="placeData" type="course" @setSearchCourseData="setSearchCourseData"></Header>
				<!-- 列表 -->
				<table-list 
					:title="tabTitle"
					:com="currentCom"
					:isSuccess="isSuccess"
					:tablists="dataSource"
					style="padding:10px 0px 0px 10px;">
				</table-list>
			</a-spin>
		</div>
		<a-modal 
			:visible="isShowAddCourse"
			@cancel="handleCancel">
			<add-course @closeModal="handleCancel"></add-course>
		</a-modal>
	</div>
</template>
<script>
	import Header from '@/components/detail/public/Header'
	import FormWork from '@/components/detail/public/FormWork'
	import FormTable from '@/components/detail/public/FormTable'
	import TableList from '@/components/detail/public/TableList'
	import StepDetail from '@/components/detail/public/StepDetail'
	import AddCourse from '@/components/detail/course/AddCourse'
	import { mapGetters } from 'vuex'
	import config from '@/api/config.js'
	import tools from '@/public/tools/tools'
	export default {
		name: 'CourseDetail',
		components: {
			Header,
			FormWork,
			FormTable,
			TableList,
			StepDetail,
			AddCourse
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
				isShowAddCourse: false,		// 弹出添加课程模态框
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
		},
		mounted(){
			// 获得所有课程列表
			// this.getCourseInfoList()
		},
		methods: {

			/**
			 * Introduction 生成模板文件
			 * @author 刘莉
			 * @since 1.0
			 */
			exportExcel(){
				require.ensure([], () => {
					const { export_json_to_excel } = require("../../../excel/Export2Excel");
 
				    const tHeader = ['课程ID', '课程名', '学分', '学期', '平均分', '总分制']; //将对应的属性名转换成中文
					const filterVal = ['courseId', 'courseName', 'courseCreit', 'trem', 'total', 'average']　　
					
					const data = []
				    export_json_to_excel(tHeader, data, '课程信息模板');　
				});
			},

			formatJson(filterVal, jsonData) {
				return jsonData.map(v => filterVal.map(j => v[j]));
			},

			/**
			 * Introduction 处理文件上传
			 * @author 刘莉
			 * @since 1.0
			 */
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
			},

			/**
			 * Introduction 弹出添加课程模态框
			 * @author 刘莉
			 * @since 1.0
			 */
			openAddCourse () {
				this.isShowAddCourse = true
			},

			/**
			* Introduction 从子组件接收按课程名模糊查询的列表值
			* @author 刘莉
			* @since 1.0
			* @param {data} 从header接收的data
			*/
			setSearchCourseData (data) {
				this.dataSource = tools.deepClone(data)
			},
			
			/**
			 * Introduction 关闭模态框
			 * @author 刘莉
			 * @since 1.0
			 */
			handleCancel () {
				this.isShowAddCourse = false;
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
		padding: 15px;

		.content-box{
			position: relative;
			width: 100%;
			height: 100%;
			background-color: white;

			.btn-form{
				display: flex;
				justify-content: flex-start;
				position: relative;
				width: 100%;
				padding: 10px;

				button{
					margin-right: 15px;
				}

				.uploadContainer{
					display: inline-block; 
					position: relative; 
				}
			}
		}
	}
</style>
<template>
	<div class="tableListContainer" v-if="currentUser[0].role === '2'">
		<a-spin :spinning="tableListSpinning">
			<div class="title">
				<div class="divider"></div>
				<h3>{{title}}</h3>
			</div>
			<div class="course-table-box">
				<a-table :columns="columns" :dataSource="dataSource" bordered :pagination="Pagination" @change="handleTableChange">
					<template
						v-for="col in colData"
						:slot="col"
						slot-scope="text, record, index">
						<div :key="col">
							<a-input
								v-if="record.editable"
								style="margin: -5px 0"
								:value="text"
								@change="e => handleChange(e.target.value, record.key, col)"/>
							<template v-else>{{text}}</template>
						</div>
					</template>
					<template slot="operation" slot-scope="text, record, index">
						<div class="editable-row-operations">
							<span v-if="record.editable">
								<a-button size="small" type="primary" @click="() => save(index)">保存</a-button>
								<a-popconfirm title="确认取消?" @confirm="() => cancel(index)">
									<a-button size="small">取消</a-button>
								</a-popconfirm>
							</span>
							<span v-else>
								<a-button size="small" type="primary" @click="() => edit(index)">编辑</a-button>
								<a-popconfirm title="确认删除?" @confirm="() => deleteRow(index)">
									<a-button size="small">删除</a-button>
								</a-popconfirm>
								
							</span>
						</div>
					</template>
				</a-table>
			</div>
		</a-spin>
	</div>
</template>
<script>
	import config from '@/api/config.js'
	import { mapGetters, mapActions } from 'vuex'
	export default {
		name: 'TableList',
		props: [
			'title',
			'com',
			'isSuccess'
		],
		data(){
			return {
				columns: [],
				courseColumns: [			// 课程列表的列数
					{
						title: '课程编号',
						dataIndex: 'courseId',
						width: '25%',
						scopedSlots: { customRender: 'courseId' },
					},
					{
						title: '课程名称',
						dataIndex: 'courseName',
						width: '29%',
						scopedSlots: { customRender: 'courseName' },
					},
					{
						title: '学分',
						dataIndex: 'courseCredit',
						width: '8%',
						scopedSlots: { customRender: 'courseCredit' },
					},
					{
						title: '学期',
						dataIndex: 'courseTerm',
						width: '8%',
						scopedSlots: { customRender: 'courseTerm' },
					},
					{
						title: '平均分',
						dataIndex: 'courseAverage',
						width: '8%',
						scopedSlots: { customRender: 'courseAverage' },
					},
					{
						title: '总分制',
						dataIndex: 'courseTotalGrade',
						width: '8%',
						scopedSlots: { customRender: 'courseTotalGrade' },
					},
					{
						title: '操作',
						dataIndex: 'operation',
						width: '14%',
						scopedSlots: { customRender: 'operation' },
					},
				],			
				studentColumns: [
					{
						title: '学号',
						dataIndex: 'stuId',
						width: '25%',
					},
					{
						title: '姓名',
						dataIndex: 'stuName',
						width: '25%',
						scopedSlots: { customRender: 'stuName' },
					},
					{
						title: '性别',
						dataIndex: 'stuMale',
						width: '10%',
						scopedSlots: { customRender: 'stuMale' },
					},
					{
						title: '操作',
						dataIndex: 'operation',
						width: '15%',
						scopedSlots: { customRender: 'operation' },
					},
					
				],
				dataSource: [],			// 数据源
				columnData: [],			// 组
				oldTempRowData: {},		// 原行数据
				Pagination: {current: 1, total: 0, pageSize: 10, pageNum: 1, pages: 0},			// 分页信息
				tableListSpinning: false,	// table列表loading
				colData: [],
				currentRowData: {},			// 当前列表修改值
			}
		},
		computed:{
			...mapGetters({
				currentUser: 'currentUser',			// 当前登录用户信息
				detailCurrentComponent: 'publicData/detailCurrentComponent',	// 当前详情加载的组件
				courseList: 'course/courseList',		// 课程列表
				studentList: 'student/studentList',		// 课程列表信息
			})
		},
		watch: {
			detailCurrentComponent(New, Old){
				if (New) {
					this.Pagination = {current: 1, total: 0, pageSize: 10, pageNum: 1, pages: 0}
					if(this.com === 'CourseDetail'){
						this.getCourseInfo(config.GET_ALL_COURSE_LIST)
						this.columns = this.courseColumns
					} else if (this.com === 'StudentGrade') {
						this.getCourseInfo(config.GET_ALL_STUDENT_LIST)
						this.columns = this.studentColumns
					}
				}
			},
			isSuccess(New, Old) {
				if(this.com === 'CourseDetail'){
					this.getCourseInfo(config.GET_ALL_COURSE_LIST)
					this.columns = this.courseColumns
					this.colData = ['courseName', 'courseCredit', 'courseTerm', 'courseAverage', 'courseTotalGrade']
				} else if (this.com === 'StudentGrade') {
					this.getCourseInfo(config.GET_ALL_STUDENT_LIST)
					this.columns = this.studentColumns
					this.colData = ['stuId', 'stuName', 'stuMale']
				}
			}
		},
		mounted(){
			// 获取列表数据
			if(this.com === 'CourseDetail'){
				this.getCourseInfo(config.GET_ALL_COURSE_LIST)
				this.columns = this.courseColumns
				this.colData = ['courseName', 'courseCredit', 'courseTerm', 'courseAverage', 'courseTotalGrade']
			} else if (this.com === 'StudentGrade') {
				this.getCourseInfo(config.GET_ALL_STUDENT_LIST)
				this.columns = this.studentColumns
				this.colData = ['stuId', 'stuName', 'stuMale']
			}
		},
		methods: {
			...mapActions({
				setStudentList: 'student/setStudentList',			// 设置学生列表
				setCourseList: 'course/setCourseList',				// 设置课程列表
			}),
			// 获取列表数据
			getCourseInfo(url){
				let self = this
				// 开启loading
				self.tableListSpinning = true;

				let restData = {
					"pageNum": self.Pagination.current,
					"pageSize": self.Pagination.pageSize
				}
				
				self.axios.post(url, restData).then(response =>{
					
					// 查询成功
					if (response.data.code === '200'){
						// 有数据
						if (response.data.data.total > 0){
							// 分页信息
							const Pagination = {...self.Pagination}
							// 总数
							Pagination.total = parseInt(response.data.data.total)
							Pagination.pages = response.data.data.pages
							self.Pagination = Pagination
							self.dataSource = response.data.data.list
						}
					}
					// 关闭loading
					self.tableListSpinning = false
				})
			},

			// 
			handleTableChange(pagination){
				this.Pagination = {...pagination}
				if(this.com === 'CourseDetail'){
					this.getCourseInfo(config.GET_ALL_COURSE_LIST)
				} else if (this.com === 'StudentGrade') {
					this.getCourseInfo(config.GET_ALL_STUDENT_LIST)
				}
			},
			// 上传模板文件，显示列表数据
			getCourseList(){
				// 非空对象
				let responseData = this.reponseData
				if (JSON.stringify(responseData) !== '{}') {
					if (responseData.data.length !== 0) {
						// 设置数据源
						for (let i = 0; i < responseData.data.length; i++){
							let obj = {}
							obj[ 'courseId' ] = responseData.data[i].courseId
							obj[ 'courseName' ] = responseData.data[i].courseName
							obj[ 'courseCredit' ] = responseData.data[i].courseCredit
							obj[ 'courseTerm' ] = responseData.data[i].courseTerm
							obj[ 'courseAverage' ] = responseData.data[i].courseAverage
							obj[ 'courseTotalGrade' ] = responseData.data[i].courseTotalGrade
							obj[ 'key' ] = i
							this.dataSource.push(obj)
						}
					}
				}
			},

			// 处理输入框事件更改事件
			handleChange(value, key, column) {
				
				const newData = [...this.dataSource];
				const target = newData.filter(item => key === item.key)[0];
				// 1. 设置当前值
				this.currentRowData = target
				if (target) {
					target[column] = value;
					this.dataSource = newData;
				}
			},
			// 点击编辑按钮事件
			edit(index) {
				// 编辑时 -> 存储未更改数据，为取消事件返回原数据
				this.oldTempRowData = {...this.dataSource[index]}
				const newData = [...this.dataSource];
				const target = newData.filter((item, i) => index === i);
				// 设置该行可编辑
				if (target) {
					target[0].editable = true;
					this.dataSource = newData;
				}
			},

			// 编辑后的保存事件
			save(index) {
				const newData = [...this.dataSource];
				// 保存后，编辑该行的数据清除
				this.oldTempRowData = {}
				const target = newData.filter((item,i) => index === i);
				if (target) {
					this.updateData()
					delete target[0].editable;
					this.dataSource = newData;
				}
			},

			// 更新数据
			updateData(){
				let self = this
				let restData
				if (this.com === 'CourseDetail') {
					// restDate = {
					// 	courseId: 
					// 	courseName: 
						
					// }
				}
				else if (this.com === 'StudentGrade'){
					restData = {
						stuId: this.currentRowData.stuId,
						stuName: this.currentRowData.stuName,
						stuMale: this.currentRowData.stuMale
					}
					self.axios.post(config.UPDATE_STUDENT, restData).then(response => {
						if (response.data.code === '200') {
							this.$message.success(response.data.msg)
						} else {
							this.$message.error(response.data.msg)
						}
						// 开启loading
					}) 
				}
				this.tableListSpinning = false
			},
			// 编辑后取消修改事件
			cancel(index) {
				const newData = [...this.dataSource];
				const target = newData.filter((item,i) => index === i);
				if (target) {
					newData[index] = this.oldTempRowData
					delete target[0].editable;
					this.dataSource = newData;
				}
			},

			deleteRow(index){
				let newData = [...this.dataSource]
				let target = newData.filter((item,i) => index === i)
				if (target) {
					// 变换状态
					delete target.editable
					newData.splice(index, 1)
					this.dataSource = newData;
				}
			},

		
			
		}
	}
</script>
<style lang="scss" scoped>
	.tableListContainer{
		position: relative;
		width: 100%;
		box-sizing: border-box;
		-webkit-box-sizing: border-box;
		-moz-box-sizing: border-box;
		padding: 0 0px 10px;

		.course-table-box{
			background-color: white;
		}
		
		.divider{
			margin-left: 0px;
		}
	}
</style>
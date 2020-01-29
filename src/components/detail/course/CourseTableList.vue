<template>
	<div class="tableListContainer" v-if="columns.length > 0 && dataSource.length > 0 && currentUser[0].role === '2'">
		<div class="title">
			<div class="divider"></div>
			<h3>{{title}}</h3>
		</div>
		<Table  :columns="columns" :data="dataSource" border stripe>
			<!-- 课程ID -->
			<template slot-scope="{ row, index }" slot="courseId">
				<Input type="text" v-model="editCourseId" v-if="editIndex === index" readonly/>
				<span v-else>{{ row.courseId }}</span>
			</template>
			<!-- 课程名称 -->
			<template slot-scope="{ row, index }" slot="courseName">
				<Input type="text" v-model="editCourseName" v-if="editIndex === index" />
				<span v-else>{{ row.courseName }}</span>
			</template>
			<!-- 课程学期 -->
			<template slot-scope="{ row, index }" slot="courseTerm">
				<Input type="text" v-model="editCourseTerm" v-if="editIndex === index" />
				<span v-else>{{ row.courseTerm }}</span>
			</template>
			<!-- 课程学分 -->
			<template slot-scope="{ row, index }" slot="courseCredit">
				<Input type="text" v-model="editCourseCredit" v-if="editIndex === index" />
				<span v-else>{{ row.courseCredit }}</span>
			</template>
			<!-- 课程平均分 -->
			<template slot-scope="{ row, index }" slot="courseAverage">
				<Input type="text" v-model="editCourseAverage" v-if="editIndex === index" />
				<span v-else>{{ row.courseAverage }}</span>
			</template>
			<!-- 课程总分制 -->
			<template slot-scope="{ row, index }" slot="courseTotalGrade">
				<Input type="text" v-model="editCourseTotalGrade" v-if="editIndex === index" />
				<span v-else>{{ row.courseTotalGrade }}</span>
			</template>
			<template slot-scope="{ row, index }" slot="action">
				<div v-if="editIndex === index">
					<Button @click="handleSave(index)">保存</Button>
					<Button @click="editIndex = -1">取消</Button>
					
				</div>
				<div v-else>
					<Button @click="handleEdit(row, index)" type="primary">操作</Button>
					<Poptip
						confirm
						title="确认删除？"
						@on-ok="handleCancle(row, index)"
						>
						<Button >删除</Button>
					</Poptip>
				</div>
			</template>
		</Table >
	</div>
</template>
<script>
	import config from '@/api/config.js'
import { mapGetters } from 'vuex';
	export default {
		name: 'CourseTableList',
		props: [
			'columns',
			'dataSource',
			'title'
		],
		data(){
			return {
				editIndex: -1,  				// 当前聚焦的输入框的行数
				editCourseId: '',				// 第一列输入框输入内容
				editCourseName: '',				// 第二列输入框输入内容
				editCourseTerm: '',				// 第三列输入框输入内容
				editCourseCredit: '',			// 第四列输入框输入内容
				editCourseAverage: '',			// 第五列输入框输入内容
				editCourseTotalGrade:'',		// 第六列输入框输入内容
			}
		},
		computed:{
			...mapGetters({
				currentUser: 'currentUser',			// 当前登录用户信息
			})
		},
		methods: {
			// 编辑操作
			 handleEdit (row, index) {
				this.editCourseId = row.courseId;
				this.editCourseName = row.courseName;
				this.editCourseTerm = row.courseTerm;
				this.editCourseCredit = row.courseCredit;
				this.editCourseAverage = row.courseAverage;
				this.editCourseTotalGrade = row.courseTotalGrade;
				this.editIndex = index;
			},
			// 保存操作
			handleSave (index) {
				// 开启loading
				this.$emit('tableLoading', true);
				let restData = {
					courseId: this.editCourseId,
					courseName: this.editCourseName,
					courseCredit: this.editCourseCredit,
					courseTerm: this.editCourseTerm,
					courseAverage: this.editCourseAverage,
					courseTotalGrade: this.editCourseTotalGrade
				}
				let self = this
				self.axios.post(config.UPDATE_COURSE_INFO, restData).then(response =>{
					// 修改成功
					if (response.data.code === '200'){
						self.$message.success(response.data.msg)
						// 更新
						this.dataSource[index].courseId = this.editCourseId;
						this.dataSource[index].courseName = this.editCourseName;
						this.dataSource[index].courseCredit = this.editCourseCredit;
						this.dataSource[index].courseTerm =  this.editCourseTerm;
						this.dataSource[index].courseAverage = this.editCourseAverage;
						this.dataSource[index].courseTotalGrade = this.editCourseTotalGrade;
						this.editIndex = -1;
					}else {
						self.$message.error('保存失败')
					}
					// 关闭loading
					this.$emit('tableLoading', false);
					
				})
			},

			// 删除该条行信息
			handleCancle(row, index){
				// 开启loading
				this.$emit('tableLoading', true);
				let restData = {
					courseId: row.courseId,
					courseName: row.courseName,
					courseCredit: row.courseCredit,
					courseTerm: row.courseTerm,
					courseAverage: row.courseAverage,
					courseTotalGrade: row.courseTotalGrade
				}
				let self = this
				self.axios.post(config.DELETE_COURSE_INFO, restData).then(response =>{
					// 修改成功
					if (response.data.code === '200'){
						self.$message.success(response.data.msg)
						// 更新数据
						this.dataSource.splice(index, 1)
					}else {
						self.$message.error('删除失败')
					}
					// 关闭loading
					this.$emit('tableLoading', false);
				})
			}
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
		padding: 0 10px 10px 10px;
		
		.divider{
			margin-left: 0px;
		}
	}
</style>
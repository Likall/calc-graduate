<template>
	<div class="tableListContainer" v-if="currentUser[0].role === '2'">
		<div class="title">
			<div class="divider"></div>
			<h3>{{title}}</h3>
		</div>
		<div class="course-table-box">
			<a-table :columns="columns" :dataSource="dataSource" bordered>
				<template
					v-for="col in ['courseId', 'courseName', 'courseCredit', 'courseTerm', 'courseAverage', 'courseTotalGrade']"
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
	</div>
</template>
<script>
	import config from '@/api/config.js'
import { mapGetters } from 'vuex';
	export default {
		name: 'CourseTableList',
		props: [
			'title',
			'reponseData'
		],
		data(){
			return {
				columns: [			// 表的列数
					{
						title: '课程号',
						dataIndex: 'courseId',
						width: '25%',
						scopedSlots: { customRender: 'courseId' },
					},
					{
						title: '课程名',
						dataIndex: 'courseName',
						width: '31%',
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
						width: '12%',
						scopedSlots: { customRender: 'operation' },
					},
				],			
				dataSource: [],			// 数据源
				columnData: [],			// 组
				oldTempRowData: {},		// 原行数据
			}
		},
		computed:{
			...mapGetters({
				currentUser: 'currentUser',			// 当前登录用户信息
			})
		},
		mounted(){
			this.getCourseList()
		},
		methods: {
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
				if (target) {
					target[column] = value;
					this.dataSource = newData;
				}
			},
			// 点击编辑按钮事件
			edit(index) {
				// 编辑时 -> 存储未更改数据，为取消事件返回原数据
				this.oldTempRowData = this.dataSource[index]
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
					delete target[0].editable;
					this.dataSource = newData;
				}
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
		padding: 0 0px 10px;

		.course-table-box{
			background-color: white;
		}
		
		.divider{
			margin-left: 0px;
		}
	}
</style>
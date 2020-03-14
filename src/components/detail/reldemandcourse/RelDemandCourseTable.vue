<template>
	<div class="tableListContainer" v-if="currentUser[0].role === '2'" >
		<a-spin :spinning="spinning">
		<div class="title">
			<div class="divider"></div>
			<h3>权重值</h3>
		</div>
		<div class="tableBox">
			<a-table 
			:columns="columnsData" 
			:dataSource="dataSource" 
			bordered 
			:pagination="Pagination"
			:scroll="{ x: scollWidth, y: 280 }"
			:rowKey="record => record.key"
			:rowClassName="(record, index) => { if(index % 10 === 0) return 'dark-row'}"
			size="middle">
				<template v-for="col in colData" :slot="col" slot-scope="text, record, index">
					<div :key="col">
						<a-input
							v-if="record.editable"
							style="margin: -5px 0"
							:value="text"
							@change="e => handleChange(e.target.value, record.key, col, index)"
						/>
						<template v-else>{{text}}</template>
					</div>
				</template>
				<template slot="operat" slot-scope="text, record, index">
					<div class="editable-row-operations">
						<span v-if="record.editable">
							<a-button size="small" type="primary" @click="() => save(index)">保存</a-button>
							<a-popconfirm title="确认取消?" @confirm="() => cancel(index)">
								<a-button size="small">取消</a-button>
							</a-popconfirm>
						</span>
						<span v-else>
							<a-button size="small" type="primary" @click="() => edit(index)">编辑</a-button>
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
	import tools from '@/public/tools/tools'
	export default {
		name: 'RelDemandCourseTable',
		data() {
			return {
				demandData: [],				// 毕业要求指标点列表
				dataSource: [				// 数据源
					{'course':'课程名称'}
				],				
				columnsData: [				// 列数据
					{
						title: '',
						dataIndex: 'course',
						key: 'course',
						fixed: 'left',
						width: 200
					}
				],
				colData: [],				// col 值
				Pagination: {current: 1, total: 0, pageSize: 1000, pageNum: 1, pages: 0},			// 分页信息
				scollWidth: '',
				spinning:false,
				currentDemandList:[],			// 当前修改的指标点对应的课程权重值
				currentEditValue: 0,			// 当前修改的值
				currentEditCourseId: '',		// 当前修改的课程ID
				currentEditDemand2ID: '',		// 当前修改的指标点ID
			}
		},
		mounted() {
			// 1.初始化毕业要求列表
			this.checkHasLoadDemandInfo()
			
		},
		computed:{
			...mapGetters({
				currentUser: 'currentUser',				// 当前登录用户信息
				detailCurrentComponent: 'publicData/detailCurrentComponent',	// 当前详情加载的组件\
				demandList: 'demand/demandList',				// 毕业要求列表
				originDataSource: 'demand/originDataSource',	// 数据源
				courseList: 'course/courseList',				// 课程列表
				courseDemandList: 'course/courseDemandList',	// 课程指标点列表
			})
		},
		methods: {
			...mapActions({
				setDemandList: 'demand/setDemandList',		// 设置毕业要求列表
				setOriginDataSource: 'demand/setOriginDataSource', // 设置毕业要求数据源
				setCourseList: 'course/setCourseList',			// 设置课程列表
				setCourseDemandList: 'course/setCourseDemandList',	// 设置课程指标点列表
			}),

			/**
			* Introduction 判断是否已加载毕业要求列表
			* @author 刘莉
			* @since 1.0
			*/
			checkHasLoadDemandInfo(){
				this.spinning = true
				let exsist = tools.deepClone(this.demandList)
				if (exsist.length <= 0) {
					this.getDemandList()
				} else {
					this.setDemandColumnsData(exsist)
				}
			},

			/**
			* Introduction 判断是否已加载课程列表
			* @author 刘莉
			* @since 1.0
			*/
			checkHasLoadCourseInfo(){
				let exsist = tools.deepClone(this.courseList)
				if (exsist.length <= 0) {
					this.getCourseInfo()
				} else {
					this.setCourseDataSource(exsist)
				}
			},
			
			/**
			* Introduction 获得课程与指标点之间关系列表
			* @author 刘莉
			* @since 1.0
			*/
			getCourseDemandList() {
				let self = this
				self.axios.get(config.GET_COURSE_DEMAND_LIST).then(response => {
					if (response.data.code === '200') {
						// 有数据
						if (response.data.data.length > 0) {
							self.setCourseDemandList(response.data.data)
							self.setWeightDataSource(response.data.data)
						}
					}else {
						self.$message.error('查询失败')
                    	this.spinning = false
					}
				})
			},

			// 设置权重值数据源
			setWeightDataSource(data){
				// console.log(data)
				for (let i = 0; i < data.length; i++) {
					let dataItemArray = data[i]
					// 指标点下标
					let demandDataIndex = ''
					let demand2Id
					for (let m = 0; m <dataItemArray.length; m++) {
						let courseIndex = ''
						let courseId = dataItemArray[m].courseId
						demand2Id = dataItemArray[m].demand2Id
						// 查找课程下标
						for (let j = 0; j < this.dataSource.length; j++) {
							if (courseId === this.dataSource[j].key) {
								courseIndex = j
							}
						}
						// if (demandDataIndex == '') {
							// 查看columns下标
						for (let k = 0; k < this.columnsData.length; k++) {
							if (demand2Id === this.columnsData[k].key) {
								demandDataIndex = this.columnsData[k].dataIndex
							}
						}
						// }
						// 插入列表数据
						this.dataSource[courseIndex][demandDataIndex] = dataItemArray[m].weight
						
					}
				}
				this.spinning = false
				// 强制刷新页面
				this.$forceUpdate()
			},
				// 获取列表数据
			getCourseInfo(){
				let self = this
				let restData = {
					"pageNum": 0,
					"pageSize": 0,
				}
				
				self.axios.post(config.GET_ALL_COURSE_LIST, restData).then(response =>{
					// 查询成功
					if (response.data.code === '200'){
						// 有数据
						if (response.data.data.total > 0){
							// 设置课程列表
							let course = response.data.data.list
							self.setCourseList(course)
							self.setCourseDataSource(course)
						}
					}else {
						self.$message.error('查询失败')
                    	this.spinning = false
					}
				})
			},
			// 查询毕业要求列表
			getDemandList(){
				let self = this
				self.axios.get(config.GET_ALL_DEMAND2_LIST).then(response =>{
					if (response.data.code === '200'){
						// 有数据
						if (response.data.data.length > 0){
							let responseData = response.data.data
							//	设置毕业指标点数据源
							this.setDemandColumnsData(responseData)
						}
					} else {
						self.$message.error('查询失败')
                    	this.spinning = false
					}
				})
			},

			// 设置列数据 index 每个一级指标下的所有二级指标长度总和
			setColumnsData(index) {
				for (let i = 0; i < index; i++) {
					let name = 'demand'+i
					if (i == 0) {
						this.columnsData.push({
							title: '二级指标点',
							dataIndex: name,
							key: name,
							colSpan: index
						})
					} else {
						this.columnsData.push({
							title: '二级指标点',
							dataIndex: name,
							key: name,
							colSpan: 0
						})
					}
				}
			},

			// 设置毕业要求名称列数据
			setDemandColumnsData(responseData) {
				let self = this
				self.columnsData = []
				self.columnsData.push({
					title: '',
					dataIndex: 'course',
					key: 'course',
					fixed: 'left',
					width: 200
				})
				self.colData.push('course')
				// 设置毕业要求指标点与结果
				self.demandData = responseData;
				// 置空
				self.dataSource = []
				// 获取所有指标点长度
				let allDemand2Length = 0
				
				for (let i = 0; i < responseData.length; i++) {
					// 排序
					let sortNameArray = []
					let sortCalcArray = []
					for (let m = 0; m < responseData[i].demand2List.length; m++) {
						let splitData = responseData[i].demand2List[m].name
						sortNameArray.push(splitData)
					}
					// 设置二级指标点长度
					allDemand2Length += sortNameArray.length
					// 排序后的名称
					sortNameArray = sortNameArray.sort()
					let tempDemand2List = []
					// 设置排序后的毕业要求数据
					for (let n = 0; n < sortNameArray.length; n++) {
						let obj = {
							name: sortNameArray[n]
						}
						// 设置数据源对象
						let objOfDemand2 = {}
						for (let k = 0; k < responseData[i].demand2List.length; k++) {
							if (responseData[i].demand2List[k].name == sortNameArray[n]) {
								// 设置行数据源下标
								let indexes = allDemand2Length - (sortNameArray.length - n)
								objOfDemand2['dataIndex'] = responseData[i].demand2List[k].demand2Id
								objOfDemand2['title'] = sortNameArray[n]
								objOfDemand2['width'] = 200,
								objOfDemand2['key'] = responseData[i].demand2List[k].demand2Id
								objOfDemand2['scopedSlots'] = responseData[i].demand2List[k].demand2Id
								obj.demand2Id = responseData[i].demand2List[k].demand2Id
								self.columnsData.push({
									dataIndex: responseData[i].demand2List[k].demand2Id,
									title: sortNameArray[n],
									key: responseData[i].demand2List[k].demand2Id,
									scopedSlots: { customRender: responseData[i].demand2List[k].demand2Id},
									width: 200
								})
								self.colData.push(responseData[i].demand2List[k].demand2Id)
							}
							
						}
						tempDemand2List.push(obj)
					}
					
					self.scollWidth = allDemand2Length*200
					// 设置毕业要求列表
					self.demandData[i].demand2List = tempDemand2List
					self.setDemandList(self.demandData)
					
				}
				// 2. 初始化加载课程列表 
				this.checkHasLoadCourseInfo()
				self.columnsData.push({
					title: '操作',
					dataIndex: 'operat',
					scopedSlots: { customRender: 'operat' },
					width: 130,
					fixed: 'right'
				})
				
			},

			// 设置课程列表行数据
			setCourseDataSource(courseData) {
				for (let i = 0; i < courseData.length; i++) {
					this.dataSource.push({
						'course': courseData[i].courseName,
						'key': courseData[i].courseId
					})
				}
				this.getCourseDemandList()
			},

			/**
			* Introduction 处理输入框事件更改事件
			* @author 刘莉
			* @since 1.0
			* @param {value} 当前value值
			* @param {key} 课程ID
			* @param {columns} 修改的列ID
			*/
			// 
			handleChange(value, key, column, index) {
				// 设置当前修改的课程ID和指标点ID
				this.currentEditCourseId = key
				this.currentEditDemand2ID = column
				const newData = [...this.dataSource];
				const target = newData.filter(item => key === item.key)[0];
				this.getCurrentDemandCol(column)
				let totalValue = this.checkWeightIsOver(value, index, key)
				if (totalValue > 1) {
					this.$message.error("权重目标值和为1")
					this.currentEditValue = 0
				} else {
					this.currentEditValue = parseFloat(value)
					if (target) {
						target[column] = value;
						this.dataSource = newData;
					}
				}
				
			},

			// 获得当前二级指标点所有列表
			getCurrentDemandCol(demand2Id){
				for (let i = 0; i < this.courseDemandList.length; i++) {
					if (demand2Id === this.courseDemandList[i][0].demand2Id) {
						this.currentDemandList = this.courseDemandList[i]
						break
					}
				}
			},

			// 当更新输入框权重值需校验相加值是否>1
			checkWeightIsOver(value, index, key){
				let totalValue = parseFloat(value)
				for (let i = 0; i < this.currentDemandList.length; i++) {
					if (key === this.currentDemandList[i].courseId) {

					} else {
						totalValue+= parseFloat(this.currentDemandList[i].weight)
					}
				}
				
				return totalValue
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
				// 开启loading
				this.spinning = true
				const newData = [...this.dataSource];
				// 保存后，编辑该行的数据清除
				this.oldTempRowData = {}
				const target = newData.filter((item,i) => index === i);
				// 非0不可保存
				if (this.currentEditValue <= 0) {
					this.$message.error("权重要大于0")
				} else {
					if (target) {
						this.updateWeight(this.currentEditCourseId, this.currentEditDemand2ID, this.currentEditValue)
						delete target[0].editable;
						this.dataSource = newData;
					}
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
			},

			updateWeight(courseId, demand2Id, weight) {
				let restData = {
					courseId: courseId,
					demand2Id: demand2Id,
					weight: weight
				}
				let self = this
				self.axios.post(config.UPDATE_WEIGHT, restData).then(response => {
					if (response.data.code === '200') {
						// 更新列表值
						let list = tools.deepClone(self.courseDemandList)
						for (let i = 0; i < self.courseDemandList.length; i++) {
							for (let j = 0; j < self.courseDemandList[i].length; j++) {
								if (courseId === self.courseDemandList[i].courseId && demand2Id === self.courseDemandList[i].demand2Id) {
									list[i][j].weight = String(self.currentEditValue)
								}

							}
						}
						this.$message.success(response.data.msg)
					} else {
						this.$message.error(response.data.msg)
					}
					// 开启loading
					this.spinning = false
				})
			},

			// 更新vuex权重值
			updateVuexCourseDemandList() {

			}
		}
	}
</script>
<style lang="scss" scoped>
	.tableListContainer {
		width: 100%;
		height: 100%;
		background-color: #ffffff;

		/deep/ .dark-row {
			background-color: #CEEFFF !important;
		}

		/deep/ td {
			font-weight: bold !important;
		}
	}
</style>

<template>
	<!-- 学生成绩分析 -->
	<div class="studentAnalysisContainer">
		<div class="content-wrap">
			<!-- 分数段排序 -->
			<a-spin :spinning="gradeSectionSpin">
				<div class="grade-section-box">
					<span class="select-title">课程切换：</span>
					<a-select :value="selectCourseValue" @change="handleCourseChange">
						<a-select-option v-for="(item, index) in courseData" :key="index" :value="item.courseName">{{item.courseName}}</a-select-option>
					</a-select>
					<div id="echarts1">
					</div>
				</div>
			</a-spin>
			<!-- 课程平均分与该门学生课程对比 -->
			<div class="grade-compare-stu-box">
				<span class="select-title">学生：</span>
				<a-select
					mode="multiple"
					size="default"
					@change="handleUserChange"
					@select="handleUserSelect">
					<a-select-option v-for="(item, index) in userData" :key="index" :value="index">{{item.stuId}}{{item.stuName}}</a-select-option>
				</a-select>
				<div id="echarts2">
				</div>
			</div>
			<!-- 每门课程达到平均分的人数 -->
			<div class="over-avg-box">
				<div id="echarts4"></div>
			</div>
		</div>
	</div>
</template>
<script>
	import config from '@/api/config.js' 
	import { mapGetters, mapActions } from 'vuex'
	import tools from '@/public/tools/tools'
	export default {
		name: 'StudentAnalysis',
		props: 
		[
			'detailCurrentComponent'
		],
		data() {
			return {
				courseData: [],			// 课程信息列表
				selectCourseValue: '',	// 选中的课程值
				courseDataAxis: ['85以上', '75-85', '65-75', '60-65', '<60'],	// 学生成绩分段x轴
				courseChartsData: [],	// 课程柱状图数据
				gradeSectionSpin: true,	// 课程成绩分段loading

				selelctCourseAverage:'', // 课程平均分选中的课程
				courseAverageDataAxis: [], // 所有课程的横坐标
				courseAverageChartsData: [], // 课程平均分
				courseAvgComLegend: [],		 // 课程
				courseSectionSpin: true, // 统计每门课达到课程平均分的人数
				courseGradeData: [],	// 学生课程信息
				studentChartsData: [],   // 学生信息
				selecUserValue: [],	// 选中的学生
				userData: [],   // 可选择的学生
				selectUserName: [],	// 选中的学生姓名
				selectUserId: [], // 选中的学生ID
				dropIndex: [],	 // 选中的index
				// 达到课程平均分的人数
				overAvgStuChartsData: [],
				// 平均分数据
				overAvgChartsData: [],
				// 达到课程平均分人数横坐标
				overAvgStuDataAxis: []
			}
		},
		mounted() {
			this.getCourseList()
			this.getStudentList()
			this.getOverAvgStuInfo()
		},
		computed:{
			...mapGetters({
				courseList: 'course/courseList',			// 课程列表
				courseGradeSection: 'course/courseGradeSection',		// 课程分段
				studentGradeList: 'student/studentGradeList',		// 学生课程成绩
				studentList: 'student/studentList',			// 学生信息
				courseAverage: 'course/courseAverage',		//课程平均分
				courseName: 'course/courseName',			// 课程名称
				overAvgStuInfo: 'course/overAvgStuInfo',	// 达到课程平均分的人数
			})
		},
		methods: {
			...mapActions({
				setCourseList: 'course/setCourseList',			// 设置课程列表
				setCourseGradeSection: 'course/setCourseGradeSection',		// 设置课程分
				setStudentGradeList: 'student/setStudentGradeList',		// 设置学生课程成绩
				setStudentList: 'student/setStudentList',		// 设置学生信息
				setCourseAverage: 'course/setCourseAverage',	// 设置课程平均分
				setCourseName: 'course/setCourseName',			// 设置课程名称
				setOverAvgStuInfo: 'course/setOverAvgStuInfo',	// 设置达到课程平均分的人数
			}),
			// 获取成绩分段
			getGradeSection() {
				let self = this
				// 置为空
				self.courseChartsData = []
				// 获取下拉列表选中的值
				let courseId = self.getCourseId(self.selectCourseValue, self.courseData)
				self.axios.post(config.GET_GRADE_SECTION + '/' + courseId).then(response => {
					// 查询成功
					if (response.data.code === '200'){
						if (response.data.data.length > 0) {
							self.courseChartsData.push(response.data.data[0].grade1)
							self.courseChartsData.push(response.data.data[0].grade2)
							self.courseChartsData.push(response.data.data[0].grade3)
							self.courseChartsData.push(response.data.data[0].grade4)
							self.courseChartsData.push(response.data.data[0].grade5)
							// 画图
							self.drawGradeSection()
						}
					}
					// 关闭loading
					self.gradeSectionSpin = false
				})
			},
			// 获取该生的所有课程信息
			getStudentGradeList(stuName, stuId) {
				let self = this
				let restData = {
					stuName: stuName,
					stuId: stuId
				}
				self.axios.post(config.GET_GRADE_LIST, restData).then(response => {
					if (response.data.code === '200') {
						if (response.data.data.length > 0) {
							let responseData = response.data.data
							let tempStudent = []
							self.courseAverageChartsData = []
							self.courseAverageDataAxis = []
							for (let i = 0; i <responseData.length; i++) {
									self.courseAverageChartsData.push(responseData[i].courseAverage)
									self.courseAverageDataAxis.push(responseData[i].courseName)
									tempStudent.push(responseData[i].courseGrade)
							}
							// 设置课程平均分和课程名称
							if (self.courseAverage.length !== responseData.length) {
								self.courseAvgComLegend = []
								self.studentChartsData = []
								self.setCourseAverage(self.courseAverageChartsData)
								let avgObj = {
									'name': '平均分',
									'id': '001',
									'type': 'line',
									'data': self.courseAverage
								}
								self.courseAvgComLegend.push('平均分')
								self.studentChartsData.push(avgObj)
							}
							if (self.courseName.length !== responseData.length) {
								self.setCourseName(self.courseAverageDataAxis)
							}
							// 设置学生折线图数据
							let obj = {}
							obj['name'] = responseData[0].stuName
							obj['id'] = responseData[0].stuId
							obj['type'] = 'line'
							obj['data'] = tempStudent
							if (self.studentChartsData.length > 0) {
								let exsist = self.studentChartsData.filter(item => {
									return responseData[0].stuId == item.id
								})
								// 不存在
								if (exsist.length == 0) {
									self.studentChartsData.push(obj)
									self.courseAvgComLegend.push(responseData[0].stuName)
								}
							} else {
								self.courseAvgComLegend.push(responseData[0].stuName)
								self.studentChartsData.push(obj)
							}
						}
						self.drawAvgToStuCom()
					}
				})
			},

			// 获取学生信息
			getStudentList() {
				let self = this
				let restData = {
					"pageNum": 0,
					"pageSize": 0
				}
				let tempStudentArray = tools.deepClone(self.studentList)
				// 无数据
				if(tempStudentArray.length == 0){
					self.axios.post(config.GET_ALL_STUDENT_LIST, restData).then(response =>{
						// 查询成功
						if (response.data.code === '200'){
							// 有数据
							if (response.data.data.total > 0){
								// 设置选中的值
								// self.selectUserName.push(response.data.data.list[0].stuName)
								// self.selectUserId.push(response.data.data.list[0].stuId)
								// let str = response.data.data.list[0].stuId + response.data.data.list[0].stuName 
								// self.selecUserValue.push(str)
								self.setStudentList(response.data.data.list)
								self.userData = response.data.data.list
							}
						}
					})
				}
				// 有数据
				else {
					// self.selectUserName.push(tempStudentArray[0].stuName)
					// self.selectUserId.push(tempStudentArray[0].stuId)
					// let str = tempStudentArray[0].stuId + tempStudentArray[0].stuName
					// self.selecUserValue.push(str)
					self.userData = tempStudentArray
				}
			},
			/**
			* Introduction 下拉列表切换获取课程id
			* @author 刘莉
			* @since 1.0
			* @param {selectValue} 下拉框选中值
			* @param {array}		课程数据 
			*/
			getCourseId(selectValue, array){
				for (let i = 0; i < array.length; i++){
					if(selectValue === array[i].courseName) {
						return array[i].courseId
					}
				}
			},

			// 获取课程列表
			getCourseList() {
				let self = this
				let restData = {
					"pageNum": 0,
					"pageSize": 0
				}
				let tempCourseArray = tools.deepClone(self.courseList)
				// 没值
				if (tempCourseArray.length == 0) {
					self.axios.post(config.GET_ALL_COURSE_LIST, restData).then(response =>{
						// 查询成功
						if (response.data.code === '200'){
							// 有数据
							if (response.data.data.total > 0){
								self.courseData = response.data.data.list
								// 默认设置选中的课程信息为第一个
								self.selectCourseValue = response.data.data.list[0].courseName
								self.setCourseList(self.courseData)
								// 设置课程平均分柱状图横坐标
								self.getGradeSection()
							}
						}
					})
				}
				// 有数据
				else {
					self.courseData = tempCourseArray;
					// 默认设置选中的课程信息为第一个
					self.selectCourseValue = tempCourseArray[0].courseName
					self.getGradeSection()
				}
				
			},

			// 获取达到课程平均分的人数
			getOverAvgStuInfo(){
				let self = this
				self.overAvgStuChartsData = []
				self.overAvgChartsData = []
				self.overAvgStuDataAxis = []
				let tempOverStuInfo = tools.deepClone(self.overAvgStuInfo)
				if (tempOverStuInfo.length == 0) {
					self.axios.get(config.GET_OVER_AVG_STU_INFO).then(response => {
						if (response.data.code == '200') {
							if (response.data.data.length > 0) {
								let responseData = response.data.data
								self.setOverAvgStuInfo(responseData)
								for (let i = 0; i < responseData.length; i++) {
									self.overAvgStuChartsData.push(responseData[i].overAvgCount)
									self.overAvgChartsData.push(responseData[i].courseAverage)
									self.overAvgStuDataAxis.push(responseData[i].courseName)
									// 设置课程平均分对比
									self.courseAverageDataAxis.push(responseData[i].courseName)
								}
								let avgObj = {
									'name': '平均分',
									'id': '001',
									'type': 'line',
									'data': self.overAvgChartsData
								}
								self.courseAvgComLegend.push('平均分')
								self.studentChartsData.push(avgObj)
								self.drawAvgToStuCom()
								self.drawOverAvgStu()
							}
						}
					})
				} else {
					for (let i = 0; i < tempOverStuInfo.length; i++) {
						self.overAvgStuChartsData.push(tempOverStuInfo[i].overAvgCount)
						self.overAvgChartsData.push(tempOverStuInfo[i].courseAverage)
						self.overAvgStuDataAxis.push(tempOverStuInfo[i].courseName)
					}
					let avgObj = {
						'name': '平均分',
						'id': '001',
						'type': 'line',
						'data': self.overAvgChartsData
					}
					self.courseAvgComLegend.push('平均分')
					self.studentChartsData.push(avgObj)
					self.drawAvgToStuCom()
					self.drawOverAvgStu()
				}
				
			},
			// 设置课程平均分柱状图横坐标
			setCourseAvgAxis(array){
				for (let i = 0; i < array.length; i++){
					this.courseAverageDataAxis.push(array[i].courseName)
					this.courseAverageChartsData.push(array[i].courseAverage)
				}
			},
			// 画图 -> 课程平均分柱状图
			// 画图 -> 每门课程达到平均分的人数
			drawOverAvgStu(){
				// echarts 容器
				let overAvgStuEcharts =  this.$echarts.init(document.getElementById('echarts4'))
				overAvgStuEcharts.setOption({
					color: ['#006699', '#4cabce'],
					title: {
						text: '达到平均分的人数',
						left: '10%',
					},
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							type: 'shadow'
						}
					},
					toolbox: {
						feature: {
							saveAsImage: {},
							
						},
						right: '10%'
					},
					legend: {
						data: ['平均分', '人数'],
						right: '20%'
					},
					grid: {
						left: '1%',
						top: '10%',
						containLabel: true
					},
					dataZoom : [
						{  
							type: 'slider',//图表下方的伸缩条
							show : true,  //是否显示
							realtime : true,  //
							start : 0,  //伸缩条开始位置（1-100），可以随时更改
							end : 15  //伸缩条结束位置（1-100），可以随时更改
						},
						{  
							type: 'inside',  //鼠标滚轮
							realtime : true,  
						},
					],
					xAxis: [
						{
							type: 'category',
							axisTick: {show: false},
							data: this.overAvgStuDataAxis,
							axisLabel:{interval: 0}
						}
					],
					yAxis: [
						{
							type: 'value'
						}
					],
					series: [
						{
							name: '平均分',
							type: 'bar',
							barGap: 0,
							data: this.overAvgChartsData
						},
						{
							name: '人数',
							type: 'bar',
							data: this.overAvgStuChartsData
						}
					]
				})
			},
			// 画图 -> 课程的平均分与某位学生成绩对比
			drawAvgToStuCom() {
				// echarts 容器
				let avgComEcharts =  this.$echarts.init(document.getElementById('echarts2'))
				// 清空画布
				avgComEcharts.clear()
				avgComEcharts.setOption({
					title: {
						text: '平均分与学生对比',
						left: '10%',
					},
					toolbox: {
						feature: {
							saveAsImage: {},
						},
						right: '10%'
					},
					dataZoom : [
						{  
							type: 'slider',//图表下方的伸缩条
							show : true,  //是否显示
							realtime : true,  //
							start : 0,  //伸缩条开始位置（1-100），可以随时更改
							end : 15  //伸缩条结束位置（1-100），可以随时更改
						},
						{  
							type: 'inside',  //鼠标滚轮
							realtime : true,  
						},
					],
					tooltip: {
						trigger: 'axis'
					},
					grid: {
						left: '40px',
					},
					legend: {
						data: this.courseAvgComLegend,
						left: '30%',
						right: '15%'
					},
					xAxis: {
						type: 'category',
						boundaryGap: false,
						data: this.courseAverageDataAxis,
						axisLabel:{interval: 0}
					},
					 yAxis: {
						type: 'value'
					},
					series: this.studentChartsData
				})
				console.log(avgComEcharts)
			},
			// 画图 -> 成绩分段柱状图
			drawGradeSection(){
				// echarts 容器
				let gradeSectionEcharts =  this.$echarts.init(document.getElementById('echarts1'))
				// 设置柱状图数据
				gradeSectionEcharts.setOption({
					color: ['#3398DB'],
					title: {
						text: this.selectCourseValue+'成绩阶段人数',
						left: 'center',
					},
					tooltip: {
						trigger: 'axis',
						axisPointer: {            // 坐标轴指示器，坐标轴触发有效
							type: 'line'        // 默认为直线，可选为：'line' | 'shadow'
						}
					},
					toolbox: {
						feature: {
							saveAsImage: {},
						},
					},
					grid: {
						left: '3%',
						right: '4%',
						bottom: '3%',
						containLabel: true
					},
					xAxis: [
						{
							type: 'category',
							data: this.courseDataAxis,
							axisTick: {
								alignWithLabel: true
							}
						}
					],
					yAxis: [
						{
							type: 'value'
						}
					],
					series: [
						{
							name: '人数',
							type: 'bar',
							barWidth: '60%',
							data: this.courseChartsData
						}
					]
				})

			},

			/**
			* Introduction 课程名称下拉框改变
			* @author 刘莉
			* @since 1.0
			* @param {value} 下拉框选中值
			*/
			handleCourseChange(value) {
				// 开启loading
				self.gradeSectionSpin = true
				this.selectCourseValue = value
				this.getGradeSection()
			},

			/**
			* Introduction 学生下拉框删除
			* @author 刘莉
			* @since 1.0
			* @param {value} 下拉框选中值
			*/
			handleUserChange(value, option) {
				let flag = false
				// value 长度 等于 selectName证明是新加
				if (value.length === this.selectUserName.length) {

				} else {
					for(let i = 0; i < value.length; i++) {
						if(value[ i ] != this.dropIndex[i])
						{
							let indexOfDrop = this.dropIndex[i]
							let userId = this.userData[this.dropIndex[indexOfDrop]].stuId
							let userName = this.userData[this.dropIndex[indexOfDrop]].stuName
							this.dropIndex.splice(i,1)
							for (let m = 0; m < this.selectUserName.length; m++) {
								if(userName === this.selectUserName[m]) {
									this.selectUserName.splice(m,1)
								}
							}
							for (let m = 0; m < this.selectUserId.length; m++) {
								if(userId === this.selectUserId[m]){
									this.selectUserId.splice(m,1)
								}
							}
							flag = true
							for (let m = 0; m < this.studentChartsData.length; m++) {
								if(userName === this.courseAvgComLegend[m]) {
									this.courseAvgComLegend.splice(m,1)
								}
								if(userId === this.studentChartsData[m].id) {
									this.studentChartsData.splice(m,1)
								}
								
							}
							this.drawAvgToStuCom()
						}
					}
					// flag 为false说明删除的是最后一个数
					if(flag === false) {
						let indexOfDrop = this.dropIndex.length - 1
						let userId = this.userData[this.dropIndex[indexOfDrop]].stuId
						let userName = this.userData[this.dropIndex[indexOfDrop]].stuName
						this.dropIndex.splice(indexOfDrop, 1)
						for (let m = 0; m < this.selectUserName.length; m++) {
							if(userName == this.selectUserName[m]) {
								this.selectUserName.splice(m,1)
							}
						}
						for (let m = 0; m < this.selectUserId.length; m++) {
							if(userId == this.selectUserId[m]){
								this.selectUserId.splice(m,1)
							}
						}
						for (let m = 0; m < this.studentChartsData.length; m++) {
							if(userId == this.studentChartsData[m].id) {
								this.studentChartsData.splice(m,1)
							}
							if(userName === this.courseAvgComLegend[m]) {
								this.courseAvgComLegend.splice(m,1)
							}
						}
						this.drawAvgToStuCom()
						flag = true
					}
				}
			},

			/**
			* Introduction 课程名称下拉框改变
			* @author 刘莉
			* @since 1.0
			* @param {value} 下拉框选中值
			*/
			handleUserSelect(index){
				this.dropIndex.push(index)
				// 设置下拉列表选中值
				this.selectUserName.push(this.userData[index].stuName)
				this.selectUserId.push( this.userData[index].stuId)
				this.getStudentGradeList(this.userData[index].stuName, this.userData[index].stuId);
			}
		}
	}
</script>
<style lang="scss" scoped>
	.studentAnalysisContainer {
		position: relative;
		width: 100%;
		height: 100%;
		padding: 15px;

		.content-wrap {
			position: relative;
			width: inherit;
			height: 100%;
			background: #ffffff;
			border: 1px solid transparent;

			

			.grade-section-box {
				width: 100%;
				height: 455px;
				margin-top: 15px;
				display: inline-block;
				background: #ffffff;
			}

			.select-title {
				display: inline-block;
				padding-left: 55px;
				font-size: 14px;
				font-weight: bold;
			}

			.grade-compare-stu-box,
			.over-avg-box {
				width: 100%;
				display: inline-block;
				position: relative;
				background: #ffffff;
				padding-top: 15px;
			}

			.grade-compare-stu-box {
				.ant-select {
					min-width: 200px;
				}
			}

			#echarts1 {
				width: 400px;
				height: 400px;
				padding-left: 29px;
    			padding-top: 15px;
			}

			#echarts2,
			#echarts4 {
				width: 100%;
				height: 400px;
				padding-left: 29px;
    			padding-top: 15px;
			}
		}
	}
</style>
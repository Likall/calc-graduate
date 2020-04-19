<template>
    <div class="studentGradeTableListContainer" :spinning="spinning">
      <a-table 
            :columns="columnsData" 
            :dataSource="tableDataSource" 
            bordered 
            :scroll="{ x: scollWidth, y: 400 }" 
            :pagination="Pagination"
            :rowKey="record => record.key"
            size="middle">
            <template v-for="col in colColumns" :slot="col" slot-scope="text, record, index">
                <div :key="col">
                    <a-input
                        v-if="record.editable"
                        style="margin: -5px 0"
                        :value="text"
                        @change="e => handleChange(e.target.value, record.key, col)"
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
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import tools from '@/public/tools/tools'
import config from '@/api/config.js'
export default {
    name: 'StudentGradeTableList',
    // props: [
    //     'dataSource',
    //     'columns',
    //     'scollWidth',
    //     'colColumns'
    // ],
    data() {
        return {
            Pagination: {current: 1, total: 0, pageSize: 1000, pageNum: 1, pages: 0},			// 分页信息
            columnsData: [],				// 列数据
            tableDataSource: [],			// 列表数据源
            scollWidth: '',
            colColumns: [],
            spinning: false,
            currentRowData: {},			// 当前列表修改值
        }
    },
    computed: {
        ...mapGetters({
            courseList: 'course/courseList',								// 课程列表
			studentList: 'student/studentList',								// 学生列表
        })
    },
    watch: {
       
    },    
    mounted(){

        this.checkHasLoadStudentData()
    },
    methods: {
        ...mapActions({
            setCourseList: 'course/setCourseList',						// 设置课程列表
            setStudentList: 'student/setStudentList',					// 设置学生列表
            setStudentGradeList: 'student/setStudentGradeList',			// 设置学生成绩列表
        }),
        // 是否加载学生成绩数据
        checkHasLoadStudentData() {
            this.spinning = true
            let exsist = tools.deepClone(this.studentList)
            if (exsist.length <= 0) {
                this.getStudentList()
            } else {
                this.setStudentColumnsData(exsist)
            }
        },

        // 是否加载课程成绩数据
        checkHasLoadCourseData() {
            let exsist = tools.deepClone(this.courseList)
            if (exsist.length <= 0) {
                this.getCourseList()
            } else {
                this.setCourseDataSource(exsist)
            }
        },

        // 获取学生列表数据
        getStudentList() {
            let self = this
            // 开启loading
            let restData = {
                "pageNum": 0,
                "pageSize": 0
            }
            self.axios.post(config.GET_ALL_STUDENT_LIST, restData).then(response =>{
                // 查询成功
                if (response.data.code === '200'){
                    // 有数据
                    if (response.data.data.total > 0){
                        // 设置学生列表数据
                        self.setStudentList(response.data.data.list)
                        // 设置列数据
                        self.setStudentColumnsData(response.data.data.list)
                    } else {
                        this.$emit('disableOfUploads', true)
                    }
                }else {
                    this.$message.error(response.data.msg)
                    this.spinning = false
                }
            })
        },
        
        // 获取课程列表数据
        getCourseList() {
            let self = this
            let restData = {
                "pageNum": 0,
                "pageSize": 0
            }
            self.axios.post(config.GET_ALL_COURSE_LIST, restData).then(response =>{
                // 查询成功
                if (response.data.code === '200'){
                    // 有数据
                    if (response.data.data.total > 0){
                        // 设置课程列表数据
                        self.setCourseList(response.data.data.list)
                        // 设置课程列表数据源
                        self.setCourseDataSource(response.data.data.list)
                    }
                }else {
                    this.$message.error(response.data.msg)
                    this.spinning = false
                }
            })
        },
        // 设置学生列表列数据
        setStudentColumnsData(data) {
            this.columnsData = []
            this.columnsData.push({
                title: '',
                dataIndex: 'course',
                key: 'course',
                fixed: 'left',
                width: 200
            })
            let allStudentLength = 0
            for (let i = 0; i < data.length; i++) {
                let title = data[i].stuId +' '+data[i].stuName
                this.columnsData.push({
                    title: title,
                    dataIndex: data[i].stuId,
                    key: data[i].stuId,
                    scopedSlots: { customRender: data[i].stuId},
                    width: 200
                })
                this.colColumns.push(data[i].stuId)
                allStudentLength = data.length
            }
            this.scollWidth = allStudentLength*200 + 230
            this.columnsData.push({
                title: '操作',
                dataIndex: 'operat',
                scopedSlots: { customRender: 'operat'},
                width: 130,
                fixed: 'right'
            })

            // 设置课程数据
            this.checkHasLoadCourseData()
        },

        // 设置课程数据源
        setCourseDataSource(data) {
            this.tableDataSource = []
            for (let i = 0; i < data.length; i++) {
                this.tableDataSource.push({
                    course: data[i].courseName,
                    key: data[i].courseId
                })
            }
            // 获取成绩列表
            this.getGradeList()
        },
        // 获取成绩列表
        getGradeList() {
            let self = this
            self.axios.get(config.GET_GRADE_LIST).then(response => {
                if (response.data.code === '200') {
                    if (response.data.data.length > 0) {
                        self.setStudentGradeList(response.data.data)
                        self.setGradeDataSource(response.data.data)
                        this.$emit('disableOfUploads', false)
                    } else {
                        this.$emit('disableOfUploads', true)
                    }
                } else {
                    this.$message.error(response.data.msg)
                    this.spinning = false
                }
            })
        },

        // 设置成绩列表源数据
        setGradeDataSource(data) {
            for (let i = 0; i < data.length; i++) {
                let dataItem = data[i]
                for (let j = 0; j < dataItem.length; j++) {
                    let courseId = dataItem[j].courseId
                    let stuId = dataItem[j].stuId
                    let index
                    for (let k = 0; k < this.tableDataSource.length; k++) {
                        if(courseId === this.tableDataSource[k].key) {
                            index = k
                            break; 
                        }
                    }
                    this.tableDataSource[index][stuId] = dataItem[j].courseGrade
                }
            }
            this.spinning = false
            this.$forceUpdate()
        },

        // 处理输入框事件更改事件
        handleChange(value, key, column) {
            
            const newData = [...this.tableDataSource];
            const target = newData.filter(item => key === item.key)[0];
            if (target) {
                target[column] = value;
                this.tableDataSource = newData;
            }
        },
        // 点击编辑按钮事件
        edit(index) {
            // 编辑时 -> 存储未更改数据，为取消事件返回原数据
            this.oldTempRowData = {...this.tableDataSource[index]}
            const newData = [...this.tableDataSource];
            const target = newData.filter((item, i) => index === i);
            // 设置该行可编辑
            if (target) {
                target[0].editable = true;
                this.tableDataSource = newData;
            }
        },

        // 编辑后的保存事件
        save(index) {
            const newData = [...this.tableDataSource];
            // 保存后，编辑该行的数据清除
            this.oldTempRowData = {}
            const target = newData.filter((item,i) => index === i);
            console.log(target)
            if (target) {
                delete target[0].editable;
                let newArray = []
                let studentArray = []
                let courseId = ''
                for (let obj in target[0]) {
                     if (target[0].hasOwnProperty(obj))
                        // 排除course和key
                        if (obj === 'key') {
                            courseId = target[0][obj]
                            
                        } else if(obj !== 'key' && obj !== 'course') {
                            let tempObj = {
                                stuId: obj,
                                courseId: courseId,
                                courseGrade: target[0][obj]
                            }
                            studentArray.push(tempObj)
                        }
                }
                for (let i = 0; i < studentArray.length; i++) {
                    studentArray[i].courseId = courseId
                }
                newArray.push({
                    courseId: courseId,
                    studentCourseList: studentArray
                })
                this.updatedGrade(newArray)
                this.tableDataSource = newData;
            }
        },

        // 编辑后取消修改事件
        cancel(index) {
            const newData = [...this.tableDataSource];
            const target = newData.filter((item,i) => index === i);
            if (target) {
                newData[index] = this.oldTempRowData
                delete target[0].editable;
                this.tableDataSource = newData;
            }
        },

        deleteRow(index){
            let newData = [...this.tableDataSource]
            let target = newData.filter((item,i) => index === i)
            if (target) {
                // 变换状态
                delete target.editable
                newData.splice(index, 1)
                this.tableDataSource = newData;
            }
        },

        // 更新学生课程成绩
        updatedGrade (data) {
            let self = this
            let restData = data[0]
            self.axios.post(config.UPDATE_GRADE, restData).then(response =>{
                // 查询成功
				if (response.data.code === '200') {
                    self.$message.success('修改成功')
                }
                self.spinning = false
            })
        },

        // 处理输入框事件更改事件
        handleChange(value, key, column) {
            
            const newData = [...this.tableDataSource];
            const target = newData.filter(item => key === item.key)[0];
            // 1. 设置当前值
            this.currentRowData = target
            if (target) {
                target[column] = value;
                this.tableDataSource = newData;
            }
        },
    }
}
</script>
<style lang="scss" scoped>

</style>
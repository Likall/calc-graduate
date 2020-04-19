<template>
	<div class="addUserContainer">
        <a-spin :spinning="spinning">
            <a-form :form="addUserForm" class="user-form">
                <a-row>
                    <a-col :span="8" class="ant-col-margin">
                        <a-form-item  label="学号" :validate-status="validAccount" hasFeedback>
                            <a-input
                                style="width: 186px" 
                                v-decorator="[
                                'account',
                                {
                                    rules: [
                                    {
                                        required: true,
                                        message: '请输入学号!',
                                    },
                                    {
                                        validator: validateStuId,
                                    },
                                    ],
                                },
                                ]"
                            />
                            <span class="extra">8位数字组成</span>
                        </a-form-item>
                        <a-form-item  label="姓名" >
                            <a-input
                                style="width: 186px" 
                                v-decorator="[
                                'name',
                                {
                                    rules: [
                                    {
                                        required: true,
                                        message: '请输入姓名!',
                                    },
                                    ],
                                },
                                ]"
                            />
                        </a-form-item>
                        <a-form-item  label="性别" >
                            <a-radio-group v-decorator="[
                                'sex',
                                {
                                    rules: [
                                    {
                                        required: true,
                                        message: '请选择性别!',
                                    },
                                    ],
                                },
                                ]">
                                <a-radio value="0">
                                    男
                                </a-radio>
                                <a-radio value="1">
                                    女
                                </a-radio>
                            </a-radio-group>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                            <a-table
                                size="small"
                                :columns="courseColumns"
                                :dataSource="dataSource"
                                :pagination="false"
                                :scroll="{ y: 400 }" 
                                bordered>

                                <template slot="courseGrade" slot-scope="text, record, index">
                                    <a-form-item >
                                        <a-input-number 
                                        class="must"
                                            size="small"
                                            @change="e => handleGradeChange(index, e)"/>
                                </a-form-item>

                                </template>
                            </a-table>
                    </a-col>
                </a-row>
           
                <a-form-item :wrapper-col="{ span: 12}">
                    <a-button type="primary" @click="handleSubmit" :disabled="noDoubleClick">
                        确定
                    </a-button>
                    <a-button type="default" style="margin-left: 10px;" @click="closeAddUser">
                        取消
                    </a-button>
                </a-form-item>
		    </a-form>
        </a-spin>
		
	</div>

	
</template>
<script>
	import config from '@/api/config.js'  
    import tools from '@/public/tools/tools'
    import { mapGetters, mapActions } from 'vuex';
    import AddGrade from '@/components/detail/student/AddGrade'
	export default {
        name: 'AddUser',
        components: {
            AddGrade,
        },
		data() {
			return {
				addUserForm: this.$form.createForm(this, { name: 'addUser' }),		// 表单
				confirmDirty: false,
				formItemLayout: {
					labelCol: {
						xs: { span: 24 },
						sm: { span: 24 },
						},
					wrapperCol: {
						xs: { span: 24 },
						sm: { span: 24 },
					},
				},
				validAccount: '',					// 验证学号
                userData: [],						// 学生列表
                courseData: [],                     // 课程列表
                courseColumns: [                    // 课程列数据
                    {
                        title: '课程名',
                        dataIndex: 'courseName',
                        width: 400,
                    },
                    {
                        title: '成绩',
                        dataIndex: 'courseGrade',
                        scopedSlots: { customRender: 'courseGrade' },
                        width: 200
                    }
                ],                  
                dataSource: [],                     // 数据源
                gradeData: [],
                noDoubleClick: false,               // 防止二次点击
                spinning: false,                    // loading
			}
		},
		computed:{
			...mapGetters({
				userList: 'user/userList',				// 用户列表
                studentList: 'student/studentList',		// 学生列表
                courseList: 'course/courseList',		// 课程列表
			})
		},
		mounted() {
            document.getElementsByClassName('ant-drawer-content-wrapper')[0].style.height = '100%'
            this.checkHasLoadCourseInfo()
		},
		methods: {
			...mapActions({
				setUserList: 'user/setUserList',		// 设置用户列表
                setStudentList: 'student/setStudentList',		// 设置学生列表
                setCourseList: 'course/setCourseList',		// 设置学生列表
			}),
			// 确认事件
			handleSubmit(e) {
				e.preventDefault();
				let self = this
				self.addUserForm.validateFieldsAndScroll((err, values) => {
                    console.log(values)
					if (!err) {
						
                        let inputLength = document.getElementsByClassName('ant-input-number-input')
                        for (let i = 0; i < inputLength.length; i++) {
                            if (inputLength[i].value == '') {
                                self.$message.error('信息未填写完整！');
                                return;
                            }
                        }
                        // 设置课程列表
                        let gradeList = []
                        // 禁用按钮
                        self.noDoubleClick = true
                        self.spinning = true
                        for (let i = 0; i < self.dataSource.length; i++) {
                            gradeList.push({
                                stuId: values.account,
                                courseId: self.dataSource[i].key,
                                courseGrade: self.dataSource[i].courseGrade + ''
                            })
                        }
                        let sex = ''
                        if (values.sex == '0') {
                            sex = '男'
                        } else {
                            sex = '女'
                        }
                        let resData = {
                            stuId: values.account,
                            stuName: values.name,
                            stuMale: sex,
                            grade: gradeList,
                        }
						self.axios.post(config.ADD_STUDENT_GRADE, resData).then(response => {
							if (response.data.code === '200') {
								self.$message.success(response.data.msg)
							}
							else {
								self.$message.success(response.data.msg)
                            }
                            // 开启按钮
                            self.noDoubleClick = false
                            self.spinning = false
						})
					}
				});
			},
			
			handleConfirmBlur(e) {
				const value = e.target.value;
				this.confirmDirty = this.confirmDirty || !!value;
			},

			// 校验密码
			compareToFirstPassword(rule, value, callback) {
				const form = this.addUserForm;
				if (value && value !== form.getFieldValue('password')) {
					this.validConfirmPsw = 'error'
					callback('两次密码输入不一致！');
				} else {
					if(!value){
						this.validConfirmPsw = ''
					} else {
						this.validConfirmPsw = 'success'

					}
					callback();
				}
			},
			// 校验密码
			validateToNextPassword(rule, value, callback) {
				const form = this.addUserForm;
				if (value && this.confirmDirty) {
					form.validateFields(['confirm'], { force: true });
				}
				if(value){
					// 长度不符合
					if (value.length < 6 || value.length > 16) {
						this.validPsw = 'error'
					}else {
						// 校验格式是否是由数字与字母组成
						var reg = new RegExp(/[A-Za-z].*[0-9]|[0-9].*[A-Za-z]/);
						if (reg.test(value)) {
							this.validPsw = 'success'
						} else {
							this.validPsw = 'error'
						}
					}
				}else {
					this.validPsw = ''
				}
				callback();
			},

			// 验证学号
			validateStuId(rule, value, callback){
				const form = this.addUserForm
				if(value){
					// 长度不符合
					if (value.length > 8 || value.length < 8) {
						this.validAccount = 'error'
					}else {
						// 校验格式是否是由数字与字母组成
						var reg = new RegExp(/^[0-9]*$/);
						if (reg.test(value)) {
							this.validAccount = 'success'
						} else {
							this.validAccount = 'error'
						}
					}
				}else {
					this.validAccount = ''
				}
				callback();
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
                    this.courseData = exsist
                    this.setCourseColumns()
                }
            },

            // 获取列表数据
            getCourseInfo(){
                let self = this
                let restData = {
                    "pageNum": 0,
                    "pageSize": 0,
                }
                self.spinning = true
                self.axios.post(config.GET_ALL_COURSE_LIST, restData).then(response =>{
                    // 查询成功
                    if (response.data.code === '200'){
                        // 有数据
                        if (response.data.data.total > 0){
                            // 设置课程列表
                            let course = response.data.data.list
                            self.setCourseList(course)
                            self.courseData = tools.deepClone(self.courseList)
                            self.setCourseColumns()
                        }
                    }else {
                        self.$message.error('查询失败')
                    }
                    self.spinning = false
                })
            },

            // 设置列数据
            setCourseColumns() {
                let obj
                for (let i = 0; i < this.courseData.length; i++) {
                    this.dataSource.push({
                        key: this.courseData[i].courseId,
                        courseName: this.courseData[i].courseName
                    })
                    
                }
            },
            // 校验输入的
            handleGradeChange(index, value) {
                console.log(value)
                this.dataSource[index].courseGrade = value
                
            },

            /**
             * Introduction 初始化样式
             *
             * @author 刘莉
             */
            initStyle() {
                let must = document.getElementsByClassName("must")
                for (let i = 0; i < must.length; i++) {
                    let mustLable = must[i].children[0].children[0];
                    mustLable.className = 'ant-form-item-required';
                }
            },

            // 关闭滑动框
            closeAddUser() {
                // 触发父组件事件，关闭drawer
                this.$emit('closeAddUser')
            }

        },

        

		
	}
</script>
<style lang="scss" scoped>
.addUserContainer{
	position: relative;
	display: flex;
	
	.extra{
		font-size: 12px;
		display: inline-block;
		padding-left: 5px;
	}

	.ant-table-wrapper {}
	background: #ffffff;
	

	// 下拉框
	.ant-select-selection-selected-value{
		color: black;
	}
	/deep/ .ant-form-item-control{
		white-space: nowrap;
	}
	/deep/ .ant-form-item-label{
		color: black;
		font-weight: bolder;
	}

	/deep/ .ant-form-item-children{
    	display: inline-block
    }

    .user-form {
		width: 100%;
		height: 100%;
	}
    
    /deep/ .ant-form-item {
        margin-bottom: 2px;
    }

    /deep/ .ant-drawer-body {
        padding: 24px 0px;
    }

    /deep/ .ant-table-row {
        /deep/ td {
            padding: 4px 8px !important;
        }
    }

    /deep/ .ant-form-item-control {
        line-height: 20px;
    }

    /deep/ .ant-form-item-children-icon {
        left: 158px;
    }

    /deep/ .ant-table {
        .ant-form-item-children::before {
            display: inline-block;
            color: #f5222d;
            font-size: 14px;
            margin-right: 4px;
            font-family: SimSun, sans-serif;
            line-height: 1px;
            content: '*';
        }
    }

}
</style>
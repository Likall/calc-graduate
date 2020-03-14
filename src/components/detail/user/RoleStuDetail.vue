<template>
    <div class="roleStuContainer">
        <div class="content">
            <div class="temp-div"></div>
            <div class="headerBox">
                <!-- 搜索框 -->
		        <Header :placeData="placeData"></Header>
            </div>
            <div class="btn-box">
                <a-button type="danger" class="btn-delete" size="large"  @click="deleteUserByGroup"><a-icon type="delete"/>批量删除</a-button>
            </div>
        </div>
        
        <!-- 列表 -->
        <user-table-list :dataSource="dataSource" :columns="columns" title="用户列表" @updateDataSource="updateDataSource"></user-table-list>
        <!-- 弹出添加用户 -->
        <!-- <a-modal
            title="添加用户"
            :visible="visible"
            @cancel="handleCancel"
            >
            <add-user></add-user>
        </a-modal> -->
    </div>
</template>
<script>
    import Header from '@/components/detail/public/Header'
    import UserTableList from '@/components/detail/user/UserTableList'
    import AddUser from '@/components/detail/user/AddUser'
    import config from '@/api/config.js'  
    import tools from '@/public/tools/tools'
    import { mapGetters, mapActions } from 'vuex'
    export default {
        name: 'RoleStuDetail',
        components: {
            Header,
            UserTableList,
            AddUser
        },
        data() {
			return {
                placeData: '请输入账号',
                visible: false,
                confirmLoading: false,
                dataSource: [],                 // 数据源
                columns: [],                    // 列数据
                deleteArray: [],                // 删除列表
			}
        },
        computed:{
            ...mapGetters({
                userList: 'user/userList',				// 用户列表
            }),
            rowSelection() {
                const { selectedRowKeys } = this;
                return {
                    onChange: (selectedRowKeys, selectedRows) => {
                        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
                    },
                    getCheckboxProps: record => ({
                        props: {
                            name: record.name,
                        },
                    }),
                };
            }
        },
        mounted() {
            this.getUserList(1)
        },
        methods: {
            ...mapActions({
                setUserList: 'user/setUserList',		// 设置用户列表
            }),
            // 设置模态框可见
            showModal() {
                this.visible = true;
            },
            
            // 设置模态框不可见
            handleCancel(e) {
                this.visible = false;
            },

            // 设置用户列表
            setUserLists(array) {
                this.setUserList(array)
                for (let i = 0; i < array.length; i++) {
                    if (i === 0) {
                        this.setColumsData()
                    }
                    // 时间格式
                    array[i].date = tools.dateFtt('yyyy-MM-dd hh:mm:ss',array[i].date)
                    this.setDataSource(array[i])
                }
            },
            // 获取用户列表 1 ->未删除查询 0 -> 已删除查询
            getUserList(type){
                let self = this
                let userList = tools.deepClone(self.userList)
                if (type == 0) {
                    self.axios.get(config.GET_USER_LIST).then(response =>{
                        if (response.status == '200') {
                            // 有数据
                            if (response.data.length > 0){
                                this.dataSource = []
                                this.setUserLists(response.data)
                            }
                        }
                    })
                } else {
                     if (userList.length == 0){
                        self.axios.get(config.GET_USER_LIST).then(response =>{
                            if (response.status == '200') {
                                // 有数据
                                if (response.data.length > 0){
                                    this.dataSource = []
                                    this.setUserLists(response.data)
                                }
                            }
                            else {
                                this.$message.error("")
                            }
                        })
                    } else {
                        this.dataSource = []
                        this.setUserLists(userList)
                    }
                }
               
                
            },

            // 设置列数据
            setColumsData() {
                let tempArray = [
                    {
                        title: 'ID',
                        dataIndex: 'id',
                        scopedSlots: { customRender: 'id' },
                    },
                    {
                        title: '登录账号',
                        dataIndex: 'account',
                    },
                    {
                        title: '用户名',
                        dataIndex: 'username',
                        scopedSlots: { customRender: 'username' },
                    },
                    {
                        title: '角色',
                        dataIndex: 'role',
                        scopedSlots: { customRender: 'role' },
                    },
                    {
                        title: '注册日期',
                        dataIndex: 'date',
                        scopedSlots: { customRender: 'date' },
                    },
                    {
						title: '操作',
						dataIndex: 'operation',
						scopedSlots: { customRender: 'operation' },
					},
                ]
                this.columns = tempArray
               
            },

            // 设置数据源
            setDataSource(obj) {
                this.dataSource.push({
                    id: obj.userId,
                    account: obj.account,
                    username: obj.userName,
                    role: obj.role,
                    date: obj.date,
                    key: obj.userId
                })
            },

            // 更新源数据
            // value:源数据 target：删除/更改的值 type: 1 删除 2 修改
            updateDataSource(value, target, type){
                console.log(value, target)
                if (type === 1) {
                    let array = [
                        {
                            userId: target[0].id
                        }
                    ]
                    this.deleteUser(array, value)
                } else if (type === 3) {
                    let array = []
                    for (let i = 0; i < target.length; i++) {
                        array.push({
                            userId: target[i].id
                        })
                    }
                    this.deleteArray = array
                }
            },

            // 批量删除
            deleteUserByGroup() {
                console.log("1212")
                this.deleteUser(this.deleteArray)
            },
            // 删除用户
            deleteUser(array, value) {
                let self = this
                let restData = array
                self.axios.post(config.DELETE_USER, restData).then(response => {
                    // 删除成功
                    if (response.data.code === '200') {
                        self.$message.success(response.data.msg)
                        if(value !== 'null' && typeof value !== 'undefined') {
                            self.dataSource = value
                        }
                        else {
                            self.getUserList(0)
                        }
                    } else {
                        self.$message.error(response.data.msg)
                    }
                })
            }
		},

    }
</script>
<style lang="scss" scoped>
    .roleStuContainer{
		position: relative;
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		-webkit-box-sizing: border-box;
		-moz-box-sizing: border-box;
        padding:15px;

        .content{
            position: relative;
            width: 100%;
            height: 110px;
            background-color: white;

            .temp-div{
                position: relative;
                height: 15px;
            }

            .headerBox{
                position: relative;
                width: 100%;
                margin-top: -45px;
                margin-left: 15px;
            }

            .btn-box{
                position: relative;
                box-sizing: border-box;
                -webkit-box-sizing: border-box;
                -moz-box-sizing: border-box;
                padding-left: 15px;
                padding-top: 15px;
            }
        }

        // 删除按钮样式
        .btn-delete{
            color: white;
            background-color: #f5222d;
            border-color: #f5222d;
            margin-right: 10px;
        }
    }
</style>
<template>
    <div class="roleStuContainer">
        <div class="content">
            <div class="temp-div"></div>
            <div class="headerBox">
                <!-- 搜索框 -->
		        <Header :placeData="placeData"></Header>
            </div>
            <div class="btn-box">
                <a-button type="danger" class="btn-delete" size="large"><a-icon type="delete" />批量删除</a-button>
                <a-button type="primary" size="large" @click="showModal"><a-icon type="plus-circle" />添加</a-button>
            </div>
        </div>
        <!-- 列表 -->
        <user-table-list></user-table-list>
        <!-- 弹出添加用户 -->
        <a-modal
            title="添加用户"
            :visible="visible"
            @cancel="handleCancel"
            >
            <add-user></add-user>
        </a-modal>
    </div>
</template>
<script>
    import Header from '@/components/detail/public/Header'
    import UserTableList from '@/components/detail/user/UserTableList'
    import AddUser from '@/components/detail/user/AddUser'
    export default {
        name: 'RoleTecDetail',
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
			}
        },
        methods: {
            // 设置模态框可见
            showModal() {
                this.visible = true;
            },
            
            // 设置模态框不可见
            handleCancel(e) {
                this.visible = false;
            },
        }
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
            height: 100%;
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
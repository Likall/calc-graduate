import types from './user_type'

const state = {
    userList: [],                    // 用户列表
}

var getters = {
    userList: state => {
        return state.userList
    },
    
}

const actions = {
    // 设置用户列表
    setUserList: ({
        commit,
        state
    }, value) => {
        commit(types.SET_USERLIST, value)
    },
}

const mutations = {
    [types.SET_USERLIST](state, value) {
        state.userList = value
    },
    
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
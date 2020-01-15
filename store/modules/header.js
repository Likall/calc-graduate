import types from './header_type'
const state = {
    collapsed: false,							// 菜单折叠
    posTabWidth: {                              // 顶部tab长度 与 左边距
        width: '',
        left: ''
    }
}

var getters = {
	collapsed: state => {
        return state.collapsed
    },
    posTabWidth: state => {
        let w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
        // 左侧边栏收缩
        if(state.collapsed === true){
            return {
                width: (w - parseInt(66)) + 'px',
                left: '66px'
            }
        }
        // 左侧边栏展开
        else{
            return {
                width: (w - parseInt(240)) + 'px',
                left: '240px'
            }
        }
    }
}

const actions = {
	// 设置menu是否折叠
	setCollapsed: ({
        commit,
        state
    }, value) => {
        commit(types.SET_COLLAPSED, value)
    },
}

const mutations = {
    [types.SET_COLLAPSED](state, value) {
        state.collapsed = value
	},
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
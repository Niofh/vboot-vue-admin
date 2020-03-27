import { getAllDepartmentApi } from '@/api/dep'
import commonUtil from '@/utils/common'
import treeDeepUtil from '@/utils/treeDeepUtil'

const getDefaultState = () => {
  return {
    depList: [] // 部门列表

  }
}

const state = getDefaultState()

const getters = {
  // 树形部门列表
  getDepTree: state => {
    const deplist = JSON.parse(JSON.stringify(state.depList))
    return treeDeepUtil.fommatTree(deplist)
  }
}

const mutations = {

  SET_DEP_LIST: (state, depList) => {
    state.depList = depList
  }

}

const actions = {
  // 获取部门列表
  getAllDepartment({ commit, state }) {
    return new Promise((resolve, reject) => {
      getAllDepartmentApi().then(response => {
        if (response.code === 200) {
          commit('SET_DEP_LIST', response.result)
        }
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}


import { getDictAllBaseApi } from '@/api/dict'

const getDefaultState = () => {
  return {
    dictList: [] // 字典列表

  }
}

const state = getDefaultState()

const getters = {

}

const mutations = {
  SET_DICT_LIST(state, dictList) {
    state.dictList = dictList
  }
}

const actions = {
  // 获取所有字典
  getAllDict({ commit, state }) {
    return new Promise((resolve, reject) => {
      if (state.dictList.length > 0) {
        resolve(state.dictList)
        return
      }
      getDictAllBaseApi().then(response => {
        if (response.code === 200) {
          commit('SET_DICT_LIST', response.result)
        }
        resolve(response.result)
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


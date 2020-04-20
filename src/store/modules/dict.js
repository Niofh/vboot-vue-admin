import { getDictAllBaseApi } from '@/api/dict'

const getDefaultState = () => {
  return {
    sexDictList: [] // 性别字典列表

  }
}

const state = getDefaultState()

const getters = {

}

const mutations = {
  SET_SEX_DICT_LIST(state, sexDictList) {
    state.sexDictList = sexDictList
  }
}

const actions = {
  // 获取性别字典
  getSexDictList({ commit, state }, { dickName }) {
    return new Promise((resolve, reject) => {
      if (state.sexDictList.length > 0) {
        resolve(state.sexDictList)
        return
      }
      getDictAllBaseApi({
        dickName: dickName
      }).then(response => {
        if (response.code === 200) {
          commit('SET_SEX_DICT_LIST', response.result)
        }
        resolve(response.result)
      }).catch(() => {
        reject([])
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


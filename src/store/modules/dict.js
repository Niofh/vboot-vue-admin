import { getDictDetailByDictKey } from '@/api/dict'

const getDefaultState = () => {
  return {
    sexDictList: [], // 性别字典列表
    statusDictList: [], // 状态字典
    authorityDictList: []
  }
}

const state = getDefaultState()

const getters = {}

const mutations = {
  SET_SEX_DICT_LIST(state, sexDictList) {
    state.sexDictList = sexDictList
  },
  SET_STATUS_DICT_LIST(state, statusDictList) {
    state.statusDictList = statusDictList
  },
  SET_AUTHORITY_DICT_LIST(state, authorityDictList) {
    state.authorityDictList = authorityDictList
  }
}

const actions = {
  // 获取性别字典
  getSexDictList({ commit, state }) {
    return new Promise((resolve, reject) => {
      if (state.sexDictList.length > 0) {
        resolve(state.sexDictList)
        return
      }
      getDictDetailByDictKey({
        dictKey: 'sex'
      }).then(response => {
        if (response.code === 200) {
          commit('SET_SEX_DICT_LIST', response.result)
        }
        resolve(response.result)
      }).catch(() => {
        reject([])
      })
    })
  },
  // 获取状态字典
  getStatusDictList({ commit, state }) {
    return new Promise((resolve, reject) => {
      if (state.statusDictList.length > 0) {
        resolve(state.statusDictList)
        return
      }
      getDictDetailByDictKey({
        dictKey: 'status'
      }).then(response => {
        if (response.code === 200) {
          commit('SET_STATUS_DICT_LIST', response.result)
        }
        resolve(response.result)
      }).catch(() => {
        reject([])
      })
    })
  },
  // 获取数据权限类型字典
  getAuthorityDictList({ commit, state }) {
    return new Promise((resolve, reject) => {
      if (state.authorityDictList.length > 0) {
        resolve(state.authorityDictList)
        return
      }
      getDictDetailByDictKey({
        dictKey: 'authority'
      }).then(response => {
        if (response.code === 200) {
          commit('SET_AUTHORITY_DICT_LIST', response.result)
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


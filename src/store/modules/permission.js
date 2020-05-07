import { constantRoutes, asyncRoutes } from '@/router'
import { findMenuAndPerByUsername } from '@/api/user'
import treeDeepUtil from '@/utils/treeDeepUtil'
import Layout from '@/layout'
/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.permission) {
    return roles.some(role => route.meta.permission.includes(role))
  } else {
    return true
  }
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
    console.log(state.routes, 'state.routes')
  }
}

const actions = {
  // 根据用户名获取菜单和权限
  generateRoutes({ commit }, { username }) {
    return new Promise((resolve, reject) => {
      findMenuAndPerByUsername({ username }).then(res => {
        if (res.code === 200) {
          const menu = res.result.permissions
          const routers = arrayToTree(menu)
          commit('SET_ROUTES', routers)
          resolve(routers)
        } else {
          reject()
        }
      }).catch(error => {
        reject(error)
      })
    })

    // return new Promise(resolve => {
    //   const accessedRoutes = asyncRoutes || []
    //   console.log(accessedRoutes, '================')
    //   commit('SET_ROUTES', accessedRoutes)
    //   resolve(accessedRoutes)
    // })
  }
}

// 权限数组转换为树形结构
function arrayToTree(menuList) {
  const perList = []
  const menus = []
  const router = []

  menuList.forEach(item => {
    if (item.type === 1) {
      perList.push(item)
    } else {
      menus.push(item)
    }
  })

  menus.forEach(menu => {
    router.push({
      id: menu.id,
      parentId: menu.parentId,
      name: menu.name,
      path: menu.path,
      hidden: !menu.hidden,
      component: menu.component === 'Layout' ? Layout : resolve => require([`@/views${menu.component}.vue`], resolve),
      redirect: menu.redirect,
      meta: {
        title: menu.title,
        icon: menu.icon,
        noCache: !menu.nocache,
        permissions: []
      }
    })
  })

  console.log(router)

  var fommatTree = treeDeepUtil.fommatTree(router)
  var concat = fommatTree.concat([{ path: '*', redirect: '/404', hidden: true }])
  console.log('【concat】', concat)
  return concat
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

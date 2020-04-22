
import request from '@/utils/request'

// 分页
export function getRoleByPageApi(data) {
  return request({
    url: '/role/getRoleByPage',
    method: 'get',
    params: data
  })
}

// 根据id获取信息
export function getRoleById(id) {
  return request({
    url: '/role/get/' + id,
    method: 'get'
  })
}

// 根据id保存数据
export function roleSaveBaseApi(data) {
  return request({
    url: '/role/saveBase',
    method: 'post',
    data
  })
}

// 根据id修改数据
export function roleUpdateBaseApi(data) {
  return request({
    url: '/role/updateBase',
    method: 'post',
    data
  })
}

// 根据id删除数据(可以传递多个id)
export function roleDelByIdsApi(data) {
  return request({
    url: '/role/delByIds',
    method: 'post',
    data
  })
}
// 获取所有数据
export function getRoleAllBaseApi() {
  return request({
    url: '/role/getAllBase',
    method: 'get'
  })
}

// 根据角色id获取所有权限
export function getPermission(data) {
  return request({
    url: '/role/getPermission',
    method: 'get',
    params: data
  })
}
export function setPermission(data) {
  return request({
    url: '/role/setPermission',
    method: 'post',
    data: data
  })
}

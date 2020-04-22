
import request from '@/utils/request'

/**
 * 获取所有权限
 * @returns {AxiosPromise}
 */
export function getAllPermissionApi() {
  return request({
    url: '/permission/getAllBase',
    method: 'get'
  })
}

export function permissionSaveBaseApi(data) {
  return request({
    url: '/permission/saveBase',
    method: 'post',
    data
  })
}

export function permissionUpdateBaseApi(data) {
  return request({
    url: '/permission/updateBase',
    method: 'post',
    data
  })
}

export function permissionDelByIdsApi(data) {
  return request({
    url: '/permission/delByIds',
    method: 'post',
    data
  })
}


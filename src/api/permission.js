
import request from '@/utils/request'

/**
 * 获取所有权限
 * @returns {AxiosPromise}
 */
export function getAllPermissionApi() {
  return request({
    url: '/permission/getAll',
    method: 'get'
  })
}

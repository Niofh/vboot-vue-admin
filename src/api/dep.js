
import request from '@/utils/request'

/**
 * 获取所有权限
 * @returns {AxiosPromise}
 */
export function getAllDepartmentApi() {
  return request({
    url: '/department/getAllBase',
    method: 'get'
  })
}

export function departmentSaveBaseApi(data) {
  return request({
    url: '/department/saveBase',
    method: 'post',
    data
  })
}

export function departmentUpdateBaseApi(data) {
  return request({
    url: '/department/updateBase',
    method: 'post',
    data
  })
}

export function departmentDelByIdsApi(data) {
  return request({
    url: '/department/delByIds',
    method: 'post',
    data
  })
}

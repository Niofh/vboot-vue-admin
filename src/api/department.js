
import request from '@/utils/request'

// 分页
export function getDepartmentByPageApi(data) {
  return request({
    url: '/department/getDepartmentByPage',
    method: 'get',
    params: data
  })
}

// 根据id获取信息
export function getDepartmentById(id) {
  return request({
    url: '/department/get/' + id,
    method: 'get'
  })
}

// 根据id保存数据
export function departmentSaveBaseApi(data) {
  return request({
    url: '/department/saveBase',
    method: 'post',
    data
  })
}

// 根据id修改数据
export function departmentUpdateBaseApi(data) {
  return request({
    url: '/department/updateBase',
    method: 'post',
    data
  })
}

// 根据id删除数据(可以传递多个id)
export function departmentDelByIdsApi(data) {
  return request({
    url: '/department/delByIds',
    method: 'post',
    data
  })
}
// 获取所有数据
export function getDepartmentAllBaseApi() {
  return request({
    url: '/department/getAllBase',
    method: 'get'
  })
}

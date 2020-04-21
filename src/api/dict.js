
import request from '@/utils/request'

// 分页
export function getDictByPageApi(data) {
  return request({
    url: '/dict/getDictByPage',
    method: 'get',
    params: data
  })
}

// 根据id获取信息
export function getDictById(id) {
  return request({
    url: '/dict/get/' + id,
    method: 'get'
  })
}

// 根据id保存数据
export function dictSaveBaseApi(data) {
  return request({
    url: '/dict/saveBase',
    method: 'post',
    data
  })
}

// 根据id修改数据
export function dictUpdateBaseApi(data) {
  return request({
    url: '/dict/updateBase',
    method: 'post',
    data
  })
}

// 根据id删除数据(可以传递多个id)
export function dictDelByIdsApi(data) {
  return request({
    url: '/dict/delByIds',
    method: 'post',
    data
  })
}

// 根据dictKey获取字典详情
export function getDictDetailByDictKey(data) {
  return request({
    url: '/dict/getDictDetailByDictKey',
    method: 'get',
    params: data
  })
}


import request from '@/utils/request'

// 分页
export function getDictDetailByPageApi(data) {
  return request({
    url: '/dictDetail/getDictDetailByPage',
    method: 'get',
    params: data
  })
}

// 根据id获取信息
export function getDictDetailById(id) {
  return request({
    url: '/dictDetail/get/' + id,
    method: 'get'
  })
}

// 根据id保存数据
export function dictDetailSaveBaseApi(data) {
  return request({
    url: '/dictDetail/saveBase',
    method: 'post',
    data
  })
}

// 根据id修改数据
export function dictDetailUpdateBaseApi(data) {
  return request({
    url: '/dictDetail/updateBase',
    method: 'post',
    data
  })
}

// 根据id删除数据(可以传递多个id)
export function dictDetailDelByIdsApi(data) {
  return request({
    url: '/dictDetail/delByIds',
    method: 'post',
    data
  })
}
// 根据dictID获取字典详情
export function getDictDetailByDictIdApi(data) {
  return request({
    url: '/dictDetail/getDictDetailByDictId',
    method: 'get',
    params: data
  })
}

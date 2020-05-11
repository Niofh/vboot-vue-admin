import request from '@/utils/request'

// 分页
export function getMessageByPageApi(data) {
  return request({
    url: '/message/getMessageByPage',
    method: 'get',
    params: data
  })
}

// 根据id获取信息
export function getMessageById(id) {
  return request({
    url: '/message/get/' + id,
    method: 'get'
  })
}

// 根据id保存数据
export function messageSaveBaseApi(data) {
  return request({
    url: '/message/saveBase',
    method: 'post',
    data
  })
}

// 根据id修改数据
export function messageUpdateBaseApi(data) {
  return request({
    url: '/message/updateBase',
    method: 'post',
    data
  })
}

// 根据id删除数据(可以传递多个id)
export function messageDelByIdsApi(data) {
  return request({
    url: '/message/delByIds',
    method: 'post',
    data
  })
}

// 获取所有数据
export function getMessageAllBaseApi() {
  return request({
    url: '/message/getAllBase',
    method: 'get'
  })
}

// 发送数据
export function sendMsgApi(data) {
  return request({
    url: '/message/sendMsg',
    method: 'post',
    data
  })
}

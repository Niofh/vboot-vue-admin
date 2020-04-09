
import request from '@/utils/request'

export function getCodeDetailByPageApi(data) {
  return request({
    url: '/codeDetail/getCodeDetailByPage',
    method: 'get',
    params: data
  })
}

export function getCodeDetailAll(data) {
  return request({
    url: '/codeDetail/getAllBase',
    method: 'get',
    params: data
  })
}

export function getCodeDetailById(id) {
  return request({
    url: `/codeDetail/get/${id}`,
    method: 'get'
  })
}

export function codeDetailSaveBaseApi(data) {
  return request({
    url: '/codeDetail/saveBase',
    method: 'post',
    data
  })
}

export function codeDetailUpdateBaseApi(data) {
  return request({
    url: '/codeDetail/updateBase',
    method: 'post',
    data
  })
}

export function codeDetailDelByIdsApi(data) {
  return request({
    url: '/codeDetail/delByIds',
    method: 'post',
    data
  })
}

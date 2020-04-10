
import request from '@/utils/request'

export function getCodeByPageApi(data) {
  return request({
    url: '/code/getCodeByPage',
    method: 'get',
    params: data
  })
}

export function getCodeById(id) {
  return request({
    url: `/code/get/${id}`,
    method: 'get'
  })
}

export function codeSaveBaseApi(data) {
  return request({
    url: '/code/saveBase',
    method: 'post',
    data
  })
}

export function codeUpdateBaseApi(data) {
  return request({
    url: '/code/updateBase',
    method: 'post',
    data
  })
}

export function codeDelByIdsApi(data) {
  return request({
    url: '/code/delByIds',
    method: 'post',
    data
  })
}
export function fileDownLoad(data) {
  return request({
    url: '/code/fileDownLoad',
    method: 'get',
    params: data
  })
}

import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/security/vboot/login',
    method: 'post',
    data
  })
}

export function getInfo(accessToken) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { accessToken }
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}

export function getUserById(id) {
  return request({
    url: `/user/getUser/${id}`,
    method: 'get'
  })
}
export function getUserByPageApi(data) {
  return request({
    url: '/user/getUserByPage',
    method: 'get',
    params: data
  })
}

export function getAllUserApi() {
  return request({
    url: '/user/getAllBase',
    method: 'get'
  })
}

export function userSaveBaseApi(data) {
  return request({
    url: '/user/saveBase',
    method: 'post',
    data
  })
}

export function userUpdateBaseApi(data) {
  return request({
    url: '/user/updateBase',
    method: 'post',
    data
  })
}

export function userDelByIdsApi(data) {
  return request({
    url: '/user/delByIds',
    method: 'post',
    data
  })
}

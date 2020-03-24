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

import request from '@/utils/request'

export function loginByUsername(username, password) {
  const data = {
    'username': username,
    'password': password
  }
  return request({
    url: '/api/v1.0/user/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/login/logout',
    method: 'post'
  })
}

export function getUserInfo(token) {
  return request({
    url: '/api/v1.0/user/info',
    method: 'post'
  })
}


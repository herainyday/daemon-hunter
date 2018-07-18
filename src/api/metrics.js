import request from '@/utils/request'

export function fetchOverview(now, user_id) {
  return request({
    url: '/api/v1.0/view/all/' + now + '/' + user_id,
    method: 'get'
  })
}

export function fetchPeriod(now, user_id) {
  return request({
    url: '/api/v1.0/view/period/' + now + '/' + user_id,
    method: 'get'
  })
}

export function fetchPoolview(now, user_id, pool_id) {
  return request({
    url: '/api/v1.0/view/pool/' + now + '/' + user_id + '/' + pool_id,
    method: 'get'
  })
}

export function fetchRackview(now, user_id, pool_id, rack) {
  return request({
    url: '/api/v1.0/view/rack/' + now + '/' + user_id + '/' + pool_id + '/' + rack,
    method: 'get'
  })
}

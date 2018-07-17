import request from '@/utils/request'

export function fetchPools() {
  return request({
    url: '/api/v1.0/pool/pools',
    method: 'get'
  })
}

export function initPool(name) {
  const data = {
    'name': name
  }
  return request({
    url: '/api/v1.0/pool/init',
    method: 'post',
    data
  })
}

export function uploadMinerInfo(pool_id, owner_id, payload) {
  const data = {
    'pool_id': pool_id,
    'owner_id': owner_id,
    'payload': payload
  }
  return request({
    url: '/api/v1.0/pool/upload',
    method: 'post',
    data
  })
}

export function uploadMinerFileUrl() {
  return '/site/api/v1.0/pool/uploadFile'
}

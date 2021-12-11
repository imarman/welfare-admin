import request from '@/utils/request'

export function getUserInfo(id) {
  return request({
    url: '/user-center/userinfo',
    method: 'get',
    params: { 'id': id }
  })
}

export function update(data) {
  return request({
    url: `/user-center/changeInfo`,
    method: 'put',
    data: data
  })
}
export function changePwd(data) {
  return request({
    url: `/user-center/changePwd`,
    method: 'put',
    data: data
  })
}

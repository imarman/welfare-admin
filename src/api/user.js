import request from '@/utils/request'

// export function login(data) {
//   return request({
//     url: '/vue-admin-template/user/login',
//     method: 'post',
//     data
//   })
// }

export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data: data
  })
}

export function getInfo() {
  return request({
    url: '/sysUser/getInfo',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'get'
  })
}

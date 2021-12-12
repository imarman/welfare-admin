import request from '@/utils/request'

// export function getAll() {
//   return request({
//     url: `/campus/list`,
//     method: 'get'
//   })
// }

export function getAllApply() {
  return request({
    url: `/apply/all`,
    method: 'get'
  })
}

export function changeStatus(id, status) {
  return request({
    url: `/apply/change-status`,
    method: 'put',
    data: { 'id': id, 'status': status }
  })
}

// export function saveWelfare(data) {
//   return request({
//     url: `/apply/save`,
//     method: 'post',
//     data: data
//   })
// }

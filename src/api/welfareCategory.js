import request from '@/utils/request'

export function getAll(params) {
  return request({
    url: `/welfare-categories/list`,
    method: 'get',
    params: params
  })
}

export function deleteById(id) {
  return request({
    url: `/welfare-categories/delete/${id}`,
    method: 'delete'
  })
}

export function save(data) {
  return request({
    url: `/welfare-categories/save`,
    method: 'post',
    data: data
  })
}

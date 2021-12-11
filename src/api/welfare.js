import request from '@/utils/request'

export function getWelfareListByPage(current, limit, params) {
  return request({
    url: `/welfare/all/${current}/${limit}`,
    method: 'get',
    params: params
  })
}

export function deleteById(id) {
  return request({
    url: `/welfare/delete/${id}`,
    method: 'delete'
  })
}

export function save(data) {
  return request({
    url: `/welfare/save`,
    method: 'post',
    data: data
  })
}

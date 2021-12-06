import request from '@/utils/request'

export function getAll(current, limit, name) {
  return request({
    url: `/sysUser/all/${current}/${limit}`,
    method: 'get',
    params: { name: name }
  })
}

export function deleteById(id) {
  return request({
    url: `/sysUser/delete/${id}`,
    method: 'delete'
  })
}

export function save(data) {
  return request({
    url: `/sysUser/save`,
    method: 'post',
    data: data
  })
}

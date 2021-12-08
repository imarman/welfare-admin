import request from '@/utils/request'

export function getCampusList() {
  return request({
    url: `/campus/list`,
    method: 'get'
  })
}

export function getCampusListByPage(current, limit, timeRangeStr) {
  return request({
    url: `/campus/pageList/${current}/${limit}`,
    method: 'get',
    params: timeRangeStr
  })
}

export function deleteById(id) {
  return request({
    url: `/campus/delete/${id}`,
    method: 'delete'
  })
}

export function save(data) {
  return request({
    url: `/campus/save`,
    method: 'post',
    data: data
  })
}

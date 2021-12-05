import request from '@/utils/request'

export function getCampusList() {
  return request({
    url: `/campus/list`,
    method: 'get'
  })
}

/**
 * @description 过滤时间格式，传入时间戳， 根据参数返回不同格式
 */
// 过滤日期格式，传入时间戳，根据参数返回不同格式
const formatTimer = function(val, hours) {
  if (val) {
    var dateTimer = new Date(val * 1000)
    var y = dateTimer.getFullYear()
    var M = dateTimer.getMonth() + 1
    var d = dateTimer.getDate()
    var h = dateTimer.getHours()
    var m = dateTimer.getMinutes()
    M = M >= 10 ? M : '0' + M
    d = d >= 10 ? d : '0' + d
    h = h >= 10 ? h : '0' + h
    m = m >= 10 ? m : '0' + m
    if (hours) {
      return y + '-' + M + '-' + d + ' ' + h + ':' + m
    } else {
      return y + '-' + M + '-' + d
    }
  }
}

/**
 *@description 格式化支付方式
 *  */

const formatPayWay = function(val) {
  switch (val) {
    case 1:
      return '微信'
      break
    case 2:
      return '支付宝'
      break
    case 3:
      return 'apple pay'
      break
    case 4:
      return '银联支付'
      break
    default:
      break
  }
}
/**
 * 根据key过滤值 returnkey要返回的值的key
 */
const findValue = function(val, key, filterArr, rerunkey) {
  let findItem = filterArr.find(item => {
    return item[key] === val
  })
  if (findItem) {
    return findItem[rerunkey]
  }
}

/**
 * 文字超出就省略
 * @param {String} text 文本
 * @param {number} length 截取长度
 */
const textEllipsis = function(text, length) {
  return text.length > length ? text.slice(0, length) + '...' : text
}

export default {
  formatTimer,
  formatPayWay,
  findValue,
  textEllipsis
}

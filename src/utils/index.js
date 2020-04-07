/**
 * @description 判断设备信息
 * @returns {String}
 */
export function judgeDevice() {
  let ua = window.navigator.userAgent,
    app = window.navigator.appVersion

  // 这里可以叫安卓和原生端在userAngent中塞入约定好的名字，我这里是'hydf'
  if (ua.toLowerCase().includes('hydf')) {
    // app 端
    if (ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
      // ios端
      return 'hydf-ios'
    } else if (ua.indexOf('Android') > -1 || ua.indexOf('Adr') > -1) {
      // android端
      return 'hydf-android'
    }
  } else {
    if (ua.toLocaleLowerCase().includes('micromessenger')) {
      // 微信浏览器
      return 'wx'
    } else {
      // 其他浏览器
      return 'others'
    }
  }
  /* if (!!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
    // ios端
    console.log('ios端')
  } else if (ua.indexOf('Android') > -1 || ua.indexOf('Adr') > -1) {
    // android端
    console.log('android端')
  }
  if (ua.toLocaleLowerCase().includes('micromessenger')) {
    // 微信浏览器
    console.log('微信浏览器')
  } */
}

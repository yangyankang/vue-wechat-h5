/* 用户相关 */
import request from '@/utils/request'

/**
 * @export
 * @param {*}
 * @returns
 */
export function test() {
    return request({
        url: '/test',
        method: 'get',
    })
}

/**
 * @description 手机验证码登录
 * @export
 * @param {*} data
 * @returns
 */
export function loginByPhone(data) {
    return request({
        url: '/loginByPhone',
        method: 'post',
        data,
    })
}

/**
 * @description 发送手机短信验证码
 * @export
 * @param {*} phone
 * @returns
 */
export function sendPhoneVerifyCode(phone) {
    return request({
        url: '/sendPhoneVerifyCode',
        method: 'get',
        params: {
            phone,
        },
    })
}

/**
 * @description updateUsername 修改用户姓名
 * @export
 * @param {*} userName 用户姓名
 * @returns
 */
export function updateUsername(userName) {
    return request({
        url: '/user/updateUserName',
        method: 'post',
        data: {
            userName,
        },
    })
}

/**
 * @description fetchUserInfo 查询用户详情
 * @export
 * @returns
 */
export function fetchUserInfo() {
    return request({
        url: '/user/detail',
        method: 'get',
    })
}

export function logout() {
    return request({
        url: '/user/logout',
        method: 'post',
    })
}

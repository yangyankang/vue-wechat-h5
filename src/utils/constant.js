/* 普通常量 */
export const TO_URL = 'to_url' // 缓存的跳转的url
export const OPENID = 'openid' // 缓存openId
export const USER_TOKEN = 'User_Token' //用户token
export const GOOD_DETAIL_DATA = 'good_detail_data' //商品详情页需要传参的数据

/* mutations常量 */
// store.user
export const LOGIN = 'login' // 登录
export const LOGOUT = 'logout' // 登出
export const SET_USERINFO = 'set_userinfo' // 设置用户信息
export const USERINFO = 'userinfo' // 用户信息
export const SET_OPENID = 'set_openid' // 设置openId
export const SET_TOKEN = 'set_token' // 设置token

// store.practice
export const SET_PRACTICE_SUBJECTS = 'set_practice_subjects' // 设置答题信息
export const SET_EXAM_NO = 'set_exam_no' // 设置答题的所有题目
export const SET_IS_OVER = 'set_is_over' // 设置答题是否结束
export const SET_CACHEOPTIONLIST = 'set_cacheoptionlist' // 设置答题中已经选过的题目
export const RESET_CACHEOPTIONLIST = 'reset_cacheoptionlist' // 清空答题中已经选过的题目
export const SET_CACHETIPSHOWTYPELIST = 'set_cachetipshowtypelist' //缓存设置题目显示类型
export const RESET_CACHETIPSHOWTYPELIST = 'RESET_CACHETIPSHOWTYPELIST' //重置缓存类型
export const SUBMIT_ANSWERSHEET =  'SUBMITANSWERSHEET' //提交答案
export const SET_ANSWERSHEET = 'SET_ANSWERSHEET'//答案结果
export const SET_EXAM_FULLURL =  'SET_EXAM_FULLURL' //设置完整路径


//localstoreage key
export const SUBMIT_PARAMS = 'SUBMIT_PARAMS' //提交答案的参数
export const SUBMIT_RESULT = 'SUBMIT_RESULT' //提交结果
export const EXAM_FULLURL = 'EXAM_FULLURL' //做题的完整路径

// store.study
export const CLASS_INVITATIONID = 'classInvitationId' // 课程邀请的id
export const SET_CLASS_INVITATIONID = 'set_class_invitationid' // 设置课程邀请的id
export const INVITER_USERINFO = 'inviter_userinfo' // 邀请人用户信息
export const SET_INVITER_USERINFO = 'set_inviter_userinfo' // 设置邀请人用户信息

/* actions常量 */


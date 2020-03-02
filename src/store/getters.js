const getters = {
  token: state => state.user.token,
  userInfo: state => state.user.userInfo,
  inviteUserInfo: state => state.study.inviteUserInfo,
  openId: state => state.user.openId,
  device: state => state.page.device,
  subjects: state => state.practice.examInfo.subjectList,
  subjectSum: state => state.practice.examInfo.subjectSum,
  practiceModel: state => state.practice.examInfo.model
}

export default getters

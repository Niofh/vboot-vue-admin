const commonUtil = {

  /**
   * 将对象字段值为空
   * @param object 对象
   * @param filedList  [String,...] 字段名称
   */
  setObjectFiledNull(object, filedList) {
    filedList.forEach(item => {
      object[item] = ''
    })
  },
  /**
   * 根据日期数组拼接日期时间
   * @param dateList
   * @returns {*[]|*}
   */
  getStartAndTime(dateList) {
    if (dateList && dateList.length > 1) {
      return [dateList[0] + ' 00:00:00', dateList[1] + ' 23:59:59']
    } else {
      return ['', '']
    }
  }
}

export default commonUtil

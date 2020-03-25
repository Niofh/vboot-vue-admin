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
  }
}

export default commonUtil

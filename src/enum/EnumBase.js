/**
 *  基础枚举类
 */
class EmumBase {
  constructor(id, value) {
    this.id = id
    this.value = value
  }
}

/**
 * 将枚举转换为数组
 * @returns {[]}
 */
function getArray(object) {
  const array = []
  for (const key in object) {
    if (object.hasOwnProperty(key)) {
      const obj = {
        id: object[key].id,
        value: object[key].value
      }
      array.push(obj)
    }
  }
  return array
}

export { EmumBase, getArray }

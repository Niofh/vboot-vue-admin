/**
 *  基础枚举类
 */
class EmumBase {
  constructor(id, value) {
    this._id = id
    this._value = value
  }

  get id() {
    return this._id
  }

  get value() {
    return this._value
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

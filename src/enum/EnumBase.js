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
function getArray() {
  const array = []
  for (const key in this) {
    if (this.hasOwnProperty(key)) {
      const obj = {
        id: this[key].id,
        value: this[key].value
      }
      array.push(obj)
    }
  }
  return array
}

export { EmumBase, getArray }

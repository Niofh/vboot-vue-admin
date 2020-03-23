const treeDeepUtil = {

  // 递归扁平化转换树形结构
  coverTreeData(data, parentId) {
    const list = []
    for (let i = 0; i < data.length; i++) {
      const item = data[i]
      if (item.parentId === parentId) {
        item.children = this.coverTreeData(data, item.id)
        list.push(item)
      }
    }
    return list
  }
}

export default treeDeepUtil

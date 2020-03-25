const treeDeepUtil = {

  // 递归扁平化转换树形结构
  fommatTree(arrayList, pidStr = 'parentId', idStr = 'id', childrenStr = 'children') {
    const listOjb = {} // 用来储存{key: obj}格式的对象
    const treeList = [] // 用来储存最终树形结构数据的数组
    // 将数据变换成{key: obj}格式，方便下面处理数据
    for (let i = 0; i < arrayList.length; i++) {
      listOjb[arrayList[i][idStr]] = arrayList[i]
    }
    // 根据pid来将数据进行格式化
    for (let j = 0; j < arrayList.length; j++) {
    // 判断父级是否存在
      const haveParent = listOjb[arrayList[j][pidStr]]
      if (haveParent) {
      // 如果有没有父级children字段，就创建一个children字段
        !haveParent[childrenStr] && (haveParent[childrenStr] = [])
        // 在父级里插入子项
        haveParent[childrenStr].push(arrayList[j])
      } else {
      // 如果没有父级直接插入到最外层
        treeList.push(arrayList[j])
      }
    }
    return treeList
  }
}

export default treeDeepUtil

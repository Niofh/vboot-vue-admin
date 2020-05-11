// 全局字典过滤器
import Vue from 'vue'

Vue.filter('dictFilter', function(value, dictList) {
  let name = ''
  for (let i = 0; i < dictList.length; i++) {
    if (dictList[i].code === value) {
      name = dictList[i].name
      break
    }
  }
  return name
})

// 是和否
Vue.filter('flagFilter', function(value) {
  let name = ''
  if (value > -1) {
    name = value === 1 ? '是' : '否'
  }

  return name
})

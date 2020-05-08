import router from '@/router'

export default {
  inserted(el, binding, vnode) {
    const { value } = binding
    const permissions = router.currentRoute.meta.permissions
    if (value && value instanceof Array && value.length > 0) {
      const hasPermission = permissions.some(permission => {
        return value.includes(permission.buttonType) // 按钮类型
      })

      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error(`need roles! Like v-permission="['add','editor']"`)
    }
  }
}

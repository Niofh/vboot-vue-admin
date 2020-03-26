// From表单统计操作
import dayjs from 'dayjs'

const formMixin = {
  data() {
    return {
      dialogFormVisible: false,
      loading: false,
      rules: {

      }
    }
  },
  methods: {
    formatterDate(value) {
      if (!value) {
        return ''
      }
      return dayjs(value).format('YYYY-MM-DD HH:mm:ss')
    },
    formatterTime(row, column) {
      return this.formatterDate(row[column.prop])
    },
    // 设置loading状态
    setLoading(flag) {
      this.loading = flag
    },
    // 打开弹框
    openModal() {
      this.dialogFormVisible = true
    },
    closeModal() {
      this.dialogFormVisible = false
    },
    // 关闭后回调
    close(formName) {
      this.resetForm(formName)
      this.loading = false
    },
    // 重置表单属性
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}

export default formMixin

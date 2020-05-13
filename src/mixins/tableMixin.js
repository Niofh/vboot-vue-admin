// 分页表格mixin

const tableMixin = {
  data() {
    return {
      pageSizeList: [5, 10, 15, 20],
      page: {
        pageSize: 10,
        pageIndex: 1,
        total: 0,
        sort: '',
        order: ''
      },
      dataList: [],
      searchForm: {},
      dataListLoading: false
    }
  },
  methods: {
    getDataList() {
      this.dataListLoading = false
    },
    // 排序
    handleSortChange({ column, prop, order }) {
      console.log({ column, prop, order })
      if (order) {
        this.page.sort = prop
        this.page.order = order === 'ascending' ? 'asc' : 'desc'
      } else {
        this.page.sort = ''
        this.page.order = ''
      }
      this.getDataList()
    },
    // 分页, 每页条数
    handleSizeChange(size) {
      this.page.pageSize = size
      this.page.pageIndex = 1
      this.getDataList()
    },
    handleCurrentChange(index) {
      this.page.pageIndex = index
      this.getDataList()
    },
    sortChange(column, prop, order) {
      console.log(column, prop, order)
    },
    // 刷新
    handleRefresh() {
      this.handleSearch()
    },
    // 查询事件
    handleSearch() {
      this.dataListLoading = true
      this.page.pageIndex = 1
      this.getDataList()
    },
    // 重置表单
    handleReset(cb) {
      this.dataListLoading = true
      this.page.pageIndex = 1
      this.getDataList()
      // 新增回调
      if (cb && typeof (cb) === 'function') {
        cb()
      }
    },
    // 判断列表操作是否显示  value：是存储数组权限字符
    showOperation(value) {
      const permission = (this.$store.getters && this.$store.state.permission.permission) || []
      if (value instanceof Array) {
        // 如果操作按钮有值，返回true
        const bool = value.some(item => {
          return permission.indexOf(item) > -1
        })
        if (!bool) {
          return false
        } else {
          return true
        }
      }
      return false
    }
  }
}

export default tableMixin

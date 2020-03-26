<template>
  <div class="app-container user">
    <el-form ref="searchForm" :inline="true" :model="searchForm" class="demo-form-inline" size="small">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="searchForm.username" clearable placeholder="用户名" />
      </el-form-item>
      <el-form-item label="昵称" prop="nickName">
        <el-input v-model="searchForm.nickName" clearable placeholder="用户名" />
      </el-form-item>
      <el-form-item label="用户状态" prop="status">
        <el-select v-model="searchForm.status" placeholder="用户状态">
          <el-option label="启用" :value="0" />
          <el-option label="禁用" :value="-1" />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间" prop="date">
        <el-date-picker
          v-model="searchForm.date"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
        />
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" type="primary" @click="handleSearch">查询</el-button>
        <el-button icon="el-icon-refresh-right" type="success" @click="handleResetFrom">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="btns-wrap">
      <el-button type="primary" size="small" icon="el-icon-plus">新增</el-button>
      <el-button type="success" size="small" icon="el-icon-edit">修改</el-button>
      <el-button type="danger" size="small" icon="el-icon-delete">删除</el-button>
      <el-button class="btn-default" size="small" icon="el-icon-refresh-left">刷新</el-button>
      <el-popover
        placement="right"
        trigger="click"
      >
        <!--排版-->
        <el-checkbox-group v-model="checkFieldList">
          <p><el-checkbox label="avatar" checked>头像</el-checkbox></p>
          <p><el-checkbox label="username" checked>姓名</el-checkbox></p>
          <p><el-checkbox label="nickName" checked>昵称</el-checkbox></p>
          <p><el-checkbox label="mobile" checked>手机</el-checkbox></p>
          <p><el-checkbox label="email" checked>邮箱</el-checkbox></p>
          <p><el-checkbox label="address" checked>省市县地址</el-checkbox></p>
          <p><el-checkbox label="street" checked>街道地址</el-checkbox></p>
          <p><el-checkbox label="sex" checked>性别</el-checkbox></p>
          <p><el-checkbox label="status" checked>状态</el-checkbox></p>
          <p><el-checkbox label="description" checked>描述</el-checkbox></p>
          <p><el-checkbox label="createTime" checked>创建时间</el-checkbox></p>
        </el-checkbox-group>
        <el-button slot="reference" class="btn-default" size="small" icon="el-icon-edit">排版</el-button>
      </el-popover>

    </div>
    <el-table
      ref="table"
      v-loading="dataListLoading"
      :data="dataList"
      max-height="650"
      stripe
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
      />
      <el-table-column
        v-if="showField('avatar')"
        prop="avatar"
        label="头像"
        width="120"
        sortable
      >
        <template slot-scope="scope">
          <a :href="scope.row.avatar">
            <img width="30" height="30" :src="scope.row.avatar" alt="头像">
          </a>
        </template>

      </el-table-column>

      <el-table-column
        v-if="showField('username')"
        prop="username"
        label="姓名"
        width="150"
        sortable
      />
      <el-table-column
        v-if="showField('nickName')"
        prop="nickName"
        label="昵称"
        width="150"
        sortable
      />

      <el-table-column
        v-if="showField('mobile')"
        prop="mobile"
        label="手机"
        width="150"
        sortable
      />

      <el-table-column
        v-if="showField('email')"
        prop="email"
        label="邮箱"
        width="150"
        sortable
      />

      <el-table-column
        v-if="showField('sex')"
        prop="sex"
        label="性别"
        width="150"
        sortable
      />
      <el-table-column
        v-if="showField('status')"
        prop="status"
        label="用户状态"
        width="150"
        sortable
      />

      <el-table-column
        v-if="showField('description')"
        prop="description"
        label="备注"
        width="150"
        sortable
      />
      <el-table-column
        v-if="showField('address')"
        prop="address"
        label="省市县地址"
        width="250"
        sortable
      />

      <el-table-column
        v-if="showField('street')"
        prop="street"
        label="街道地址"
        width="250"
        sortable
      />

      <el-table-column
        v-if="showField('createTime')"
        prop="createTime"
        label="创建时间"
        width="180"
        sortable
      />

      <el-table-column
        fixed="right"
        label="操作"
        width="150"
      >
        <template slot-scope="scope">
          <el-button type="text" size="small">编辑</el-button>
          <el-button type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-warp">
      <el-pagination
        background
        layout="total ,sizes, prev, pager, next, jumper"
        :current-page="page.pageIndex"
        :page-size="page.pageSize"
        :total="page.total"
        :page-sizes="pageSizeList"
        style="float:right;"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </div>
  </div>
</template>

<script>
import tableMixin from '@/mixins/tableMixin'
import formMixin from '@/mixins/formMixin'
import { getUserByPageApi } from '@/api/user'
import commonUtil from '@/utils/common'

export default {
  name: 'User',
  mixins: [tableMixin, formMixin],
  data() {
    return {
      searchForm: {
        username: '',
        nickName: '',
        status: '',
        date: '',
        createDate: '',
        endDate: ''
      },
      checkFieldList: [], // 选中的字段
      multipleSelection: [],
      form: {
        user: '',
        region: '',
        date: ''
      }
    }
  },
  watch: {
    'searchForm.date'(val) {
      const startAndTime = commonUtil.getStartAndTime(val)
      this.searchForm.createDate = startAndTime[0]
      this.searchForm.endDate = startAndTime[1]
    }
  },
  created() {
    this.getDataList()
  },
  methods: {
    onSubmit() {
      console.log('submit!')
    },
    showField(name) {
      return this.checkFieldList.indexOf(name) > -1
    },
    handleSelectionChange(tableItem) {
      this.multipleSelection = tableItem.map(item => item.id)
    },
    // 重置表单
    handleResetFrom() {
      this.resetForm('searchForm')
      this.handleReset()
    },
    // 分页
    getDataList() {
      this.dataListLoading = true
      const params = { ...this.page, ...this.searchForm, ...{ a: 1 }}
      delete params.date
      getUserByPageApi(params).then(res => {
        this.dataListLoading = false
        if (res.code === this.$code) {
          this.dataList = res.result.records
          this.page.total = res.result.total
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

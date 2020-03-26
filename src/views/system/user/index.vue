<template>
  <div class="app-container user">
    <el-form :inline="true" :model="form" class="demo-form-inline" size="small">
      <el-form-item label="审批人">
        <el-input v-model="form.user" placeholder="审批人" />
      </el-form-item>
      <el-form-item label="活动区域">
        <el-select v-model="form.region" placeholder="活动区域">
          <el-option label="区域一" value="shanghai" />
          <el-option label="区域二" value="beijing" />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="form.date"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" type="primary">查询</el-button>
        <el-button icon="el-icon-refresh-right" type="success">重置</el-button>
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
          <p><el-checkbox label="name" checked>姓名</el-checkbox></p>
          <p><el-checkbox label="nickName" checked>昵称</el-checkbox></p>
          <p><el-checkbox label="mobile" checked>手机</el-checkbox></p>
          <p><el-checkbox label="email" checked>邮件</el-checkbox></p>
          <p><el-checkbox label="address" checked>省市县地址</el-checkbox></p>
          <p><el-checkbox label="street" checked>街道地址</el-checkbox></p>
          <p><el-checkbox label="sex" checked>性别</el-checkbox></p>
          <p><el-checkbox label="status" checked>状态</el-checkbox></p>
          <p><el-checkbox label="description" checked>描述</el-checkbox></p>
          <p><el-checkbox label="date" checked>时间</el-checkbox></p>
        </el-checkbox-group>
        <el-button slot="reference" class="btn-default" size="small" icon="el-icon-edit">排版</el-button>
      </el-popover>

    </div>
    <el-table
      ref="table"
      v-loading="dataListLoading"
      :data="dataList"
      max-height="650"
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
      />

      <el-table-column
        v-if="showField('username')"
        prop="username"
        label="姓名"
        sortable
      />
      <el-table-column
        v-if="showField('nickName')"
        prop="nickName"
        label="昵称"
        sortable
      />

      <el-table-column
        v-if="showField('mobile')"
        prop="mobile"
        label="手机"
        width="120"
        sortable
      />

      <el-table-column
        v-if="showField('email')"
        prop="email"
        label="邮件"
        width="120"
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
        v-if="showField('sex')"
        prop="sex"
        label="性别"
        width="120"
        sortable
      />
      <el-table-column
        v-if="showField('status')"
        prop="status"
        label="用户状态"
        width="120"
        sortable
      />

      <el-table-column
        v-if="showField('description')"
        prop="description"
        label="备注"
        width="120"
        sortable
      />

      <el-table-column
        v-if="showField('date')"
        prop="date"
        label="创建时间"
        width="180"
        sortable
      />

      <el-table-column
        fixed="right"
        label="操作"
        width="120"
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
        :page-sizes="[5, 10, 15, 20]"
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

export default {
  name: 'User',
  mixins: [tableMixin, formMixin],
  data() {
    return {
      form: {
        user: '',
        region: '',
        date: ''
      },
      checkFieldList: [], // 选中的字段
      multipleSelection: []
    }
  },
  methods: {
    onSubmit() {
      console.log('submit!')
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
    },
    showField(name) {
      return this.checkFieldList.indexOf(name) > -1
    },
    handleSelectionChange(tableItem) {
      this.multipleSelection = tableItem.map(item => item.id)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

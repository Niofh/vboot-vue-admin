<template>
  <div class="app-container user">
    <el-form ref="searchForm" :inline="true" :model="searchForm" class="demo-form-inline" size="small">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="searchForm.username" clearable placeholder="用户名" />
      </el-form-item>
      <el-form-item label="昵称" prop="nickName">
        <el-input v-model="searchForm.nickName" clearable placeholder="昵称" />
      </el-form-item>
      <el-form-item label="用户状态" prop="status">
        <el-select v-model="searchForm.status" placeholder="用户状态">
          <el-option v-for="status in statusDictList" :key="status.id" :label="status.name" :value="status.code" />
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
      <el-button v-permission="['add']" type="primary" size="small" icon="el-icon-plus" @click="openModal(CommonEnum.ADD.id)">新增</el-button>
      <el-button
        :disabled="multipleSelection.length===0"
        type="danger"
        size="small"
        icon="el-icon-delete"
        @click="userDelByIds"
      >删除
      </el-button>
      <el-button class="btn-default" size="small" icon="el-icon-refresh-left" @click="handleRefresh">刷新</el-button>
      <el-popover
        placement="right"
        trigger="click"
      >
        <!--排版-->
        <el-checkbox-group v-model="checkFieldList">
          <p>
            <el-checkbox label="avatar" checked>头像</el-checkbox>
          </p>
          <p>
            <el-checkbox label="username" checked>姓名</el-checkbox>
          </p>
          <p>
            <el-checkbox label="nickName" checked>昵称</el-checkbox>
          </p>
          <p>
            <el-checkbox label="mobile" checked>手机</el-checkbox>
          </p>
          <p>
            <el-checkbox label="email" checked>邮箱</el-checkbox>
          </p>
          <p>
            <el-checkbox label="address" checked>省市县地址</el-checkbox>
          </p>
          <p>
            <el-checkbox label="street" checked>街道地址</el-checkbox>
          </p>
          <p>
            <el-checkbox label="sex" checked>性别</el-checkbox>
          </p>
          <p>
            <el-checkbox label="status" checked>状态</el-checkbox>
          </p>
          <p>
            <el-checkbox label="description" checked>描述</el-checkbox>
          </p>
          <p>
            <el-checkbox label="createTime" checked>创建时间</el-checkbox>
          </p>
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
      @sort-change="handleSortChange"
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
      >
        <template slot-scope="scope">
          <a target="_blank" :href="scope.row.avatar">
            <img width="30" height="30" :src="scope.row.avatar" alt="头像">
          </a>
        </template>

      </el-table-column>

      <el-table-column
        v-if="showField('username')"
        prop="username"
        label="姓名"
        width="150"
        sortable="custom"
      />
      <el-table-column
        v-if="showField('nickName')"
        prop="nickName"
        label="昵称"
        width="150"
        sortable="custom"
      />

      <el-table-column
        v-if="showField('mobile')"
        prop="mobile"
        label="手机"
        width="150"
        sortable="custom"
      />

      <el-table-column
        v-if="showField('email')"
        prop="email"
        label="邮箱"
        width="150"
        sortable="custom"
      />

      <el-table-column
        v-if="showField('sex')"
        prop="sex"
        label="性别"
        width="150"
        sortable="custom"
      >
        <template slot-scope="scope">
          {{ scope.row.sex | dictFilter(sexDictList) }}
        </template>
      </el-table-column>
      <el-table-column
        v-if="showField('status')"
        prop="status"
        label="用户状态"
        width="150"
        sortable="custom"
      >
        <template slot-scope="scope">
          {{ scope.row.status | dictFilter(statusDictList) }}
        </template>
      </el-table-column>

      <el-table-column
        v-if="showField('description')"
        prop="description"
        label="备注"
        width="150"
      />
      <el-table-column
        v-if="showField('address')"
        prop="address"
        label="省市县地址"
        width="250"
      />

      <el-table-column
        v-if="showField('street')"
        prop="street"
        label="街道地址"
        width="250"
      />

      <el-table-column
        v-if="showField('createTime')"
        prop="createTime"
        label="创建时间"
        width="180"
      />

      <el-table-column
        fixed="right"
        label="操作"
        width="150"
      >
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="openEditModal(scope.row)">编辑</el-button>
          <el-button type="text" size="small" @click="userDelByIds(scope.row.id)">删除</el-button>
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

    <el-dialog
      :modal-append-to-body="false"
      width="700px"
      top="5vh"
      :close-on-click-modal="false"
      :title="dialogTitle+'用户'"
      :visible.sync="dialogFormVisible"
      @closed="resetForm('ruleForm')"
    >

      <el-form ref="ruleForm" :model="form" :rules="rules" :label-width="formLabelWidth" size="small">
        <el-form-item v-show="false" prop="id" label="id" />
        <el-row :gutter="5">
          <el-col :span="12">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="form.username" :disabled="dialogType===CommonEnum.UPDATE.id" autocomplete="off" />
            </el-form-item>
          </el-col>
          <el-col v-if="dialogType===CommonEnum.ADD.id" :span="12">
            <el-form-item label="密码" prop="password">
              <el-input v-model="form.password" autocomplete="off" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="昵称" prop="nickName">
              <el-input v-model="form.nickName" autocomplete="off" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机" prop="mobile">
              <el-input v-model="form.mobile" autocomplete="off" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" autocomplete="off" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属部门" prop="departmentTitle">
              <el-popover
                placement="right"
                width="300"
                trigger="click"
              >
                <el-tree
                  ref="depTree"
                  empty-text="暂无数据"
                  class="filter-tree"
                  node-key="id"
                  default-expand-all
                  :data="getDepTree"
                  :props="defaultProps"
                  :filter-node-method="filterNode"
                  :current-node-key="form.departmentId"
                  :expand-on-click-node="false"
                  :highlight-current="true"
                  @node-click="menuNodeClick"
                />
                <el-input slot="reference" v-model="form.departmentTitle" readonly autocomplete="off" />
              </el-popover>
            </el-form-item>
          </el-col>

          <el-col :span="12" style="height: 51px">
            <el-form-item label="性别" prop="sex">
              <el-radio-group v-model="form.sex">
                <el-radio :label="1">男</el-radio>
                <el-radio :label="0">女</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="height: 51px">
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="form.status">
                <el-radio :label="-1">禁用</el-radio>
                <el-radio :label="0">启动</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24" style="height: 51px;margin-bottom: 0px;">
            <el-form-item label="所属角色">
              <el-select v-model="roleIds" multiple placeholder="请选择" style="width: 100%;">
                <el-option
                  v-for="item in roleList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="省市县地址" prop="address">
              <el-input v-model="form.address" type="textarea" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="街道地址" prop="street">
              <el-input v-model="form.street" type="textarea" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="描述" prop="description">
              <el-input v-model="form.description" type="textarea" />
            </el-form-item>
          </el-col>

        </el-row>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" :loading="loading" @click="handleConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import tableMixin from '@/mixins/tableMixin'
import formMixin from '@/mixins/formMixin'
import { getUserById, getUserByPageApi, userDelByIdsApi, userSaveBaseApi, userUpdateBaseApi } from '@/api/user'
import commonUtil from '@/utils/common'
import CommonEnum from '@/enum/CommonEnum'
import { mapState } from 'vuex'
import { getRoleAllBaseApi } from '@/api/role'
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
        id: '',
        username: '',
        password: '',
        nickName: '',
        mobile: '',
        email: '',
        address: '',
        street: '',
        sex: 1,
        status: -1,
        description: '',
        departmentId: '',
        departmentTitle: ''
      },
      rules: {
        username: [
          { required: true, message: '这是必填项', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '这是必填项', trigger: 'blur' }
        ],
        nickName: [
          { required: true, message: '这是必填项', trigger: 'blur' }
        ]
      },
      dialogFormVisible: false,
      formLabelWidth: '120px',
      dialogType: CommonEnum.ADD.id,
      dialogTitle: CommonEnum.ADD.value,
      CommonEnum: CommonEnum,
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      roleList: [],
      roleIds: []
    }
  },
  computed: {
    getDepTree() {
      return this.$store.getters['dep/getDepTree']
    },
    ...mapState({
      depList: state => state.dep.depList,
      sexDictList: state => state.dict.sexDictList,
      statusDictList: state => state.dict.statusDictList
    })
  },
  watch: {
    'searchForm.date'(val) {
      const startAndTime = commonUtil.getStartAndTime(val)
      console.log('startAndTime', startAndTime)
      this.searchForm.createDate = startAndTime[0]
      this.searchForm.endDate = startAndTime[1]
    }
  },
  created() {
    this.getSexDictList()
    this.getStatusDictList()
    this.getDataList()
    this.getAllDepartment()
    this.getRoleAll()
    console.log(this.$route)
  },
  methods: {
    getSexDictList() {
      this.$store.dispatch('dict/getSexDictList')
    },
    getStatusDictList() {
      this.$store.dispatch('dict/getStatusDictList')
    },
    // 判断是否存在排版里面
    showField(name) {
      return this.checkFieldList.indexOf(name) > -1
    },
    // 全选
    handleSelectionChange(tableItem) {
      this.multipleSelection = tableItem.map(item => item.id)
    },
    // 重置表单
    handleResetFrom() {
      this.searchForm.createDate = ''
      this.searchForm.endDate = ''
      this.resetForm('searchForm')
      this.handleReset()
    },
    // 分页
    getDataList() {
      this.dataListLoading = true
      const params = { ...this.page, ...this.searchForm }
      delete params.date
      getUserByPageApi(params).then(res => {
        this.dataListLoading = false
        if (res.code === this.$code) {
          this.dataList = res.result.records
          this.page.total = res.result.total
        }
      })
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
    // 打开弹出框
    openModal(type) {
      this.dialogFormVisible = true
      this.dialogType = type
      this.dialogTitle = type === CommonEnum.ADD.id ? CommonEnum.ADD.value : CommonEnum.UPDATE.value
    },
    // 修改弹出框
    openEditModal(tableItem) {
      getUserById(tableItem.id).then(res => {
        if (res.code === this.$code) {
          this.form = res.result
          this.form.password = ''
          this.roleIds = res.result.roleIds
          if (this.form.departmentId) {
            // 设置部门名称
            let title
            for (let i = 0; i < this.depList.length; i++) {
              const item = this.depList[i]
              if (item.id === this.form.departmentId) {
                title = item.title
                break
              }
            }
            this.$set(this.form, 'departmentTitle', title)
          }
        }
      })
      this.openModal(CommonEnum.UPDATE.id)
    },
    // 添加用户
    userSaveBase() {
      this.loading = true
      this.form.roleIds = this.roleIds.toString()
      userSaveBaseApi(this.form).then(res => {
        if (res.code === this.$code) {
          this.getDataList()
          this.closeModal()
          this.$message.success('添加成功')
        }
      }).finally(() => {
        this.loading = false
      })
    },
    // 更新用户
    userUpdateBase() {
      this.loading = true
      this.form.roleIds = this.roleIds.toString()
      userUpdateBaseApi(this.form).then(res => {
        if (res.code === this.$code) {
          this.getDataList()
          this.closeModal()
          this.$message.success('更新成功')
        }
      }).finally(() => {
        this.loading = false
      })
    },
    // 删除
    userDelByIds(id) {
      let ids = this.multipleSelection.toString()
      if (ids.length === 0) {
        ids = id
      }
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        userDelByIdsApi({
          ids: ids
        }).then(res => {
          if (res.code === this.$code) {
            this.getDataList()
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          } else {
            this.$message({
              type: 'error',
              message: res.message
            })
          }
        })
      })
    },
    // 提交数据
    handleConfirm() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          if (this.dialogType === CommonEnum.ADD.id) {
            this.userSaveBase()
          } else {
            this.userUpdateBase()
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 获取部门
    getAllDepartment() {
      if (this.getDepTree.length === 0) {
        this.$store.dispatch('dep/getAllDepartment')
      }
    },
    filterNode(value, data) {
      if (!value) return true
      return data.title.indexOf(value) !== -1
    },
    menuNodeClick(node) {
      this.form.departmentTitle = node.title
      this.form.departmentId = node.id
    },
    // 获取角色
    getRoleAll() {
      getRoleAllBaseApi().then(res => {
        if (res.code === this.$code) {
          this.roleList = res.result
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

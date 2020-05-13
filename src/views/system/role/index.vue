<template>
  <div class="app-container">
    <el-form ref="searchForm" :inline="true" :model="searchForm" class="demo-form-inline" size="small">
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="searchForm.name" clearable placeholder="角色名称" />
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
      <el-button type="primary" size="small" icon="el-icon-plus" @click="openModal(CommonEnum.ADD.id)">新增</el-button>
      <el-button
        :disabled="multipleSelection.length===0"
        type="danger"
        size="small"
        icon="el-icon-delete"
        @click="delRoleByIds"
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
            <el-checkbox label="name" checked>角色名称</el-checkbox>
          </p>
          <p>
            <el-checkbox label="defaultRole" checked>默认角色</el-checkbox>
          </p>
          <p>
            <el-checkbox label="dataType" checked>部门权限类型</el-checkbox>
          </p>
          <p>
            <el-checkbox label="description" checked>备注</el-checkbox>
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
        v-if="showField('name')"
        prop="name"
        label="角色名称"
        width="150"
        sortable
      />
      <el-table-column
        v-if="showField('defaultRole')"
        prop="defaultRole"
        label="默认角色"
        width="150"
        sortable="custom"
      >
        <template slot-scope="scope">
          <el-tag :type="scope.row.defaultRole?'success':''">{{ scope.row.defaultRole?'是':'否' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        v-if="showField('dataType')"
        prop="dataType"
        label="部门权限类型"
        width="150"
        sortable="custom"
      >
        <template slot-scope="scope">
          {{ scope.row.dataType | dictFilter(authorityDictList) }}
        </template>
      </el-table-column>
      <el-table-column
        v-if="showField('description')"
        prop="description"
        label="备注"
      />
      <el-table-column
        v-if="showField('createTime')"
        prop="createTime"
        label="创建时间"
        width="180"
        sortable="custom"
      />
      <el-table-column
        fixed="right"
        label="操作"
        width="200"
      >
        <template slot-scope="scope">
          <el-button type="text" @click="handleOpenTree(scope.row)">编辑权限</el-button>
          <el-button type="text" size="small" @click="openEditModal(scope.row)">编辑</el-button>
          <el-button type="text" size="small" @click="delRoleByIds(scope.row.id)">删除</el-button>
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
      :title="dialogTitle+'角色表'"
      :visible.sync="dialogFormVisible"
      @closed="resetForm('ruleForm')"
    >

      <el-form ref="ruleForm" :model="form" :rules="rules" :label-width="formLabelWidth" size="small">

        <el-row :gutter="5">
          <el-form-item v-show="false" prop="id" label="id" />
          <el-col :span="12" style="height: 51px;margin-bottom: 0px;">
            <el-form-item label="角色名称" prop="name">
              <el-input v-model="form.name" autocomplete="off" />
            </el-form-item>
          </el-col>

          <el-col :span="12" style="height: 51px">
            <el-form-item label="默认角色" prop="defaultRole">
              <el-radio-group v-model="form.defaultRole">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
              <el-form-item />
            </el-form-item>
          </el-col>

          <el-col :span="12" style="height: 51px;margin-bottom: 0px;">
            <el-form-item label="部门权限类型" prop="dataType">
              <el-select v-model="form.dataType" placeholder="请选择数据权限类型">
                <el-option label="请选择数据权限类型" value="" />
                <el-option
                  v-for="authority in authorityDictList"
                  :key="authority.id"
                  :label="authority.name"
                  :value="authority.code"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="备注" prop="description">
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

    <el-dialog
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      width="700px"
      top="5vh"
      title="赋值菜单权限"
      :visible.sync="dialogTreeVisible"
    >
      <el-button size="small" type="primary" @click="handleCheckAll">全选</el-button>
      <el-button size="small" @click="handleCancelAll">取消全选</el-button>
      <div class="tree-wrap">
        <el-tree
          ref="tree"
          empty-text="暂无数据"
          class="filter-tree"
          node-key="id"
          default-expand-all
          :data="menuData"
          :props="defaultProps"
          :current-node-key="form.parentId"
          :expand-on-click-node="false"
          :highlight-current="true"
          show-checkbox
          :check-strictly="true"
        />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTreeVisible = false">取 消</el-button>
        <el-button type="primary" :loading="loading" @click="handleConfirmTree">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import tableMixin from '@/mixins/tableMixin'
import formMixin from '@/mixins/formMixin'
import {
  getRoleById,
  roleDelByIdsApi,
  roleSaveBaseApi,
  roleUpdateBaseApi,
  getRoleByPageApi,
  getPermission,
  setPermission
} from '@/api/role'
import commonUtil from '@/utils/common'
import CommonEnum from '@/enum/CommonEnum'
import { mapState } from 'vuex'
import treeDeepUtil from '@/utils/treeDeepUtil'
import { getAllPermissionApi } from '@/api/permission'

export default {
  name: 'Role',
  mixins: [tableMixin, formMixin],
  data() {
    return {
      searchForm: {
        name: '',
        date: '',
        createDate: '',
        endDate: ''
      },
      checkFieldList: [], // 选中的字段
      multipleSelection: [],
      form: {
        id: '',
        name: '',
        defaultRole: '',
        dataType: '',
        description: ''
      },
      rules: {
        name: [
          { required: true, message: '这是必填项', trigger: 'blur' }
        ],
        dataType: [
          { required: true, message: '请选择数据权限类型', trigger: 'change' }
        ]
      },
      dialogFormVisible: false,
      formLabelWidth: '120px',
      dialogType: CommonEnum.ADD.id,
      dialogTitle: CommonEnum.ADD.value,
      CommonEnum: CommonEnum,
      dialogTreeVisible: false,
      permissionList: [],
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      roleId: ''
    }
  },
  computed: {

    ...mapState({
      authorityDictList: state => state.dict.authorityDictList
    }),
    menuData() {
      const menu = JSON.parse(JSON.stringify(this.permissionList))
      return treeDeepUtil.fommatTree(menu)
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
    this.getDict()
    this.getDataList()
    this.getAllPermission()
  },
  methods: {
    getDict() {
      this.$store.dispatch('dict/getAuthorityDictList')
    },

    // 判断是否存在排版里面
    showField(name) {
      return this.checkFieldList.indexOf(name) > -1
    },
    // 全选d
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
      getRoleByPageApi(params).then(res => {
        this.dataListLoading = false
        if (res.code === this.$code) {
          this.dataList = res.result.records
          this.page.total = res.result.total
        }
      })
    },
    // 打开弹出框
    openModal(type) {
      this.dialogFormVisible = true
      this.dialogType = type
      this.dialogTitle = type === CommonEnum.ADD.id ? CommonEnum.ADD.value : CommonEnum.UPDATE.value
    },
    // 修改弹出框
    openEditModal(tableItem) {
      getRoleById(tableItem.id).then(res => {
        if (res.code === this.$code) {
          this.form = res.result
        }
      })
      this.openModal(CommonEnum.UPDATE.id)
    },
    // 添加
    saveRoleBase() {
      this.loading = true
      roleSaveBaseApi(this.form).then(res => {
        if (res.code === this.$code) {
          this.getDataList()
          this.closeModal()
          this.$message.success('添加成功')
        }
      }).finally(() => {
        this.loading = false
      })
    },
    // 更新
    updateRoleBase() {
      this.loading = true
      roleUpdateBaseApi(this.form).then(res => {
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
    delRoleByIds(id) {
      let ids = this.multipleSelection.toString()
      if (ids.length === 0) {
        ids = id
      }
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        roleDelByIdsApi({
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
            this.saveRoleBase()
          } else {
            this.updateRoleBase()
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 获取所有权限
    getAllPermission() {
      getAllPermissionApi().then(res => {
        if (res.code === this.$code) {
          this.permissionList = res.result
        }
      })
    },
    // 编辑权限
    handleOpenTree(item) {
      this.dialogTreeVisible = true
      this.roleId = item.id
      getPermission({ roleId: item.id }).then(res => {
        if (res.code === this.$code) {
          this.permission = res.result
          this.$refs.tree.setCheckedKeys(this.permission)
        }
      })
    },
    // 全选
    handleCheckAll() {
      this.permission = this.permissionList.map(item => item.id)
      this.$refs.tree.setCheckedKeys(this.permission)
    },
    // 取消全选
    handleCancelAll() {
      this.permission = []
      this.$refs.tree.setCheckedKeys(this.permission)
    },
    handleConfirmTree() {
      setPermission({
        roleId: this.roleId,
        permissionIds: this.$refs.tree.getCheckedKeys().toString()
      }).then(res => {
        if (res.code === this.$code) {
          this.$message.success('权限赋值成功')
          this.dialogTreeVisible = false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.tree-wrap{
  max-height: 650px;
  overflow-y: auto;
}
</style>

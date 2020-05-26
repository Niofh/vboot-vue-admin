<template>
  <div class="app-container">
    <div class="btns-wrap">
      <el-button type="primary" size="small" icon="el-icon-plus" @click="openModal(CommonEnum.ADD.id)">新增</el-button>
      <el-button
        :disabled="multipleSelection.length===0"
        type="danger"
        size="small"
        icon="el-icon-delete"
        @click="delDepartmentByIds"
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
            <el-checkbox label="title" checked>部门名称</el-checkbox>
          </p>
          <p>
            <el-checkbox label="sort" checked>排序值</el-checkbox>
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
      row-key="id"
      border
      default-expand-all
      :tree-props="{children: 'children'}"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
      />
      <el-table-column
        v-if="showField('title')"
        prop="title"
        label="部门名称"
        sortable
      />
      <el-table-column
        v-if="showField('status')"
        prop="status"
        label="状态"
        width="150"
        sortable
      >
        <template slot-scope="scope">
          {{ scope.row.status | dictFilter(statusDictList) }}
        </template>
      </el-table-column>

      <el-table-column
        v-if="showField('description')"
        prop="description"
        label="描述"
        sortable
      />
      <el-table-column
        v-if="showField('sort')"
        prop="sort"
        label="排序值"
        width="150"
        sortable
      />
      <el-table-column
        v-if="showField('createTime')"
        prop="createTime"
        label="创建时间"
        sortable
      />
      <el-table-column
        fixed="right"
        label="操作"
        width="150"
      >
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="openEditModal(scope.row)">编辑</el-button>
          <el-button type="text" size="small" @click="delDepartmentByIds(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :modal-append-to-body="false"
      width="700px"
      top="5vh"
      :close-on-click-modal="false"
      :title="dialogTitle+'部门表'"
      :visible.sync="dialogFormVisible"
      @closed="resetForm('ruleForm')"
    >

      <el-form ref="ruleForm" :model="form" :rules="rules" :label-width="formLabelWidth" size="small">

        <el-row :gutter="5">
          <el-form-item v-show="false" prop="id" label="id" />
          <el-form-item v-show="false" prop="parentTitle" label="parentTitle" />
          <el-col :span="12" style="height: 51px;margin-bottom: 0px;">
            <el-form-item label="部门名称" prop="title">
              <el-input v-model="form.title" autocomplete="off" />
            </el-form-item>
          </el-col>

          <el-col :span="12" style="height: 51px;margin-bottom: 0px;">
            <el-form-item label="上级菜单" prop="parentId">
              <el-popover
                placement="right"
                width="300"
                trigger="click"
              >
                <el-tree
                  ref="tree"
                  empty-text="暂无数据"
                  class="filter-tree"
                  node-key="id"
                  default-expand-all
                  :data="treeData"
                  :props="defaultProps"
                  :current-node-key="form.parentId"
                  :expand-on-click-node="false"
                  :highlight-current="true"
                  :check-on-click-node="true"
                  @node-click="menuNodeClick"
                />
                <el-input
                  slot="reference"
                  v-model="form.parentTitle"
                  placeholder="请选择上级菜单"
                  readonly
                  autocomplete="off"
                />
              </el-popover>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="排序值" prop="sort">
              <el-input-number v-model="form.sort" :step="0.1" :min="1" :max="10" label="排序值" />
            </el-form-item>
          </el-col>

          <el-col :span="12" style="height: 51px;margin-bottom: 0px;">
            <el-form-item label="状态" prop="status">
              <el-select v-model="form.status" placeholder="请选择状态">
                <el-option label="请选择状态" value="" />
                <el-option v-for="status in statusDictList" :key="status.id" :label="status.name" :value="status.code" />
              </el-select>
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
import {
  getDepartmentById,
  departmentDelByIdsApi,
  departmentSaveBaseApi,
  departmentUpdateBaseApi,
  getDepartmentAllBaseApi
} from '@/api/department'
import commonUtil from '@/utils/common'
import CommonEnum from '@/enum/CommonEnum'
import { mapState } from 'vuex'
import treeDeepUtil from '@/utils/treeDeepUtil'

export default {
  name: 'Department',
  mixins: [tableMixin, formMixin],
  data() {
    return {
      searchForm: {
        title: '',
        status: '',
        date: '',
        createDate: '',
        endDate: ''
      },
      checkFieldList: [], // 选中的字段
      multipleSelection: [],
      form: {
        id: '',
        title: '',
        parentId: '',
        sort: '',
        status: '',
        description: '',
        parentTitle: ''
      },
      rules: {
        title: [
          { required: true, message: '这是必填项', trigger: 'blur' }
        ],
        parentId: [
          { required: true, message: '请选择上级菜单', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
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
      oldData: []
    }
  },
  computed: {

    ...mapState({
      statusDictList: state => state.dict.statusDictList
    }),
    treeData() {
      return [{ id: '0', title: '一级菜单' }].concat(this.dataList)
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
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.title.indexOf(value) !== -1
    },
    menuNodeClick(node) {
      this.form.parentTitle = node.title
      this.form.parentId = node.id
    },
    getDict() {
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
      getDepartmentAllBaseApi().then(res => {
        this.dataListLoading = false
        if (res.code === this.$code) {
          this.dataList = treeDeepUtil.fommatTree(res.data)
          this.oldData = res.data
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
      getDepartmentById(tableItem.id).then(res => {
        if (res.code === this.$code) {
          this.form = res.data
          for (let i = 0; i < this.oldData.length; i++) {
            const item = this.oldData[i]
            if (item.id === this.form.parentId) {
              this.form.parentTitle = item.title
              break
            } else if (this.form.parentId === '0') {
              this.form.parentTitle = '一级菜单'
              break
            }
          }
          this.$nextTick(function() {
            this.$refs['tree'].setCurrentKey(this.form.parentId)
          })
        }
      })
      this.openModal(CommonEnum.UPDATE.id)
    },
    // 添加
    saveDepartmentBase() {
      this.loading = true
      departmentSaveBaseApi(this.form).then(res => {
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
    updateDepartmentBase() {
      this.loading = true
      departmentUpdateBaseApi(this.form).then(res => {
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
    delDepartmentByIds(id) {
      let ids = this.multipleSelection.toString()
      if (ids.length === 0) {
        ids = id
      }
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        departmentDelByIdsApi({
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
            this.saveDepartmentBase()
          } else {
            this.updateDepartmentBase()
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .tree-content {
    margin-top: 30px;

    .tree-bar {
      margin-top: 10px;
      max-height: 680px;
      height: 680px;
      overflow-y: auto;
      user-select: none;
    }
  }
</style>

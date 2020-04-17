<template>
  <div class="app-container user">
    <el-form ref="searchForm" :inline="true" :model="searchForm" class="demo-form-inline" size="small">
      <el-form-item label="字典名称" prop="name">
        <el-input v-model="searchForm.name" clearable placeholder="字典名称" />
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" type="primary" :disabled="!dictId" @click="handleSearch">查询</el-button>
        <el-button icon="el-icon-refresh-right" type="success" :disabled="!dictId" @click="handleResetFrom">重置
        </el-button>
      </el-form-item>
    </el-form>
    <div class="btns-wrap">
      <el-button
        type="primary"
        size="small"
        icon="el-icon-plus"
        :disabled="!dictId"
        @click="openModal(CommonEnum.ADD.id)"
      >新增
      </el-button>
      <el-button
        :disabled="multipleSelection.length===0"
        type="danger"
        size="small"
        icon="el-icon-delete"
        @click="delDictDetailByIds"
      >删除
      </el-button>
      <el-button
        class="btn-default"
        size="small"
        icon="el-icon-refresh-left"
        :disabled="!dictId"
        @click="handleRefresh"
      >刷新
      </el-button>
      <el-popover
        placement="right"
        trigger="click"
      >
        <!--排版-->
        <el-checkbox-group v-model="checkFieldList">
          <p>
            <el-checkbox label="name" checked>字典名称</el-checkbox>
          </p>
          <p>
            <el-checkbox label="code" checked>字典值</el-checkbox>
          </p>
          <p>
            <el-checkbox label="sort" checked>排序</el-checkbox>
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
      size="small"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
      />
      <el-table-column
        v-if="showField('name')"
        prop="name"
        label="字典名称"
      />
      <el-table-column
        v-if="showField('code')"
        prop="code"
        label="字典值"
      />
      <el-table-column
        v-if="showField('sort')"
        prop="sort"
        label="排序"
      />
      <el-table-column
        fixed="right"
        label="操作"
        width="150"
      >
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="openEditModal(scope.row)">编辑</el-button>
          <el-button type="text" size="small" @click="delDictDetailByIds(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :modal-append-to-body="false"
      width="700px"
      top="5vh"
      :close-on-click-modal="false"
      :title="dialogTitle+'字典详情表'"
      :visible.sync="dialogFormVisible"
      @closed="resetForm('ruleForm')"
    >

      <el-form ref="ruleForm" :model="form" :rules="rules" :label-width="formLabelWidth" size="small">

        <el-row :gutter="5">
          <el-form-item v-show="false" prop="id" label="id" />
          <el-col :span="12" style="height: 51px;margin-bottom: 0px;">
            <el-form-item label="字典名称" prop="name">
              <el-input v-model="form.name" autocomplete="off" />
            </el-form-item>
          </el-col>

          <el-col :span="12" style="height: 51px;margin-bottom: 0px;">
            <el-form-item label="字典值" prop="code">
              <el-input v-model="form.code" autocomplete="off" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="排序" prop="sort">
              <el-input-number v-model="form.sort" :step="0.1" :min="1" :max="10" label="排序" />
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
  getDictDetailById,
  dictDetailDelByIdsApi,
  dictDetailSaveBaseApi,
  dictDetailUpdateBaseApi,
  getDictDetailByPageApi, getDictDetailByDictIdApi
} from '@/api/dictDetail'
import commonUtil from '@/utils/common'
import CommonEnum from '@/enum/CommonEnum'

export default {
  name: 'DictDetail',
  mixins: [tableMixin, formMixin],
  props: {
    dictId: {
      type: String,
      default: ''
    }
  },
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
        dictId: '',
        name: '',
        code: '',
        sort: ''
      },
      rules: {
        name: [
          { required: true, message: '这是必填项', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '这是必填项', trigger: 'blur' }
        ]
      },
      dialogFormVisible: false,
      formLabelWidth: '120px',
      dialogType: CommonEnum.ADD.id,
      dialogTitle: CommonEnum.ADD.value,
      CommonEnum: CommonEnum
    }
  },
  computed: {},
  watch: {
    'searchForm.date'(val) {
      const startAndTime = commonUtil.getStartAndTime(val)
      this.searchForm.createDate = startAndTime[0]
      this.searchForm.endDate = startAndTime[1]
    }
  },
  methods: {
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
      const params = { ...this.searchForm }
      delete params.date
      params.dictId = this.dictId
      console.log(params)
      getDictDetailByDictIdApi(params).then(res => {
        this.dataListLoading = false
        if (res.code === this.$code) {
          this.dataList = res.result
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
      getDictDetailById(tableItem.id).then(res => {
        if (res.code === this.$code) {
          this.form = res.result
        }
      })
      this.openModal(CommonEnum.UPDATE.id)
    },
    // 添加
    saveDictDetailBase() {
      this.loading = true
      this.form.dictId = this.dictId
      dictDetailSaveBaseApi(this.form).then(res => {
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
    updateDictDetailBase() {
      this.loading = true
      dictDetailUpdateBaseApi(this.form).then(res => {
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
    delDictDetailByIds(id) {
      let ids = this.multipleSelection.toString()
      if (ids.length === 0) {
        ids = id
      }
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        dictDetailDelByIdsApi({
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
            this.saveDictDetailBase()
          } else {
            this.updateDictDetailBase()
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

</style>

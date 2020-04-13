<template>
  <div class="app-container user">

    <el-row :gutter="10">
      <el-col :sm="24" :md="10">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>字典列表</span>
          </div>
          <el-form ref="searchForm" :inline="true" :model="searchForm" class="demo-form-inline" size="small">
            <el-form-item label="字典名称" prop="dicName">
              <el-input v-model="searchForm.dicName" clearable placeholder="字典名称" />
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
              @click="delDictByIds"
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
                  <el-checkbox label="dicName" checked>字典名称</el-checkbox>
                </p>
                <p>
                  <el-checkbox label="dicKey" checked>字典Key</el-checkbox>
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
            highlight-current-row
            @selection-change="handleSelectionChange"
            @cell-click="handleCellClick"
          >
            <el-table-column
              type="selection"
              width="55"
            />
            <el-table-column
              v-if="showField('dicName')"
              prop="dicName"
              label="字典名称"
            />
            <el-table-column
              v-if="showField('dicKey')"
              prop="dicKey"
              label="字典Key"
            />
            <el-table-column
              fixed="right"
              label="操作"
              width="100"
            >
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="openEditModal(scope.row)">编辑</el-button>
                <el-button type="text" size="small" @click="delDictByIds(scope.row.id)">删除</el-button>
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
        </el-card>
      </el-col>
      <el-col :sm="24" :md="14">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>字典详情</span>
          </div>
          <DictDetail ref="dictDetail" :dict-id="cellClickId" />
        </el-card>
      </el-col>

    </el-row>

    <el-dialog
      :modal-append-to-body="false"
      width="700px"
      top="5vh"
      :close-on-click-modal="false"
      :title="dialogTitle+'字典'"
      :visible.sync="dialogFormVisible"
      @closed="resetForm('ruleForm')"
    >

      <el-form ref="ruleForm" :model="form" :rules="rules" :label-width="formLabelWidth" size="small">

        <el-row :gutter="5">
          <el-col :span="12">
            <el-form-item label="字典名称" prop="dicName">
              <el-input v-model="form.dicName" autocomplete="off" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="字典Key" prop="dicKey">
              <el-input v-model="form.dicKey" autocomplete="off" />
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
import { getDictById, dictDelByIdsApi, dictSaveBaseApi, dictUpdateBaseApi, getDictByPageApi } from '@/api/dict'
import commonUtil from '@/utils/common'
import CommonEnum from '@/enum/CommonEnum'
import DictDetail from './dictDetail'
export default {
  name: 'Dict',
  components: {
    DictDetail
  },
  mixins: [tableMixin, formMixin],
  data() {
    return {
      searchForm: {
        dicName: '',
        dicKey: '',
        date: '',
        createDate: '',
        endDate: ''
      },
      checkFieldList: [], // 选中的字段
      multipleSelection: [],
      form: {
        dicName: '',

        dicKey: ''

      },
      rules: {
        dicName: [
          { required: true, message: '这是必填项', trigger: 'blur' }
        ],
        dicKey: [
          { required: true, message: '这是必填项', trigger: 'blur' }
        ]
      },
      dialogFormVisible: false,
      formLabelWidth: '120px',
      dialogType: CommonEnum.ADD.id,
      dialogTitle: CommonEnum.ADD.value,
      CommonEnum: CommonEnum,
      cellClickId: ''
    }
  },
  computed: {

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
    handleCellClick(row, column, cell, event) {
      this.cellClickId = row.id
      console.log(this.cellClickId)
      this.$refs.dictDetail.getDataList()
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
      getDictByPageApi(params).then(res => {
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
      getDictById(tableItem.id).then(res => {
        if (res.code === this.$code) {
          this.form = res.result
        }
      })
      this.openModal(CommonEnum.UPDATE.id)
    },
    // 添加
    saveDictBase() {
      this.loading = true
      dictSaveBaseApi(this.form).then(res => {
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
    updateDictBase() {
      this.loading = true
      dictUpdateBaseApi(this.form).then(res => {
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
    delDictByIds(id) {
      let ids = this.multipleSelection.toString()
      if (ids.length === 0) {
        ids = id
      }
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        dictDelByIdsApi({
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
            this.saveDictBase()
          } else {
            this.updateDictBase()
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
.box-card{
  margin-bottom: 20px;
}
</style>

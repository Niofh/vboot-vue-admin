<template>
  <div class="app-container">
    <el-form ref="searchForm" :inline="true" :model="searchForm" class="demo-form-inline" size="small">
      <el-form-item label="标题" prop="title">
        <el-input v-model="searchForm.title" clearable placeholder="标题" />
      </el-form-item>
      <el-form-item label="消息类型" prop="msgType">
        <el-select v-model="searchForm.msgType" placeholder="消息类型">
          <el-option v-for="msgType in msgTypeDictList" :key="msgType.id" :label="msgType.name" :value="msgType.code" />
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
      <el-button type="primary" size="small" icon="el-icon-plus" @click="openModal(CommonEnum.ADD.id)">新增</el-button>
      <el-button
        :disabled="multipleSelection.length===0"
        type="danger"
        size="small"
        icon="el-icon-delete"
        @click="delMessageByIds"
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
            <el-checkbox label="title" checked>标题</el-checkbox>
          </p>
          <p>
            <el-checkbox label="content" checked>文章内容</el-checkbox>
          </p>
          <p>
            <el-checkbox label="msgType" checked>消息类型</el-checkbox>
          </p>
          <p>
            <el-checkbox label="createUserSend" checked>新账号是否发送消息</el-checkbox>
          </p>
          <p>
            <el-checkbox label="createTime" checked disabled>创建时间</el-checkbox>
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
    >
      <el-table-column
        type="selection"
        width="55"
      />
      <el-table-column
        v-if="showField('title')"
        prop="title"
        label="标题"
        width="150"
        sortable
      />

      <el-table-column
        v-if="showField('createUserSend')"
        prop="createUserSend"
        label="新账号是否发送"
        sortable
        width="150"
      >
        <template slot-scope="scope">
          {{ scope.row.createUserSend | flagFilter }}
        </template>
      </el-table-column>
      <el-table-column
        v-if="showField('msgType')"
        prop="msgType"
        label="消息类型"
        sortable
        width="100"
      >
        <template slot-scope="scope">
          {{ scope.row.msgType | dictFilter(msgTypeDictList) }}
        </template>
      </el-table-column>
      <el-table-column
        v-if="showField('content')"
        prop="content"
        label="文章内容"
        sortable
        :show-overflow-tooltip="true"
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
          <el-button style="color: #13ce66" type="text" size="small" @click="">发送消息</el-button>
          <el-button type="text" size="small" @click="openEditModal(scope.row)">编辑</el-button>
          <el-button type="text" size="small" @click="delMessageByIds(scope.row.id)">删除</el-button>
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
      :title="dialogTitle+'消息'"
      :visible.sync="dialogFormVisible"
      @closed="resetForm('ruleForm')"
    >

      <el-form ref="ruleForm" :model="form" :rules="rules" :label-width="formLabelWidth" size="small">

        <el-row :gutter="5">
          <el-form-item v-show="false" prop="id" label="id" />
          <el-col :span="12" style="height: 51px;margin-bottom: 0px;">
            <el-form-item label="标题" prop="title">
              <el-input v-model="form.title" autocomplete="off" />
            </el-form-item>
          </el-col>

          <el-col :span="12" style="height: 51px;margin-bottom: 0px;">
            <el-form-item label="消息类型" prop="msgType">
              <el-select v-model="form.msgType" placeholder="请选择消息类型">
                <el-option label="请选择消息类型" value="" />
                <el-option v-for="msgType in msgTypeDictList" :key="msgType.id" :label="msgType.name" :value="msgType.code" />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12" style="height: 51px">
            <el-form-item label="新账号是否发送" prop="createUserSend">
              <el-radio-group v-model="form.createUserSend">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
              <el-form-item />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="height: 51px">
            <el-form-item label="是否发送所有人" prop="sendAll">
              <el-radio-group v-model="form.sendAll">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
              <el-form-item />
            </el-form-item>
          </el-col>
          <el-col v-if="form.sendAll===0">
            <el-form-item label="指定发送人员" prop="userIdList">
              <el-select v-model="form.userIdList" filterable multiple clearable placeholder="请选择人员">
                <el-option
                  v-for="item in userList"
                  :key="item.id"
                  :label="item.nickName"
                  :value="item.id"
                />
              </el-select>
              <el-form-item />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="文章内容" prop="content">
              <el-input v-model="form.content" type="textarea" />
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" :loading="loading" @click="handleConfirm">保存草稿</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import tableMixin from '@/mixins/tableMixin'
import formMixin from '@/mixins/formMixin'
import { getMessageById, messageDelByIdsApi, messageSaveBaseApi, messageUpdateBaseApi, getMessageByPageApi } from '@/api/message'
import commonUtil from '@/utils/common'
import CommonEnum from '@/enum/CommonEnum'
import { mapState } from 'vuex'
import { getAllUserApi } from '@/api/user'
export default {
  name: 'Message',
  mixins: [tableMixin, formMixin],
  data() {
    return {
      searchForm: {
        title: '',
        msgType: '',
        date: '',
        createDate: '',
        endDate: ''
      },
      checkFieldList: [], // 选中的字段
      multipleSelection: [],
      form: {
        id: '',
        title: '',
        content: '',
        msgType: '',
        sendAll: 0,
        createUserSend: 0,
        userIdList: []
      },
      rules: {
        title: [
          { required: true, message: '这是必填项', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '这是必填项', trigger: 'blur' }
        ],
        userIdList: [
          { required: true, message: '这是必选项', trigger: 'change' }
        ],
        msgType: [
          { required: true, message: '请选择消息类型', trigger: 'change' }
        ]
      },
      dialogFormVisible: false,
      formLabelWidth: '120px',
      dialogType: CommonEnum.ADD.id,
      dialogTitle: CommonEnum.ADD.value,
      CommonEnum: CommonEnum,
      userList: []
    }
  },
  computed: {

    ...mapState({
      msgTypeDictList: state => state.dict.msgTypeDictList
    })
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
    this.getUserAll()
    this.getDataList()
  },
  methods: {
    getUserAll() {
      getAllUserApi().then(res => {
        if (res.code === this.$code) {
          this.userList = res.result
        }
      })
    },
    getDict() {
      this.$store.dispatch('dict/getMsgTypeDictList')
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
      getMessageByPageApi(params).then(res => {
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
      getMessageById(tableItem.id).then(res => {
        if (res.code === this.$code) {
          this.form = res.result
        }
      })
      this.openModal(CommonEnum.UPDATE.id)
    },
    // 添加
    saveMessageBase() {
      this.loading = true
      messageSaveBaseApi(this.form).then(res => {
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
    updateMessageBase() {
      this.loading = true
      messageUpdateBaseApi(this.form).then(res => {
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
    delMessageByIds(id) {
      let ids = this.multipleSelection.toString()
      if (ids.length === 0) {
        ids = id
      }
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        messageDelByIdsApi({
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
            this.saveMessageBase()
          } else {
            this.updateMessageBase()
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

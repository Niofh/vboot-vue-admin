<template>
  <div class="code-detail app-container">
    <el-page-header content="代码属性配置" @back="goBack" />

    <div class="btns-wrap">
      <el-button type="primary" size="small" icon="el-icon-plus" @click="handleClickAdd">新增</el-button>

      <el-button
        :disabled="multipleSelection.length===0"
        type="danger"
        size="small"
        icon="el-icon-delete"
        @click="delByIds"
      >删除
      </el-button>
      <el-button type="primary" size="small" @click="handleCodeShow">预览代码</el-button>
    </div>
    <el-alert
      :title="name+'属性配置'"
      type="success"
    >
      <p>1、字段都要驼峰命名</p>
      <p><a href="https://www.cnblogs.com/-xlp/p/8617760.html" target="_blank">2、MYSQL中数据类型介绍</a></p>
      <p>3、常用属性：
        <b>JAVA:" String、Integer、Date、BigDecimal "。</b>
        <b>MYSQL:" varchar(255)、int、tinyint、 datetime、decimal "</b>
      </p>
    </el-alert>
    <el-table
      ref="table"
      :data="dataList"
      max-height="650"
      size="mini"
      style="width: 100%"

      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
      />

      <el-table-column
        prop="name"
        label="字段名(英文)"
        width="150"
        align="center"
      >
        <template slot-scope="scope">
          <el-input v-model.trim="scope.row.name" :disabled="!scope.row.isEdit" size="mini" />
        </template>
      </el-table-column>

      <el-table-column
        prop="chinaName"
        label="中文名"
        width="150"
        align="center"
      >
        <template slot-scope="scope">
          <el-input v-model.trim="scope.row.chinaName" :disabled="!scope.row.isEdit" size="mini" />
        </template>
      </el-table-column>

      <el-table-column
        prop="javaType"
        label="java类型"
        width="150"
        align="center"
      >
        <template slot-scope="scope">
          <el-input v-model.trim="scope.row.javaType" :disabled="!scope.row.isEdit" size="mini" />
        </template>
      </el-table-column>

      <el-table-column
        prop="nameType"
        label="sql字段类型"
        align="center"
        width="200"
      >
        <template slot-scope="scope">
          <el-input v-model.trim="scope.row.nameType" :disabled="!scope.row.isEdit" size="mini" />
        </template>
      </el-table-column>

      <el-table-column
        prop="description"
        label="备注 sql使用的"
        width="150"
        align="center"
      >
        <template slot-scope="scope">
          <el-input v-model.trim="scope.row.description" :disabled="!scope.row.isEdit" size="mini" />
        </template>
      </el-table-column>

      <el-table-column
        prop="tableSite"
        label="显示表格中"
        width="80"
        align="center"
      >
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.tableSite"
            :active-value="1"
            :inactive-value="0"
            :disabled="!scope.row.isEdit"
            size="mini"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="search"
        label="查询方式"
        width="130"
        align="center"
      >
        <template slot-scope="scope">
          <el-select v-model="scope.row.search" :disabled="!scope.row.isEdit" size="mini">
            <el-option value="" label="请选择" />
            <el-option v-for="search in searchEnumList" :key="search.id" :value="search.id" :label="search.value" />
          </el-select>
        </template>
      </el-table-column>

      <el-table-column
        prop="formType"
        label="表单类型"
        width="130"
        align="center"
      >
        <template slot-scope="scope">
          <el-select v-model="scope.row.formType" :disabled="!scope.row.isEdit" size="mini">
            <el-option value="" label="请选择" />
            <el-option v-for="form in formEnumList" :key="form.id" :value="form.id" :label="form.value" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        prop="required"
        label="必填"
        width="60"
        align="center"
      >
        <template slot-scope="scope">

          <el-switch
            v-model="scope.row.required"
            :active-value="1"
            :inactive-value="0"
            :disabled="!scope.row.isEdit"
            size="mini"
          />
        </template>
      </el-table-column>

      <el-table-column
        prop="dictKey"
        label="关联数字字典"
        align="center"
        width="180"
      >
        <template slot-scope="scope">
          <el-select v-model="scope.row.dictKey" :disabled="!scope.row.isEdit" size="mini">
            <el-option value="" label="请选择" />
            <el-option v-for="dict in dictAll" :key="dict.id" :label="dict.dictName" :value="dict.dictKey" />
          </el-select>
        </template>
      </el-table-column>

      <el-table-column
        prop="num"
        label="序号"
        width="200"
        align="center"
      >
        <template slot-scope="scope">
          <el-input-number
            v-model.trim="scope.row.num"
            :disabled="!scope.row.isEdit"
            size="mini"
            :precision="2"
            :step="0.1"
            :max="10"
          />
        </template>
      </el-table-column>

      <el-table-column
        fixed="right"
        label="操作"
        width="180"
      >
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="handleSave(scope.row)">{{ scope.row.isEdit?'保存':'编辑' }}</el-button>
          <el-button type="text" size="mini" @click="delById(scope.row.id,scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import tableMixin from '@/mixins/tableMixin'
import {
  codeDetailDelByIdsApi,
  codeDetailSaveBaseApi,
  codeDetailUpdateBaseApi,
  getAllBaseByCodeId
} from '@/api/codeDetail'
import { getArray } from '@/enum/EnumBase'
import FormEnum from '@/enum/FormEnum'
import SqlEnum from '@/enum/SqlEnum'
import { getDictAll } from '@/api/dict'

export default {
  name: 'CodeAttr',
  mixins: [tableMixin],
  data() {
    return {
      codeId: this.$route.params.codeId,
      name: this.$route.query.name,
      multipleSelection: [],
      dataList: [],
      formEnumList: getArray(FormEnum),
      searchEnumList: getArray(SqlEnum),
      dictAll: []
    }
  },
  created() {
    this.getDictAll()
    this.getDataList()
  },
  methods: {
    getDictAll() {
      getDictAll().then(res => {
        if (res.code === this.$code) {
          this.dictAll = res.data
        }
      })
    },
    goBack() {
      this.$router.back()
    },
    getDataList() {
      getAllBaseByCodeId({ codeId: this.codeId }).then(res => {
        if (res.code === this.$code) {
          this.dataList = res.data.map(item => {
            item.isEdit = false
            return item
          })
        }
      })
    },
    // 全选
    handleSelectionChange(tableItem) {
      this.multipleSelection = tableItem.map(item => item.id)
    },
    handleClickAdd() {
      const item = {
        name: '',
        chinaName: '',
        javaType: '',
        nameType: '',
        description: '',
        required: 0,
        tableSite: 0,
        formType: '',
        search: '',
        dictKey: '',
        num: 1,
        isEdit: false
      }
      this.dataList.unshift(item)
    },
    handleSave(item) {
      if (item.isEdit) {
        console.log(item)
        // 修改数据或者提交数据
        if (item.id) {
          // 修改数据
          codeDetailUpdateBaseApi(item).then(res => {
            if (res.code === this.$code) {
              this.$message.success(res.msg)
            }
          })
        } else {
          // 添加数据
          item.codeId = this.codeId
          codeDetailSaveBaseApi(item).then(res => {
            if (res.code === this.$code) {
              this.$message.success(res.msg)
              this.getDataList()
            } else {
              this.$message.error(res.msg)
            }
          })
        }
      }
      item.isEdit = !item.isEdit
    },
    // 删除多个
    delByIds() {
      const list = this.multipleSelection.filter(item => !!item)
      console.log(list)
      if (list.length > 0) {
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          codeDetailDelByIdsApi({
            ids: list.toString()
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
                message: res.msg
              })
            }
          })
        })
      } else {
        this.getDataList()
      }
    },
    // 删除单个
    delById(id, scope) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (!id) {
          this.dataList.splice(scope.$index, 1)
          return
        }
        codeDetailDelByIdsApi({
          ids: id
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
              message: res.msg
            })
          }
        })
      })
    },
    handleCodeShow() {
      this.$router.push({
        name: 'CodeShow',
        params: { codeId: this.$route.params.codeId },
        query: { name: this.$route.query.name }
      })
    }
  }
}
</script>

<style lang="scss">
  .code-detail {
    .el-input.is-disabled .el-input__inner {
      color: #606266;
    }
  }
</style>

<style scoped lang="scss">

  .btns-wrap {
    margin-top: 20px;
  }
</style>

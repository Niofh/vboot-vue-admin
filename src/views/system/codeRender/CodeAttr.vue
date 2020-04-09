<template>
  <div class="code-attr app-container">
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
      <el-button size="small" type="success">重新生成文件</el-button>

    </div>
    <el-alert
      title="t_test表"
      type="success"
    />
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
        width="110"
        align="center"
      >
        <template slot-scope="scope">
          <el-switch v-model="scope.row.tableSite" :active-value="1" :inactive-value="0" :disabled="!scope.row.isEdit" size="mini" />
        </template>
      </el-table-column>
      <el-table-column
        prop="search"
        label="查询方式"
        width="180"
        align="center"
      >
        <template slot-scope="scope">
          <el-select v-model="scope.row.search" :disabled="!scope.row.isEdit" size="mini" />
        </template>
      </el-table-column>

      <el-table-column
        prop="formType"
        label="表单类型"
        width="180"
        align="center"
      >
        <template slot-scope="scope">
          <el-select v-model="scope.row.formType" :disabled="!scope.row.isEdit" size="mini" />
        </template>
      </el-table-column>
      <el-table-column
        prop="required"
        label="必填"
        width="60"
        align="center"
      >
        <template slot-scope="scope">

          <el-switch v-model="scope.row.required" :active-value="1" :inactive-value="0" :disabled="!scope.row.isEdit" size="mini" />
        </template>
      </el-table-column>

      <el-table-column
        prop="dicId"
        label="关联数字字典"
        align="center"
        width="180"
      >
        <template slot-scope="scope">
          <el-select v-model="scope.row.dicId" :disabled="!scope.row.isEdit" size="mini" />
        </template>
      </el-table-column>

      <el-table-column
        prop="num"
        label="序号"
        width="200"
        align="center"
      >
        <template slot-scope="scope">
          <el-input-number v-model.trim="scope.row.num" :disabled="!scope.row.isEdit" size="mini" :precision="2" :step="0.1" :max="10" />
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
import { codeDetailDelByIdsApi, getCodeDetailAll } from '@/api/codeDetail'

export default {
  name: 'CodeAttr',
  mixins: [tableMixin],
  data() {
    return {
      codeId: this.$route.params.codeId,
      multipleSelection: [],
      dataList: []
    }
  },
  created() {
    this.getDataList()
  },
  methods: {
    goBack() {
      this.$router.back()
    },
    getDataList() {
      getCodeDetailAll().then(res => {
        if (res.code === this.$code) {
          this.dataList = res.result.map(item => {
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
        dicId: '',
        num: 1,
        isEdit: false
      }
      this.dataList.unshift(item)
    },
    handleSave(item) {
      item.isEdit = !item.isEdit
      if (this.isEdit) {
        // 修改数据或者提交数据
      }
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
                message: res.message
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
              message: res.message
            })
          }
        })
      })
    }
  }
}
</script>

<style scoped lang="scss">
.btns-wrap{
  margin-top: 20px;
}
</style>

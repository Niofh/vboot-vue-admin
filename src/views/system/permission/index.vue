<template>
  <div class="app-container permission">
    <el-row>
      <el-button type="primary" size="small" @click="openMenuModal(1)">+ 新增菜单</el-button>
      <el-button type="danger" size="small" @click="handleDelByIds">批量删除</el-button>
      <el-button size="small" @click="getAllPermission">刷新</el-button>
    </el-row>

    <div class="tree-content">

      <el-row :gutter="20">
        <el-col :md="6" :sm="24">
          <div class="tree-bar">
            <el-input
              v-model="filterText"
              placeholder="输入关键字进行过滤"
            />

            <el-tree
              ref="treeMenu"
              empty-text="暂无数据"
              class="filter-tree"
              show-checkbox
              node-key="id"
              default-expand-all
              :data="treeData"
              :props="defaultProps"
              :expand-on-click-node="false"
              :filter-node-method="filterNode"
            >
              <span slot-scope="{ node, data }" class="custom-tree-node">
                <span>{{ data.title }}</span>
                <span>
                  <!--是菜单才能添加-->
                  <el-button
                    type="text"
                    size="mini"
                    @click="() => handleUpdate(node,data)"
                  >
                    编辑
                  </el-button>
                </span>
              </span>
            </el-tree>
          </div>
        </el-col>
        <el-col :md="18" :sm="24" />
      </el-row>
    </div>

    <el-dialog
      :modal-append-to-body="false"
      width="600px"
      top="5vh"
      :close-on-click-modal="false"
      :title="dialogTitle+'菜单/按钮'"
      :visible.sync="dialogFormVisible"
      @closed="onClose('ruleForm')"
    >

      <el-form ref="ruleForm" :model="form" :rules="rules" :label-width="formLabelWidth" size="small">
        <el-form-item v-show="false" prop="id" label="id" />
        <el-form-item label="菜单类型">
          <el-radio-group v-model="form.type">
            <el-radio :label="-1">顶级菜单</el-radio>
            <el-radio :label="0">菜单</el-radio>
            <el-radio :label="1">按钮</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item v-if="form.type!==-1" label="父级菜单">
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
              :data="menuData"
              :props="defaultProps"
              :current-node-key="form.parentId"
              :expand-on-click-node="false"
              :highlight-current="true"
              @node-click="menuNodeClick"
            />
            <el-input slot="reference" v-model="form.parentTitle" readonly autocomplete="off" />
          </el-popover>
        </el-form-item>
        <el-form-item label="名称title" prop="title">
          <el-input v-model="form.title" autocomplete="off" />
        </el-form-item>
        <el-form-item label="路径path" prop="path">
          <el-input v-model="form.path" autocomplete="off" />
        </el-form-item>
        <el-form-item v-if="form.type===1" label="权限类型" prop="buttonType">
          <el-input v-model="form.buttonType" autocomplete="off" placeholder="add,update,del,等标记" />
        </el-form-item>
        <el-form-item v-if="form.type!==1" label="菜单name" prop="name">
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item v-if="form.type!==1" label="菜单组件" prop="component">
          <el-input v-model="form.component" autocomplete="off" />
        </el-form-item>
        <el-form-item v-if="form.type!==1" label="图标" prop="icon">
          <el-input v-model="form.icon" autocomplete="off" />
        </el-form-item>
        <el-form-item label="备注" prop="description">
          <el-input v-model="form.description" autocomplete="off" />
        </el-form-item>
        <el-form-item v-if="form.type===0" label="网页连接" prop="url">
          <el-input v-model="form.url" autocomplete="off" />
        </el-form-item>
        <el-form-item v-if="form.type!==1" label="重定向" prop="redirect">
          <el-input v-model="form.redirect" autocomplete="off" />
        </el-form-item>
        <el-form-item label="排序值" prop="sort">
          <el-input-number v-model="form.sort" :min="1" :precision="1" :step="0.1" />
        </el-form-item>
        <el-form-item v-if="form.type!==1" label="是否显示">
          <el-radio v-model="form.hidden" :label="1">显示</el-radio>
          <el-radio v-model="form.hidden" :label="0">不显示</el-radio>
        </el-form-item>
        <el-form-item v-if="form.type!==1" label="是否缓存">
          <el-radio v-model="form.nocache" :label="1">缓存</el-radio>
          <el-radio v-model="form.nocache" :label="0">不缓存</el-radio>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" :loading="loading" @click="handleConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getAllPermissionApi,
  permissionDelByIdsApi,
  permissionSaveBaseApi,
  permissionUpdateBaseApi
} from '@/api/permission'
import treeDeepUtil from '@/utils/treeDeepUtil'
import commonUtil from '@/utils/common'
import CommonEnum from '@/enum/CommonEnum'
import formMixin from '@/mixins/formMixin'

export default {
  name: 'Permission',
  mixins: [formMixin],
  data() {
    return {
      form: {
        id: '',
        name: '',
        hidden: 1,
        title: '',
        path: '',
        component: '',
        icon: '',
        buttonType: '',
        parentId: '',
        parentTitle: '',
        description: '',
        sort: '',
        url: '',
        redirect: '',
        nocache: 0,
        type: 0
      },
      rules: {
        title: [
          { required: true, message: '这是必填项', trigger: 'blur' }
        ],
        path: [
          { required: true, message: '这是必填项', trigger: 'blur' }
        ]
      },
      dialogFormVisible: false,
      formLabelWidth: '120px',
      data: [],
      defaultProps: {
        children: 'children',
        label: 'title'
      },

      TYPE: {
        'SUPER_MENU': -1,
        'MENU': 0,
        'BUTTON': 1
      },
      filterText: '',
      dialogType: CommonEnum.ADD.id,
      dialogTitle: CommonEnum.ADD.value
    }
  },
  computed: {
    treeData() {
      const menu = JSON.parse(JSON.stringify(this.data))
      return treeDeepUtil.fommatTree(menu)
    },
    menuData() {
      const menu = JSON.parse(JSON.stringify(this.data))
      var filter = menu.filter(item => item.type !== this.TYPE.BUTTON)
      return treeDeepUtil.fommatTree(filter)
    }
  },
  watch: {
    filterText(val) {
      this.$refs.treeMenu.filter(val)
    }
  },
  created() {
    this.getAllPermission()
  },
  methods: {

    openMenuModal(type) {
      this.dialogFormVisible = true
      this.dialogType = type
      this.dialogTitle = type === CommonEnum.ADD.id ? CommonEnum.ADD.value : CommonEnum.UPDATE.value
    },
    handleConfirm() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          if (this.dialogType === CommonEnum.ADD.id) {
            this.permissionSaveBase()
          } else {
            this.permissionUpdateBase()
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleUpdate(node, data) {
      this.openMenuModal(CommonEnum.UPDATE.id)
      this.form = JSON.parse(JSON.stringify(data))
      this.data.forEach(item => {
        if (item.id === this.form.parentId) {
          this.$set(this.form, 'parentTitle', item.title)
        }
      })
    },
    handleDelByIds() {
      const checkedKeys = this.$refs.treeMenu.getCheckedKeys()
      if (checkedKeys.length === 0) {
        this.$message.error('请勾选数据！！！')
      } else {
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          permissionDelByIdsApi({
            ids: checkedKeys.toString()
          }).then(res => {
            if (res.code === this.$code) {
              this.getAllPermission()
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
    },
    // 获取所有权限
    getAllPermission() {
      getAllPermissionApi().then(res => {
        if (res.code === this.$code) {
          this.data = res.result
        }
      })
    },
    // 提交一些公共判断
    _submit() {
      let form = JSON.parse(JSON.stringify(this.form))
      if (this.form.type === this.TYPE.BUTTON) {
        form = {
          id: this.form.id,
          parentId: this.form.parentId,
          title: this.form.title,
          path: this.form.path,
          description: this.form.description,
          buttonType: this.form.buttonType,
          type: this.form.type
        }
      } else if (this.form.type === this.TYPE.MENU) {
        commonUtil.setObjectFiledNull(form, ['buttonType'])
      } else if (this.form.type === this.TYPE.SUPER_MENU) {
        commonUtil.setObjectFiledNull(form, ['buttonType', 'url', 'parentId'])
      }
      return form
    },
    permissionSaveBase() {
      const form = this._submit()
      this.loading = true
      permissionSaveBaseApi(form).then(res => {
        if (res.code === this.$code) {
          // 添加成功
          this.closeModal()
          this.$message.success(res.message)
          this.getAllPermission()
        } else {
          this.$message.error(res.message)
        }
      }).finally(() => {
        this.loading = false
      })
    },
    permissionUpdateBase() {
      const form = this._submit()
      this.loading = true
      permissionUpdateBaseApi(form).then(res => {
        if (res.code === this.$code) {
          // 更新成功
          this.getAllPermission()
          this.closeModal()

          this.$message.success(res.message)
        } else {
          this.$message.error(res.message)
        }
      }).finally(() => {
        this.loading = false
      })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.title.indexOf(value) !== -1
    },
    menuNodeClick(node) {
      this.form.parentTitle = node.title
      this.form.parentId = node.id
    },
    onClose(formName) {
      this.form = {
        name: '',
        hidden: 1,
        title: '',
        path: '',
        component: '',
        icon: '',
        buttonType: '',
        parentId: '',
        parentTitle: '',
        description: '',
        sort: '',
        url: '',
        redirect: '',
        nocache: 0,
        type: 0
      }
      this.resetForm(formName)
    }
  }
}
</script>

<style scoped lang="scss">
  .tree-content {
    margin-top: 30px;

    .tree-bar {
      margin-top: 10px;
      max-height: 680px;
      height: 680px;
      overflow-y: auto;
      user-select: none;

      .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
      }
    }
  }
</style>

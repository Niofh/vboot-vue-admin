<template>
  <div class="app-container permission">
    <el-row>
      <el-button type="primary" size="small" @click="dialogFormVisible=true">+ 新增菜单</el-button>
      <el-button type="danger" size="small">批量删除</el-button>
      <el-button size="small">刷新</el-button>
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
              ref="tree"
              class="filter-tree"
              show-checkbox
              node-key="id"
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
                    v-if="data.type!==1"
                    type="text"
                    size="mini"
                    @click="() => append(node,data)"
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
      width="700px"
      top="5vh"
      :close-on-click-modal="false"
      title="菜单/按钮"
      :visible.sync="dialogFormVisible"
    >

      <el-form :model="form" :label-width="formLabelWidth">
        <el-form-item label="菜单类型">
          <el-radio-group v-model="form.type">
            <el-radio :label="-1">顶级菜单</el-radio>
            <el-radio :label="0">菜单</el-radio>
            <el-radio :label="1">按钮</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item v-if="form.type===0" label="父级菜单">
          <el-input v-model="form.parentId" autocomplete="off" />
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="form.title" autocomplete="off" />
        </el-form-item>
        <el-form-item label="路径">
          <el-input v-model="form.path" autocomplete="off" />
        </el-form-item>
        <el-form-item v-if="form.type===1" label="按钮权限名称">
          <el-input v-model="form.buttonType" autocomplete="off" />
        </el-form-item>
        <el-form-item v-if="form.type!==1" label="菜单name">
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item v-if="form.type!==1" label="菜单组件">
          <el-input v-model="form.component" autocomplete="off" />
        </el-form-item>
        <el-form-item v-if="form.type!==1" label="图标">
          <el-input v-model="form.icon" autocomplete="off" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.description" autocomplete="off" />
        </el-form-item>
        <el-form-item v-if="form.type===0" label="网页连接">
          <el-input v-model="form.url" autocomplete="off" />
        </el-form-item>
        <el-form-item v-if="form.type!==1" label="重定向">
          <el-input v-model="form.redirect" autocomplete="off" />
        </el-form-item>
        <el-form-item label="排序值">
          <el-input-number v-model="form.sort" :min="1" :precision="1" :step="0.1" />
        </el-form-item>
        <el-form-item v-if="form.type!==1" label="是否显示" prop="hidden">
          <el-radio v-model="form.hidden" :label="1">显示</el-radio>
          <el-radio v-model="form.hidden" :label="0">不显示</el-radio>
        </el-form-item>
        <el-form-item v-if="form.type!==1" label="是否缓存" prop="hidden">
          <el-radio v-model="form.nocache" :label="1">缓存</el-radio>
          <el-radio v-model="form.nocache" :label="0">不缓存</el-radio>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getAllPermissionApi } from '@/api/permission'
import treeDeepUtil from '@/utils/treeDeepUtil'

export default {
  name: 'Permission',
  data() {
    return {
      form: {
        name: '',
        hidden: 1,
        title: '',
        path: '',
        component: '',
        icon: '',
        buttonType: '',
        parentId: '',
        description: '',
        sort: '',
        url: '',
        redirect: '',
        nocache: 0,
        type: 0
      },
      filterText: '',
      data: [],
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      dialogFormVisible: false,
      formLabelWidth: '120px'
    }
  },
  computed: {
    treeData() {
      return treeDeepUtil.coverTreeData(this.data, null)
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    this.getAllPermission()
  },
  methods: {
    getAllPermission() {
      getAllPermissionApi().then(res => {
        if (res.code === 200) {
          this.data = res.result
        }
      })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.title.indexOf(value) !== -1
    },
    // 添加菜单或者按钮
    append() {

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

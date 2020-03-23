<template>
  <div class="app-container permission">
    <el-row>
      <el-button type="primary" size="small">+ 添加顶部菜单</el-button>
      <el-button type="danger" size="small">批量删除</el-button>
      <el-button size="small">刷新</el-button>
    </el-row>

    <div class="tree-content">

      <el-row :gutter="20">
        <el-col :md="6" :sm="24">
          <el-alert
            title="当前选择的名称为："
            type="warning"
            show-icon
          />
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
                    添加
                  </el-button>
                </span>
              </span>
            </el-tree>
          </div>
        </el-col>
        <el-col :md="18" :sm="24">
          <div class="tree-desc">
            <el-form ref="form" :model="form" label-width="80px">
              <el-form-item label="活动名称">
                <el-input v-model="form.name" />
              </el-form-item>
              <el-form-item label="活动区域">
                <el-select v-model="form.region" placeholder="请选择活动区域">
                  <el-option label="区域一" value="shanghai" />
                  <el-option label="区域二" value="beijing" />
                </el-select>
              </el-form-item>
              <el-form-item label="活动时间">
                <el-col :span="11">
                  <el-date-picker v-model="form.date1" type="date" placeholder="选择日期" style="width: 100%;" />
                </el-col>
                <el-col class="line" :span="2">-</el-col>
                <el-col :span="11">
                  <el-time-picker v-model="form.date2" placeholder="选择时间" style="width: 100%;" />
                </el-col>
              </el-form-item>
              <el-form-item label="即时配送">
                <el-switch v-model="form.delivery" />
              </el-form-item>
              <el-form-item label="活动性质">
                <el-checkbox-group v-model="form.type">
                  <el-checkbox label="美食/餐厅线上活动" name="type" />
                  <el-checkbox label="地推活动" name="type" />
                  <el-checkbox label="线下主题活动" name="type" />
                  <el-checkbox label="单纯品牌曝光" name="type" />
                </el-checkbox-group>
              </el-form-item>
              <el-form-item label="特殊资源">
                <el-radio-group v-model="form.resource">
                  <el-radio label="线上品牌商赞助" />
                  <el-radio label="线下场地免费" />
                </el-radio-group>
              </el-form-item>
              <el-form-item label="活动形式">
                <el-input v-model="form.desc" type="textarea" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="onSubmit">立即创建</el-button>
                <el-button>取消</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
      </el-row>
    </div>
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
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      filterText: '',
      data: [],
      defaultProps: {
        children: 'children',
        label: 'title'
      }
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

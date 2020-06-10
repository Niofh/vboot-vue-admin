<template>
  <div class="app-container">
    <el-page-header content="预览代码" @back="goBack" />
    <div class="btns-wrap">
      <el-button class="btn-default" size="small" icon="el-icon-refresh-left" @click="handleRefresh">刷新</el-button>
      <el-button v-clipboard:copy="inputData" v-clipboard:success="clipboardSuccess" type="primary" size="small">复制代码</el-button>

    </div>
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane label="api" name="api">
        {{ name }}.js
        <pre v-highlightjs="result.api"><code class="javascript" /></pre>
      </el-tab-pane>
      <el-tab-pane label="table.vue" name="table">
        {{ name }}.vue
        <pre v-highlightjs="result.table"><code class="javascript" /></pre>
      </el-tab-pane>
      <el-tab-pane label="apiGuYuan" name="apiGuYuan">
        {{ name }}.js
        <pre v-highlightjs="result.apiGuYuan"><code class="javascript" /></pre>
      </el-tab-pane>
      <el-tab-pane label="tableGuYuan.vue" name="tableGuYuan">
        {{ name }}.vue
        <pre v-highlightjs="result.tableGuYuan"><code class="javascript" /></pre>
      </el-tab-pane>
      <el-tab-pane label="vuexDict.js" name="vuexDict">
        <el-alert type="error" effect="dark">字典类型需要单独复制粘贴到store/dict.js，不能直接复制文件到代码上</el-alert>
        <div>{{ name }}Dict.js</div>
        <pre v-highlightjs="result.vuexDict"><code class="javascript" /></pre>
      </el-tab-pane>
      <el-tab-pane label="entity" name="entity">
        {{ Name }}.java
        <pre v-highlightjs="result.entity"><code class="java" /></pre>
      </el-tab-pane>
      <el-tab-pane label="controller" name="controller">
        {{ Name }}Controller.java
        <pre v-highlightjs="result.controller"><code class="java" /></pre>
      </el-tab-pane>
      <el-tab-pane label="service" name="service">
        {{ Name }}Service.java
        <pre v-highlightjs="result.service"><code class="java" /></pre>
      </el-tab-pane>
      <el-tab-pane label="serviceImpl" name="serviceImpl">
        {{ Name }}ServiceImpl.java
        <pre v-highlightjs="result.serviceImpl"><code class="java" /></pre>
      </el-tab-pane>
      <el-tab-pane label="mapper" name="mapper">
        {{ Name }}Mapper.java
        <pre v-highlightjs="result.mapper"><code class="java" /></pre>
      </el-tab-pane>
      <el-tab-pane label="mysql" name="mysql">
        t_{{ name }}.sql
        <pre v-highlightjs="result.mysql"><code class="sql" /></pre>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { showCode } from '@/api/code'

export default {
  name: 'CodeShow',
  data() {
    return {
      activeName: 'api',
      result: {},
      inputData: '',
      name: ''
    }
  },
  created() {
    this.getCode()
    this.name = this.$route.query.name
    this.Name = this.name.slice(0, 1).toUpperCase() + this.name.slice(1)
    this.activeName = 'api'
  },
  methods: {
    goBack() {
      this.$router.back()
    },
    handleClick(tab, event) {
      console.log(this.result[tab.name])
      this.inputData = this.result[tab.name]
    },
    getCode() {
      showCode({ id: this.$route.params.codeId }).then(res => {
        if (res.code === this.$code) {
          this.result = res.data
        }
      })
    },
    handleRefresh() {
      this.getCode()
      this.inputData = this.result[this.activeName]
    },
    clipboardSuccess() {
      this.$message({
        message: '复制成功',
        type: 'success',
        duration: 1500
      })
    }
  }
}
</script>

<style scoped>

</style>

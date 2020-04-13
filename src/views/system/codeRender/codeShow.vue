<template>
  <div class="app-container">
    <el-page-header content="预览代码" @back="goBack" />
    <div class="btns-wrap">
      <el-button class="btn-default" size="small" icon="el-icon-refresh-left" @click="handleRefresh">刷新</el-button>
      <el-button v-clipboard:copy="inputData" v-clipboard:success="clipboardSuccess" type="primary" size="small">复制代码</el-button>

    </div>
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane label="api" name="api">
        <pre v-highlightjs="result.api"><code class="javascript" /></pre>
      </el-tab-pane>
      <el-tab-pane label="table.vue" name="table">
        <pre v-highlightjs="result.table"><code class="javascript" /></pre>
      </el-tab-pane>
      <el-tab-pane label="entity" name="entity">
        <pre v-highlightjs="result.entity"><code class="java" /></pre>
      </el-tab-pane>
      <el-tab-pane label="controller" name="controller">
        <pre v-highlightjs="result.controller"><code class="java" /></pre>
      </el-tab-pane>
      <el-tab-pane label="service" name="service">
        <pre v-highlightjs="result.service"><code class="java" /></pre>
      </el-tab-pane>
      <el-tab-pane label="serviceImpl" name="serviceImpl">
        <pre v-highlightjs="result.serviceImpl"><code class="java" /></pre>
      </el-tab-pane>
      <el-tab-pane label="mapper" name="mapper">
        <pre v-highlightjs="result.mapper"><code class="java" /></pre>
      </el-tab-pane>
      <el-tab-pane label="mysql" name="mysql">
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
      inputData: ''
    }
  },
  created() {
    this.getCode()
  },
  methods: {
    goBack() {
      this.$router.back()
    },
    handleClick(tab, event) {
      this.inputData = this.result[tab.name]
    },
    getCode() {
      showCode({ id: this.$route.params.codeId }).then(res => {
        if (res.code === this.$code) {
          this.result = res.result
        }
      })
    },
    handleRefresh() {
      this.getCode()
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

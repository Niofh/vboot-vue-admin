<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted() {
    if (process.env.NODE_ENV === 'production') {
      // 隐藏加载页面
      document.getElementById('my-page-load').style.display = 'none'
    }
  }
}
</script>

<style lang="scss">
  /*基础样式*/
  .btns-wrap{
    padding: 10px 0;
  }

  .btn-default{
    color: #1890FF;
    border-color: #badeff;
    background-color: #e8f4ff;
  }

  .pagination-warp{
    padding: 20px 0;
  }

  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
  .demonstration {
    display: block;
    color: #8492a6;
    font-size: 14px;
    margin-bottom: 20px;
  }
</style>

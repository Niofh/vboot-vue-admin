<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
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
</style>

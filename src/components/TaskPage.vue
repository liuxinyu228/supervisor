<template>
    <div class="flex">
      <!-- 侧边栏 -->
      <Sidebar />
      
      <!-- 主要内容 -->
      <div class="flex-1 p-6">
        <div class="flex justify-between mb-4">
          <Breadcrumb />
          <button class="btn btn-primary">+ 新建任务</button>
        </div>
        <div class="flex justify-between items-center mb-4">
          <FilterBar />
        </div>
        <TaskList />
      </div>
    </div>
  </template>
  
  <script>
  import Sidebar from './TaskSidebar.vue';
  import Breadcrumb from './TaskBreadcrumb.vue';
  import FilterBar from './TaskFilterBar.vue';
  import TaskList from './TaskList.vue';
  
  export default {
    components: {
      Sidebar,
      Breadcrumb,
      FilterBar,
      TaskList,
    },
  };
  </script>
  
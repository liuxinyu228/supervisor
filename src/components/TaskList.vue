<template>
    <div>
      <!-- 渲染任务列表 -->
      <TaskItem v-for="task in paginatedTasks" :key="task.id" :task="task" />
  
      <!-- 只引入一次分页组件 -->
      <TaskPagination
        :totalTasks="tasks.length"
        :tasksPerPage="tasksPerPage"
        :currentPage="currentPage"
        @page-changed="handlePageChange"
        @tasks-per-page-changed="handleTasksPerPageChange"
      />
    </div>
  </template>
  
  <script>
  import TaskItem from './TaskItem.vue';
  import TaskPagination from './TaskPagination.vue';
  
  export default {
    components: {
      TaskItem,
      TaskPagination,
    },
    data() {
      return {
        tasks: [], // 从 JSON 文件加载的任务数据
        currentPage: 1, // 当前页码
        tasksPerPage: 5, // 每页显示的任务数
      };
    },
    computed: {
      // 当前页的任务数据
      paginatedTasks() {
        const start = (this.currentPage - 1) * this.tasksPerPage;
        const end = start + this.tasksPerPage;
        return this.tasks.slice(start, end);
      },
    },
    mounted() {
      this.loadTasks();
    },
    methods: {
      async loadTasks() {
        try {
          const response = await fetch('/tasks.json'); // 从本地加载任务数据
          const data = await response.json();
          this.tasks = data;
        } catch (error) {
          console.error('无法加载任务数据:', error);
        }
      },
      // 处理页码变化事件
      handlePageChange(newPage) {
        this.currentPage = newPage;
      },
      // 处理每页任务数变化事件
      handleTasksPerPageChange(newTasksPerPage) {
        this.tasksPerPage = newTasksPerPage;
        this.currentPage = 1; // 每页条数变化时，返回第一页
      },
    },
  };
  </script>
  
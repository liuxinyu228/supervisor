<template>
  <div>
    <!-- 渲染任务列表 -->
    <TaskItem
      v-for="task in filteredTasks"
      :key="task.id"
      :task="task"
      @edit-task="openEditModal"
    />

    <!-- 只引入一次分页组件 -->
    <TaskPagination
      :totalTasks="filteredTypeTaskNum"
      :tasksPerPage="tasksPerPage"
      :currentPage="currentPage"
      @page-changed="handlePageChange"
      @tasks-per-page-changed="handleTasksPerPageChange"
    />

    <!-- 编辑任务弹窗 -->
    <TaskEditModal
      v-if="isEditModalOpen"
      :task="selectedTask"
      @close="closeEditModal"
      @save="saveTask"
    />
  </div>
</template>

<script>
import TaskItem from './TaskItem.vue';
import TaskPagination from './PaginationBar.vue';
import TaskEditModal from './EditModalBar.vue';

export default {
  components: {
    TaskItem,
    TaskPagination,
    TaskEditModal,
  },
  data() {
    return {
      tasks: [], // 从 JSON 文件加载的任务数据
      currentPage: 1, // 当前页码
      tasksPerPage: 5, // 每页显示的任务数
      isEditModalOpen: false, // 控制编辑弹窗是否显示
      selectedTask: null, // 当前选中的任务
      filters: {
        type: '',
        status: '',
        search: ''
      }
    };
  },
  computed: {
    // 通过任务类型、状态、搜索进行筛选后的任务数
    filteredTypeTaskNum() {
      return this.tasks.filter(task => {
        return (
          (this.filters.type === '' || task.type === this.filters.type) &&
          (this.filters.status === '' || task.status === this.filters.status) &&
          (this.filters.search === '' || task.title.includes(this.filters.search))
        );
      }).length;
    },
    
    // 当前页的任务数据
    filteredTasks() {
      const start = (this.currentPage - 1) * this.tasksPerPage;
      const end = start + this.tasksPerPage;

      const filteredTypeTasks = this.tasks.filter(task => {
        return (
          (this.filters.type === '' || task.type === this.filters.type) &&
          (this.filters.status === '' || task.status === this.filters.status) &&
          (this.filters.search === '' || task.title.includes(this.filters.search))
        );
      });
      return filteredTypeTasks.slice(start, end);
    }
  },
  mounted() {
    this.loadTasks();
  },
  methods: {
    async loadTasks() {
      try {
        const response = await fetch('/taskTemplate/tasks.json'); // 从本地加载任务数据
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
    // 打开编辑任务的弹窗
    openEditModal(task) {
      this.selectedTask = task;
      this.isEditModalOpen = true;
    },
    // 关闭编辑弹窗
    closeEditModal() {
      this.isEditModalOpen = false;
      this.selectedTask = null;
    },
    // 保存编辑的任务
    saveTask(updatedTask) {
      const index = this.tasks.findIndex(task => task.id === updatedTask.id);
      if (index !== -1) {
        this.tasks.splice(index, 1, updatedTask); // 更新任务
      }
      this.closeEditModal(); // 关闭弹窗
    },
    // 处理筛选条件
    handleFilterTasks(filter) {
      this.filters[filter.type] = filter.value;
    },
    applyFilters() {
      this.currentPage = 1; // 应用筛选条件时，返回第一页
    },
    // 新增任务
    addTask(newTask) {
      this.tasks.unshift(newTask);
    }
  }
};
</script>

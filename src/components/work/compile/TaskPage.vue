<template>
  <!-- 任务卡片页面 -->
  <div class="flex">
    <!-- 主要内容 -->
    <div class="flex-1 p-6">
      <div class="flex justify-between mb-4">
        <BreadcrumbBar />
        <button class="btn btn-primary" @click="openNewTaskModal">+ 新建任务</button>
      </div>
      <div class="flex justify-between items-center mb-4">
        <FilterBar @filter-tasks="handleFilterTasks" @apply-filters="applyFilters" />
      </div>
      <TaskList ref="taskList" />
    </div>
  </div>
  <NewTaskModal v-if="isNewTaskModalOpen" @close="closeNewTaskModal" @save="addNewTask" />
</template>

<script>
import BreadcrumbBar from './BreadcrumbBar.vue';
import FilterBar from './FilterBar.vue';
import TaskList from './TaskList.vue';
import NewTaskModal from './NewTaskModal.vue';

export default {
  components: {
    BreadcrumbBar,
    FilterBar,
    TaskList,
    NewTaskModal,
  },
  data() {
    return {
      isNewTaskModalOpen: false,
    };
  },
  methods: {
    handleFilterTasks(filter) {
      this.$refs.taskList.handleFilterTasks(filter);
    },
    applyFilters() {
      this.$refs.taskList.applyFilters();
    },
    openNewTaskModal() {
      this.isNewTaskModalOpen = true;
    },
    closeNewTaskModal() {
      this.isNewTaskModalOpen = false;
    },
    addNewTask(newTask) {
      this.$refs.taskList.addTask(newTask);
      this.closeNewTaskModal();
    }
  }
};
</script>

<template>
  <!-- 如果 currentView 是 'selection'，显示 TaskSelection 组件 -->
  <TaskSelection v-if="currentView === 'selection'" @select="handleSelection" />
  <!-- 否则，显示 CreateTaskForm 组件，并传递 isNewTask 和 back 事件 -->
  <CreateTaskForm v-else-if="currentView === 'new'" :isNewTask="isNewTask" @back="currentView = 'selection'" />
  <ExistingTaskSelection v-else-if="currentView === 'existing'" :isNewTask="isNewTask" @back="currentView = 'selection'" />
</template>

<script>
import TaskSelection from './CreateTaskSelectionBar.vue'
import CreateTaskForm from './CreateTaskFormBar.vue'
import ExistingTaskSelection from './ExistingTaskSelection.vue'

export default {
  components: {
    TaskSelection,
    CreateTaskForm,
    ExistingTaskSelection
  },
  data() {
    return {
      currentView: 'selection',
      isNewTask: true
    }
  },
  methods: {
    handleSelection(selection) {
      this.isNewTask = selection === 'new'
      this.currentView = selection // 修改此处
    }
  }
}
</script>

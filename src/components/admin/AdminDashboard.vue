<template>
  <div class="flex h-screen bg-gray-100">
    <AdminSidebar @update:activeTab="updateActiveTab" />
    <div class="flex-1 flex flex-col">
      <main class="flex-1 overflow-y-auto p-6">
        <UserManagement v-if="activeTab === 'users'" />
        <TaskManagement v-if="activeTab === 'tasks'" />
        <WorkManagement v-if="activeTab === 'workManagement'" />
      </main>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import AdminSidebar from './AdminSidebar.vue'
import UserManagement from './UserManagement.vue'
import TaskManagement from './TaskManagement.vue'
import WorkManagement from './WorkManagement.vue'

export default {
  components: {
    AdminSidebar,
    UserManagement,
    TaskManagement,
    WorkManagement
  },
  setup() {
    const activeTab = ref('users')

    const updateActiveTab = (tab) => {
      activeTab.value = tab
    }

    return {
      activeTab,
      updateActiveTab
    }
  }
}
</script>

<template>
    <div class="container mx-auto p-4 h-screen flex flex-col">
      <div class="flex flex-col md:flex-row gap-4 mb-4">
        <!-- 新增任务框 -->
        <div class="md:w-1/2 bg-white p-4 rounded shadow">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold">任务列表</h2>
            <button @click="showModal = true" class="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
              <PlusIcon class="inline mr-2" />
              新增
            </button>
          </div>
          <div class="overflow-y-auto max-h-[35vh]">
            <div class="space-y-2">
              <div v-for="task in tasks" :key="task.id" class="bg-gray-100 p-2 rounded">
                {{ task.systemName }} - {{ task.responsible }} - {{ task.end_at }} - {{ task.work_classification }}
              </div>
            </div>
          </div>
        </div>
  
        <!-- 任务详情展示区 -->
        <div class="md:w-1/2 bg-white p-4 rounded shadow">
          <h2 class="text-xl font-bold mb-4">任务详情</h2>
          <div class="overflow-y-auto max-h-[35vh]">
            <div v-for="task in tasks" :key="task.id" class="mb-6 p-4 bg-gray-100 rounded">
              <h3 class="font-bold text-lg mb-2">{{ task.systemName }}</h3>
              <p class="mb-1">负责人: {{ task.responsible }}</p>
              <p class="mb-1">评估分类: {{ task.work_classification }}</p>
              <p class="mb-1">截止日期: {{ task.end_at }}</p>
              <div class="mb-1">进度:</div>
              <div class="w-full bg-gray-200 rounded">
                <div
                  class="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded"
                  :style="{ width: `${task.progress}%` }"
                >
                  {{ task.progress }}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- 协助任务区 -->
      <div class="flex-grow overflow-y-auto">
        <h2 class="text-xl font-bold mb-4">协助任务</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div v-for="task in assistTasks" :key="task.id" class="bg-white p-4 rounded shadow">
            <h3 class="font-bold">{{ task.title }}</h3>
            <p class="mt-2">{{ task.content }}</p>
            <button
              @click="completeAssistTask(task.id)"
              class="mt-4 bg-green-500 text-white p-2 rounded hover:bg-green-600 w-full"
            >
              <CheckIcon class="inline mr-2" />
              完成
            </button>
          </div>
        </div>
      </div>
  
      <!-- 新增任务弹窗 -->
      <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div class="bg-white p-4 rounded shadow-lg w-full max-w-md">
          <h2 class="text-xl font-bold mb-4">新增任务</h2>
          <form @submit.prevent="addTask" class="space-y-4">
            <input v-model="newTask.systemName" placeholder="系统名称" class="w-full p-2 border rounded" required />
            <input v-model="newTask.responsible" placeholder="负责人" class="w-full p-2 border rounded" required />
            <input v-model="newTask.end_at" type="date" class="w-full p-2 border rounded" required />
            <div class="flex justify-end space-x-2">
              <button type="button" @click="showModal = false" class="bg-gray-300 text-black p-2 rounded hover:bg-gray-400">
                取消
              </button>
              <button type="submit" class="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                确认
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  import { PlusIcon, CheckIcon } from 'lucide-vue-next'
  import config from '../../util/config'
  
  const tasks = ref([])
  const work_classification = {
    101: '新技术新业务安全评估',
    102: '涉诈风险安全评估',
    }
  
  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${config.getSetting('API_BASE_URL')}/api/admin/GetUserWorkStatuses`,{withCredentials: true})
      tasks.value = response.data.map(task => {
        // 解析 tasks 字段
        const taskDetails = JSON.parse(task.tasks)
        const totalTasks = taskDetails.length
        const completedTasks = taskDetails.filter(t => t.status === '已完成').length
        const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

        return {
          id: task.id,
          systemName: task.system_name,
          responsible: task.username,
          work_classification: work_classification[task.work_classification],
          end_at: task.end_at,
          status: task.status,
          progress: progress
        }
      })
    } catch (error) {
      console.error('Error fetching tasks:', error)
    }
  }

  onMounted(() => {
    fetchTasks()
  })

  const assistTasks = ref([
    { id: 1, title: '协助任务1', content: '任务内容描述' },
    { id: 2, title: '协助任务2', content: '任务内容描述' },
    { id: 3, title: '协助任务3', content: '任务内容描述' },
  ])
  
  const newTask = ref({
    systemName: '',
    responsible: '',
    end_at: '',
  })
  
  const showModal = ref(false)
  
  const addTask = () => {
    tasks.value.push({
      id: tasks.value.length + 1,
      ...newTask.value,
      status: '未开始',
      progress: 0,
    })
    newTask.value = {
      systemName: '',
      responsible: '',
      end_at: '',
    }
    showModal.value = false
  }
  
  const completeAssistTask = (id) => {
    assistTasks.value = assistTasks.value.filter(task => task.id !== id)
  }
  </script>
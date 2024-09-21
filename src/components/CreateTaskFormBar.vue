<template>
    <div class="min-h-screen bg-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8 bg-white p-6 rounded-xl shadow-md">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {{ isNewTask ? '新增任务' : '选择已存在的任务' }}
          </h2>
        </div>
        <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
          <!-- 表单内容 -->
          <div class="rounded-md shadow-sm -space-y-px">
            <div>
              <label for="business-name" class="sr-only">业务系统名称</label>
              <input id="business-name" v-model="form.businessName" name="business-name" type="text" required
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="业务系统名称" />
            </div>
            <div>
              <label for="manager-name" class="sr-only">业务负责人姓名</label>
              <input id="manager-name" v-model="form.managerName" name="manager-name" type="text" required
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="业务负责人姓名" />
            </div>
            <div>
              <label for="manager-phone" class="sr-only">业务负责人联系电话</label>
              <input id="manager-phone" v-model="form.managerPhone" name="manager-phone" type="tel" required
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="业务负责人联系电话" />
            </div>
          </div>

          <div class="space-y-4">
          <div>
            <label class="text-sm font-medium text-gray-700">评估类型</label>
            <div class="mt-2 space-y-2">
              <div class="flex items-center">
                <input id="new-tech" v-model="form.evaluationType" name="evaluation-type" type="radio" value="新技术新业务评估"
                  class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300" />
                <label for="new-tech" class="ml-3 block text-sm font-medium text-gray-700">
                  新技术新业务评估
                </label>
              </div>
              <div class="flex items-center">
                <input id="risk-assessment" v-model="form.evaluationType" name="evaluation-type" type="radio"
                  value="涉诈风险安全评估" class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300" />
                <label for="risk-assessment" class="ml-3 block text-sm font-medium text-gray-700">
                  涉诈风险安全评估
                </label>
              </div>
            </div>
          </div>

          <div>
            <label for="creation-date" class="block text-sm font-medium text-gray-700">创建时间</label>
            <input type="date" id="creation-date" v-model="form.creationDate" name="creation-date" required
              class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
        </div>
  
          <div class="flex flex-col space-y-4">
            <button type="submit"
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              开始评估
            </button>
          </div>

        <!-- 返回按钮 -->
        <div class="flex justify-center mt-4">
          <button
            @click="$emit('back')"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            返回
          </button>
        </div>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import { reactive } from 'vue'

  export default {
    data() {
      return {
        form: reactive({
          businessName: '',
          managerName: '',
          managerPhone: ''
        }),
        isNewTask: true
      }
    },
    setup() {
      
    },
    methods: {
      handleSubmit() {
        console.log('提交的表单数据:', this.form);
        this.$router.push({
          path: '/compile',
          query: {
            businessName: this.form.businessName,
            evaluationType: this.form.evaluationType
          }
        });
      }
    }
  }
  </script>

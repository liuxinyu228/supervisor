<template>
    <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white p-6 rounded-lg shadow-lg w-1/2" style="height: 95vh; overflow-y: auto;">
        <h2 class="text-xl font-bold mb-4">编辑任务</h2>
  
        <label class="block mb-2">任务标题：</label>
        <input
          type="text"
          v-model="editedTask.title"
          class="w-full border p-2 mb-4"
        />
  
        <label class="block mb-2">任务类型：</label>
        <input
          type="text"
          v-model="editedTask.taskCategory	"
          class="w-full border p-2 mb-4"
        />

        <label class="block mb-2">任务描述：</label>
        <p class="w-full border p-2 mb-4">{{ editedTask.description }}</p>

        <label class="block mb-2">评估指引：</label>
        <p class="w-full border p-2 mb-4">{{ editedTask.guide }}</p>

        <label class="block mb-2">检查描述：</label>
        <input
          type="text"
          v-model="editedTask.reportContent"
          class="w-full border p-2 mb-4"
        />
  
        <label class="block mb-2">证明材料：</label>
        <input
          type="file"
          @change="handleFileUpload"
          class="w-full border p-2 mb-4"
        />

        <label class="block mb-2 ">风险判断：</label>
        <select v-model="editedTask.riskValue" class="w-full border p-2 mb-4 bg-white shadow">
          <option value="high">高</option>
          <option value="medium">中</option>
          <option value="low">低</option>
        </select>
  
        <div class="flex justify-end">
          <button @click="$emit('close')" class="bg-gray-500 text-white px-4 py-2 rounded mr-2">取消</button>
          <button @click="saveTask" class="bg-blue-500 text-white px-4 py-2 rounded">保存</button>
        </div>
      </div>
    </div>
    <div v-if="showStatusModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <h2 class="text-xl font-bold mb-4">选择任务状态</h2>
        <select v-model="Status" class="w-full border p-2 mb-4 bg-white shadow">
          <option value="待开始">待开始</option>
          <option value="进行中">进行中</option>
          <option value="整改中">整改中</option>
          <option value="已完成">已完成</option>
        </select>
        <div class="flex justify-end">
          <button @click="closeStatusModal" class="bg-gray-500 text-white px-4 py-2 rounded mr-2">取消</button>
          <button @click="confirmStatus" class="bg-blue-500 text-white px-4 py-2 rounded">确认</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      task: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        editedTask: { ...this.task }, // 创建任务的副本，避免直接修改 props
        showStatusModal: false,
        Status: '进行中',
      };
    },
    methods: {
      saveTask() {
        this.showStatusModal = true; // 显示状态选择弹窗
      },
      closeStatusModal() {
        this.showStatusModal = false; // 关闭状态选择弹窗
      },
      confirmStatus() {
        this.editedTask.status = this.Status; // 设置任务状态
        this.$emit('save', this.editedTask); // 触发保存事件，并传递编辑后的任务
        this.showStatusModal = false; // 关闭状态选择弹窗
      },
      handleFileUpload(event) {
        const file = event.target.files[0];
        this.editedTask.materialPath = file;
      },
    },
  };
  </script>

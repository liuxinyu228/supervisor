<template>
  <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white p-6 rounded-lg shadow-lg w-1/2">
      <h2 class="text-xl font-bold mb-4">新建任务</h2>
      <label class="block mb-2">任务标题：</label>
      <input type="text" v-model="newTask.title" class="w-full border p-2 mb-1" :class="{'border-red-500': !newTask.title && submitted}" />
      <span v-if="!newTask.title && submitted" class="text-red-500 text-sm">此项为必填项</span>
      <label class="block mb-2">任务类型：</label>
      <select v-model="newTask.type" class="w-full border p-2 mb-1 shadow-sm bg-white" :class="{'border-red-500': !newTask.type && submitted}">
        <option value="风险项">风险项</option>
        <option value="保障项">保障项</option>
      </select>
      <span v-if="!newTask.type && submitted" class="text-red-500 text-sm">此项为必填项</span>

      <label class="block mb-2">任务描述：</label>
      <textarea v-model="newTask.description" class="w-full border p-2 mb-1" :class="{'border-red-500': !newTask.description && submitted}"></textarea>
      <span v-if="!newTask.description && submitted" class="text-red-500 text-sm">此项为必填项</span>

      <label class="block mb-2">评估指引：</label>
      <textarea v-model="newTask.guide" class="w-full border p-2 mb-4"></textarea>
      <label class="block mb-2">开始时间：</label>
      <input type="date" v-model="newTask.startAt" class="w-full border p-2 mb-4"  :class="{'border-red-500': !newTask.startAt && submitted}"/>
      <span v-if="!newTask.startAt && submitted" class="text-red-500 text-sm">此项为必填项</span>
      
      <label class="block mb-2">结束时间：</label>
      <input type="date" v-model="newTask.endAt" class="w-full border p-2 mb-4" :class="{'border-red-500': !newTask.endAt && submitted}"/>
      <span v-if="!newTask.endAt && submitted" class="text-red-500 text-sm">此项为必填项</span>
      
      <div class="flex justify-end">
        <button @click="$emit('close')" class="bg-gray-500 text-white px-4 py-2 rounded mr-2">取消</button>
        <button @click="submitted = true; if (validateForm()) saveTask()" class="bg-blue-500 text-white px-4 py-2 rounded">保存</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      newTask: {
        id: 99,
        title: '',
        type: '',
        description: '',
        guide: '',
        startAt: '',
        endAt: '',
        status: '待开始'
      },
      submitted: false
    };
  },
  methods: {
    saveTask() {
      this.$emit('save', this.newTask);
    },
    validateForm() {
      return this.newTask.title && this.newTask.type && this.newTask.description && this.newTask.startAt && this.newTask.endAt;
    }
  }
};
</script>

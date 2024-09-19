<template>
  <div class="bg-white p-4 mb-4 shadow-md rounded-lg">
    <div class="flex justify-between items-center">
      <div :itemid="task.id">
        <span :class="statusClass">{{ task.status }}</span>
        <h3 class="text-lg font-bold">{{ task.title }}</h3>
        <p class="text-gray-500">
          任务类型: {{ task.type }} <br />
          任务描述: {{ task.description }} <br />
          开始时间: {{ task.startAt }} <br />
          结束时间: {{ task.endAt }}
        </p>
      </div>
      <div>
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow" @click="editTask">编辑</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    task: Object,
  },
  computed: {
    statusClass() {
      switch (this.task.status) {
        case '待开始':
          return 'text-yellow-500';
        case '进行中':
          return 'text-green-500';
        case '已完成':
          return 'text-red-500';
        case '已到期':
          return 'text-red-600';
        default:
          return '';
      }
    },
  },
  methods: {
    editTask() {
      this.$emit('edit-task', this.task); // 触发编辑事件，传递当前任务
    },
  },
};
</script>

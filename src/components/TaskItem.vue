<template>
    <div class="bg-white p-4 mb-4 shadow-md rounded-lg">
      <div class="flex justify-between items-center">
        <div :itemid="task.id">
          <span :class="statusClass">{{ task.status }}</span>
          <h3 class="text-lg font-bold">{{ task.title }}</h3>
          <p class="text-gray-500">
            任务类型: {{ task.type }} <br>
            任务编号: {{ task.taskNumber }} <br>
            参与任务人数: {{ task.participants }} <br>
            创建时间: {{ task.createdAt }} <br>
            开始时间: {{ task.startAt }} <br>
            结束时间: {{ task.endAt }}
          </p>
        </div>
        <div>
          <button v-if="task.status === '待开始'" class="btn btn-gray">查看详情</button>
          <button v-if="task.status === '进行中'" class="btn btn-primary">进入任务</button>
          <button v-if="task.status === '已完成'" class="btn btn-gray">查看详情</button>
          <button v-if="task.status === '已到期'" class="btn btn-gray">查看详情</button>
          <button class="btn btn-gray ml-2">编辑</button>
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
  };
  </script>
  
  <style scoped>
  .btn {
    padding: 8px 16px;
    border-radius: 4px;
  }
  .btn-primary {
    background-color: #3490dc;
    color: white;
  }
  .btn-gray {
    background-color: #f5f5f5;
    color: #333;
  }
  </style>
  
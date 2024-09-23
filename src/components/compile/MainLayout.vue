<template>
  <div class="flex">
    <!-- 侧边栏 -->
    <Sidebar />
    
    <!-- 主要内容 -->
    <div class="flex-1 p-6">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import Sidebar from './SidebarBar.vue';

export default {
  components: {
    Sidebar,
  },
  data() {
    return {
      taskData: {
        businessName: this.$route.query.businessName,
        evaluationType: this.$route.query.evaluationType
      }
    };
  },
  mounted() {
    // 页面渲染完成后执行的代码
    this.debug();
  },
  methods: {
    debug() {
      console.log('接收到的任务数据:', this.taskData);
    }
  }

};
</script>

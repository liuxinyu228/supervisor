<template>
  <div class="user-info flex justify-between items-center p-4 bg-gray-100 rounded relative">
    <span class="username font-bold" @click="toggleOptions">{{ userInfo ? userInfo.userId : '加载中...' }}</span>
    <div v-if="showOptions" class="options bg-white shadow-md rounded p-2">
      <button class="btn-secondary text-black hover:bg-gray-300 py-2 px-4 rounded" @click="logout">退出</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      API_BASE_URL:"http://127.0.0.1:3000",
      showOptions: false,
      userInfo: null,
    };
  },
  methods: {
    toggleOptions() {
      this.showOptions = !this.showOptions;
    },
    logout() {
      axios.post(`${this.API_BASE_URL}/api/logout`, {}, { withCredentials: true })
        .then(response => {
          console.log(response.data.message);
          // 处理成功注销后的逻辑，比如重定向到登录页面
          this.$router.push('/login');
        })
        .catch(error => {
          console.error('Logout failed:', error.response.data.message);
          // 处理注销失败的逻辑
        });
    },
    getUserInfo() {
      axios.get(`${this.API_BASE_URL}/api/getUserInfo`, { withCredentials: true })
        .then(response => {
          this.userInfo = response.data;
          console.log('User Info:', this.userInfo);
        })
        .catch(error => {
          console.error('Error fetching user info:', error.message);
        });
    }
  },
  mounted() {
    this.getUserInfo();
  }
};
</script>

<style scoped>
.user-info {
  position: relative;
}

.options {
  position: absolute;
  bottom: 100%;
  left: 0;
  transform: translateY(-10px);
  /* 其他样式 */
}
</style>

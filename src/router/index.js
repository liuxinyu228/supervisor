import { createRouter, createWebHistory } from 'vue-router';
import MainLayout from '../components/compile/MainLayout.vue';
import TaskPage from '../components/compile/TaskPage.vue';
import TaskTimeLine from '../components/compile/timeline/TimeLineBar.vue';
import CreateTaskMange from '../components/CreateWorkMange.vue';
import UserLogin from '../components/UserLogin.vue';
import FileManager from '../components/compile/filemanager/FileManagerBar.vue';

const routes = [
  {
    path: '/compile',
    component: MainLayout,
    children: [
      { path: '', component: TaskPage },
      { path: 'timeline', component: TaskTimeLine },
      { path: 'filemanager', component: FileManager}
    ],
  },
  { path: '/opt', component: CreateTaskMange },
  { path: '/login', component: UserLogin },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 导航守卫
router.beforeEach(async (to, from, next) => {
  const response = await fetch('http://127.0.0.1:3000/api/checkLogin', {
    credentials: 'include' // 携带凭证
  });
  const data = await response.json();

  if (to.path !== '/login' && !data.loggedIn) {
    next('/login'); // 未登录，跳转到登录页面
  } else {
    next(); // 已登录，继续导航
  }
});

export default router;

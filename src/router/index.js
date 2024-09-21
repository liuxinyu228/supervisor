import { createRouter, createWebHistory } from 'vue-router';
import MainLayout from '../components/Inside/MainLayout.vue';
import TaskPage from '../components/Inside/TaskPage.vue';
import TaskTimeLine from '../components/Inside/TimeLineBar.vue';
import CreateTaskMange from '../components/CreateTaskMange.vue';

const routes = [
  {
    path: '/compile',
    component: MainLayout,
    children: [
      { path: '', component: TaskPage },
      { path: 'timeline', component: TaskTimeLine },
    ],
  },
  { path: '/', component: CreateTaskMange },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

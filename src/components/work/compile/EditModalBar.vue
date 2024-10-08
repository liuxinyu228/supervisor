<template>
    <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white p-6 rounded-lg shadow-lg w-1/2" style="height: 95vh; overflow-y: auto;">
        <h2 class="text-xl font-bold mb-4">{{ isViewOnly ? '查看任务' : '编辑任务' }}</h2>
  
        <label class="block mb-2">任务标题：</label>
        <p class="w-full border p-2 mb-4">{{ editedTask.title }}</p>
  
        <label class="block mb-2">任务类型：</label>
        <p class="w-full border p-2 mb-4">{{ editedTask.taskCategory }}</p>
  
        <label class="block mb-2">任务描述：</label>
        <p class="w-full border p-2 mb-4">{{ editedTask.description }}</p>
  
        <label class="block mb-2">评估指引：</label>
        <p class="w-full border p-2 mb-4">{{ editedTask.guide }}</p>
  
        <label class="block mb-2">检查描述：</label>
        <input
          type="text"
          v-model="editedTask.reportContent"
          class="w-full border p-2 mb-4"
          :disabled="isViewOnly"
        />
  
        <label class="block mb-2">证明材料：</label>
        <div v-if="!isViewOnly">
          <input
            type="file"
            accept=".jpeg,.png,.jpg"
            @change="handleFileUpload"
            class="w-full border p-2 mb-4"
          />
          <div v-if="editedTask.materialPath.length > 0" class="flex flex-wrap gap-2">
            <div
              v-for="(file, index) in editedTask.materialPath"
              :key="index"
              class="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm flex items-center"
               @click="downloadFile(file.id)"
              >
              <span class="mr-1">{{ file.path }}</span>
              <button
                @click="removeFile(file.id)"
                class="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
    
        <div v-else class="w-full border p-2 mb-4">
          <div v-if="editedTask.materialPath.length > 0" class="flex flex-wrap gap-2">
            <div
              v-for="(file, index) in editedTask.materialPath"
              :key="index"
              class="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm flex items-center"
              @click="downloadFile(file.id)"
            >
              <span class="mr-1">{{ file.path }}</span>
            </div>
          </div>
        </div>
  
        <label class="block mb-2">风险判断：</label>
        <select v-model="editedTask.riskValue" class="w-full border p-2 mb-4 bg-white shadow" :disabled="isViewOnly">
          <option value="high">高</option>
          <option value="medium">中</option>
          <option value="low">低</option>
        </select>
  
        <div class="flex justify-end">
          <button @click="$emit('close')" class="bg-gray-500 text-white px-4 py-2 rounded mr-2">取消</button>
          <button v-if="!isViewOnly" @click="saveTask" class="bg-blue-500 text-white px-4 py-2 rounded">保存</button>
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
    <div v-if="showAlert" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <h2 class="text-xl font-bold mb-4">{{ alertMessage }}</h2>
        <div class="flex justify-end">
          <button @click="closeAlert" class="bg-blue-500 text-white px-4 py-2 rounded">确认</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { formatDate } from '@/util/util';
  import axios from 'axios';
  import config from '../../../util/config'

  export default {
    props: {
      task: {
        type: Object,
        required: true,
      },
      isViewOnly: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        editedTask: this.initializeTask(), // 初始化任务
        showStatusModal: false,
        Status: '进行中',
        showAlert: false,
        alertMessage: '',
      };
    },
    computed: {
      downloadLink() {
        return `${config.getSetting('API_BASE_URL')}/api/downloadTaskMaterial/${this.editedTask.id}`;
      }
    },
    methods: {
      initializeTask() {
        console.log(this.task.materialPath)
        return {
          id: this.task.id,
          title: this.task.title ? this.task.title : '',
          taskCategory: this.task.taskCategory ? this.task.taskCategory : '',
          description: this.task.description ? this.task.description : '',
          guide: this.task.guide ? this.task.guide : '',
          reportContent: this.task.reportContent ? this.task.reportContent : '',
          materialPath: this.task.materialPath ? this.task.materialPath : [{id:1,path:""}],
          riskValue: this.task.riskValue ? this.task.riskValue : 'low',
          status: this.task.status ? this.task.status : '待开始',
          created_at: this.task.created_at,
          updated_at: this.task.updated_at
        };
      },
      saveTask() {
        this.showStatusModal = true; // 显示状态选择弹窗
      },
      closeStatusModal() {
        this.showStatusModal = false; // 关闭状态选择弹窗
      },
      confirmStatus() {
        this.editedTask.status = this.Status; // 设置任务状态
        
        // 定义 formData 参数
        const formData = {
          status: this.editedTask.status ?  this.editedTask.status : '进行中',
          reportContent: this.editedTask.reportContent ? this.editedTask.reportContent : '',
          riskValue: this.editedTask.riskValue ? this.editedTask.riskValue : 'low'
        };
        console.log(this.editedTask);
        // 使用 fetch 调用 /updateTask/:taskId 接口修改任务内容
        fetch(`${config.getSetting('API_BASE_URL')}/api/updateTask/${this.editedTask.id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include', // 携带凭证
          body: JSON.stringify(formData)
        })
        .then(response => {
          if (!response.ok) {
            response.json().then(data => {
              this.showAlertMessage('任务更新失败: ' + data.message);
            });
            this.showStatusModal = false; // 关闭状态选择弹窗
            return;
          }
          this.$emit('save', this.editedTask, true); // 触发保存事件，并传递编辑后的任务
          this.editedTask.updated_at = formatDate(); // 修改updated_at，格式为YYYY-MM-DD HH:mm
          this.showStatusModal = false; // 关闭状态选择弹窗
          this.showAlertMessage('任务更新成功');
        })
        .catch(error => {
          console.error('任务更新失败:', error);
          this.showAlertMessage('任务更新失败');
        });
      },
      handleFileUpload(event) {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('file', file);

        fetch(`${config.getSetting('API_BASE_URL')}/api/updateTaskMaterial/${this.editedTask.id}`, {
          method: 'POST',
          credentials: 'include', // 携带凭证
          body: formData
        })
        .then(response => {
          if (!response.ok) {
            if (response.status === 400) {
              this.showAlertMessage('文件上传数量达到最大'); 
              return;
            }
            this.showAlertMessage('文件上传失败'); 
            return;
          }

          const data =  response.json();
          this.editedTask.materialPath = data.filePath;
          this.$emit('save', this.editedTask, false); // 触发保存事件，并传递编辑后的任务
          this.showAlertMessage('文件上传成功');
        })
        .catch(error => {
          console.error('文件上传失败:', error);
          this.showAlertMessage('文件上传失败');
        });
      },
      showAlertMessage(message) {
        this.alertMessage = message;
        this.showAlert = true;
      },
      closeAlert() {
        this.showAlert = false;
      },
      removeFile(fileId) {
        // 从 editedTask.materialPath 中移除指定的文件
        this.editedTask.materialPath = this.editedTask.materialPath.filter(file => file.id !== fileId);

        // 调用后端接口更新数据库
        fetch(`${config.getSetting('API_BASE_URL')}/api/removeTaskMaterial/${this.editedTask.id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include', // 携带凭证
          body: JSON.stringify({ fileId })
        })
        .then(response => {
          if (!response.ok) {
            this.showAlertMessage('文件移除失败');
            return;
          }
          return response.json();
        })
        .then(data => {
          this.showAlertMessage('文件移除成功');
          // 更新前端的 materialPath
          this.editedTask.materialPath = data.materialPath;
        })
        .catch(error => {
          console.error('文件移除失败:', error);
          this.showAlertMessage('文件移除失败');
        });
      },
      downloadFile(fileId) {
        const downloadUrl = `${config.getSetting('API_BASE_URL')}/api/downloadTaskMaterial/${this.editedTask.id}?fileId=${fileId}`;

        axios.get(downloadUrl, {
            responseType: 'blob', // 确保响应类型为 blob
            withCredentials: true // 携带凭证
        })
        .then(response => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            window.open(url, '_blank'); // 在新窗口中打开文件
        })
        .catch(error => {
            console.error('文件预览失败:', error);
            this.showAlertMessage('文件预览失败');
        });
      },
    },
  };
  </script>
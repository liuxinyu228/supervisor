<template>
    <div class="flex space-x-4">
      <select class="border-gray-300 p-2 rounded-md">
        <option>任务类型</option>
        <option>风险项</option>
        <option>保障项</option>
      </select>
      <select class="border-gray-300 p-2 rounded-md">
        <option>状态</option>
        <option>待开始</option>
        <option>进行中</option>
        <option>已完成</option>
        <option>已到期</option>
      </select>
      <input type="text" placeholder="搜索任务" class="border-gray-300 p-2 rounded-md flex-1">
      <button class="bg-blue-500 text-white p-2 rounded-md">搜索</button>
    </div>
  </template>
  
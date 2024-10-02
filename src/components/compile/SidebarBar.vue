<template>
    <div class="w-64 bg-gray-100 max-h-full p-4">
      <h1 class="text-2xl font-bold">LOGO</h1>
      <nav class="mt-6">
        <ul>
          <li class="mb-2">
            <router-link to="/compile" class="text-gray-500" active-class="text-blue-600" exact-active-class="text-blue-600">
              评估任务
            </router-link>
          </li>
          <li class="mb-2">
            <router-link to="/compile/timeline" class="text-gray-500" active-class="text-blue-600" exact-active-class="text-blue-600">
              事件时间线
            </router-link>
          </li>
          <li class="mb-2">
            <router-link to="/compile/filemanager" class="text-gray-500" active-class="text-blue-600" exact-active-class="text-blue-600">
              参考文件管理
            </router-link>
          </li>
        </ul>
      </nav>
    </div>
</template>

<style>

</style>

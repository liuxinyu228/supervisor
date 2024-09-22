const express = require('express');
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');
const app = express();
const cors = require('cors');

app.use(express.json()); // 用于解析JSON格式的请求体
app.use(cors());

// 使用用户路由
app.use('/api', userRoutes);
app.use('/api', taskRoutes);

module.exports = app;

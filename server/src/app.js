const express = require('express');
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');
const fileManagerRoutes = require('./utils/filemanager')
const app = express();
const cors = require('cors');
const session = require('express-session');

app.use(express.json()); // 用于解析JSON格式的请求体
app.use(cors({
  origin: 'http://127.0.0.1:8080', // 前端地址
  credentials: true // 允许携带凭证
}));

app.use(session({
  secret: 'liuxinyu',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// 使用用户路由
app.use('/api', userRoutes);
app.use('/api', taskRoutes);
app.use('/api', fileManagerRoutes);

module.exports = app;

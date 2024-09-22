// server/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const cardUser = require('../models/cardUser');

// 获取所有用户
router.get('/users', (req, res) => {
  cardUser.getAllUsers((err, results) => {  
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(200).json(results);
    }
  });
});

// 获取单个用户
router.get('/users/:id', (req, res) => {
  cardUser.getUserById(req.params.id, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (!result) {
      res.status(404).json({ message: 'User not found' });
    } else {
      res.status(200).json(result);
    }
  });
});

// 添加用户
router.post('/users', (req, res) => {
  cardUser.addUser(req.body, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(201).json({ message: 'User added', userId: result.insertId });
    }
  });
});

// 删除用户
router.delete('/users/:id', (req, res) => {
  cardUser.deleteUser(req.params.id, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(200).json({ message: 'User deleted' });
    }
  });
});

// 更新用户
router.put('/users/:id', (req, res) => {
  cardUser.updateUser(req.params.id, req.body, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(200).json({ message: 'User updated' });
    }
  });
});

module.exports = router;

const express = require('express');
const router = express.Router();
const taskTemplate = require("../models/cardTaskTemplate")

// 获取所有用户
router.get('/taskTemplate/:taskType', (req, res) => {
    taskTemplate.getAllTaskByType(req.params.taskType,(err, results) => {  
        if (err) {
          res.status(500).json({ error: err.message });
        } else {
          res.status(200).json(results);
        }
      })
  });

  module.exports = router;

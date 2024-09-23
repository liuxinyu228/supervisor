const express = require('express');
const session = require('express-session');
const router = express.Router();
const taskTemplate = require("../models/cardTask");
const db = require('../config/db'); 


// 根据工作类型获取所有任务模板
router.get('/taskTemplate/:taskType', (req, res) => {
    taskTemplate.getAllTaskByType(req.params.taskType, (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(200).json(results);
        }
    });
});

// 新增接口：查询用户下所有评估业务系统
router.get('/userSystems', (req, res) => {
    const username = req.session.userId; // 从 session 中获取用户名
    console.log("userSystem:", req.session);

    if (!username) {
        return res.status(401).json({ message: 'User not logged in' });
    }

    // 获取分页参数，默认 limit 为 5，page 为 1
    const limit = parseInt(req.query.limit) || 5;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * limit;

    const query = ` 
        SELECT cs.system_name, cs.workclassification, cs.superintendent_name, cs.created_at
        FROM card_users cu
        JOIN businessSystemList bsl ON cu.businessSystemListID = bsl.user_businessSystem_list_id
        JOIN card_system cs ON bsl.businessSystem_id = cs.system_id
        WHERE cu.username = ?
        LIMIT ? OFFSET ?;
    `;

    db.query(query, [username, limit, offset], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(200).json({
                data: results,
                limit: limit,
                page: page
            });
        }
    });
});


module.exports = router;

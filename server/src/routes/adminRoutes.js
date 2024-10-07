const express = require('express');
const router = express.Router();
const db = require('../config/db'); 

// 新增接口：查询 persona_id 为 606 的用户下的所有评估系统
router.get('/GetUserWorkStatuses', async (req, res) => {
    try {
        db.query(`
            SELECT 
                card_system.system_name, 
                card_users.username, 
                card_system.end_at, 
                card_system.work_classification, 
                JSON_ARRAYAGG(JSON_OBJECT('id', card_task.id, 'status', card_task.status)) AS tasks
            FROM 
                card_users
            JOIN 
                user_businesssystem_map ON card_users.businessSystemListID = user_businesssystem_map.user_businessSystem_list_id
            JOIN 
                card_system ON user_businesssystem_map.businessSystem_id = card_system.system_id
            LEFT JOIN 
                card_task ON card_system.task_id = card_task.task_id
            WHERE 
                card_users.persona_id = 606
            GROUP BY 
                card_system.system_name, card_users.username, card_system.end_at, card_system.work_classification
        `, (error, results) => {
            if (error) {
                console.error('Error fetching evaluations:', error);
                return res.status(500).send('Server Error');
            }

            console.log("Query result:", JSON.stringify(results, null, 2));
            res.json(results);
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
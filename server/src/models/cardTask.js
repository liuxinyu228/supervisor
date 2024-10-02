// 评估任务模板对象
const connection = require('../config/db');
const { decrypt } = require('../utils/util');

class cardTaskTemplate {
    // 根据工作分类 workClassification 查询所有的任务详情。
    static getAllTaskByType(taskType, callback) {
        const sql = 'SELECT * FROM card_task_template where workClassification = ?';
        connection.query(sql, [taskType], callback);
    }
}

class cardTask {
    constructor(username, systemName, workClassification) {
        this.username = username;
        this.systemName = systemName;
        this.workClassification = workClassification;
    }

    static getUserWorkTasks(groupId, encryptedTaskInfo, callback) {
        let systemInfo;
        try {
            systemInfo = JSON.parse(decrypt(encryptedTaskInfo));
            console.log("taskInfo:", systemInfo);
        } catch (error) {
            return callback(new Error('Failed to decrypt system information'));
        }

        const query = `
            SELECT 
                ct.id,
                ct.title,
                ct.status,
                ct.work_classification,
                ct.description,
                ct.guide,
                ct.reportContent,
                ct.materialPath,
                ct.taskCategory,
                DATE_FORMAT(ct.created_at, '%Y-%m-%d %H:%i') as created_at,
                DATE_FORMAT(ct.updated_at, '%Y-%m-%d %H:%i') as updated_at
            FROM 
                card_task ct
            JOIN 
                card_system cs ON ct.task_id = cs.task_id
            JOIN 
                user_businesssystem_map ubm ON cs.system_id = ubm.businessSystem_id
            JOIN 
                card_users cu ON ubm.user_businessSystem_list_id = cu.businessSystemListID
            WHERE 
                cu.group_id = ?
                AND cs.system_name = ?
                AND ct.work_classification = ?;
        `;

        connection.query(query, [groupId, systemInfo.system_name, systemInfo.work_classification], callback);
    }

    static updateTaskById(id, updatedTaskInfo, callback) {
        const sql = `
            UPDATE card_task 
            SET
                status = ? ,
                reportContent = ?, 
                materialPath = ?, 
                riskValue = ?,
                updated_at = NOW()
            WHERE 
                id = ?;
        `;
        const {
            status,
            reportContent, 
            materialPath, 
            riskValue
        } = updatedTaskInfo;


        connection.query(sql, [
            status,
            reportContent, 
            materialPath, 
            riskValue,
            id
        ], callback);
    }
}

module.exports = { cardTaskTemplate, cardTask };

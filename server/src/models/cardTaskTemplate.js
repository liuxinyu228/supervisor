// 评估任务模板对象
const connection = require('../config/db');



class cardTaskTemplate{
    // 根据工作分类 workClassification 查询所有的任务详情。
    static getAllTaskByType(taskType, callback){
        const sql = 'SELECT * FROM card_task_template where workClassification = ?';
        connection.query(sql, [taskType], callback);
    }
}

module.exports = cardTaskTemplate;

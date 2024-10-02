const express = require('express');
const router = express.Router();
const db = require('../config/db'); 
const { v4: uuidv4 } = require('uuid');
const {cardTaskTemplate,cardTask} = require("../models/cardTask");
const { decrypt } = require('../utils/util');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

// 根据工作类型获取所有任务模板
router.get('/taskTemplate/:taskType', (req, res) => {
    cardTaskTemplate.getAllTaskByType(req.params.taskType, (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(200).json(results);
        }
    });
});

// 新增接口：查询用户下所有评估业务系统
router.get('/userWorks', (req, res) => { 
    const username = req.session.userId; // 从 session 中获取用户名
    const groupId = req.session.groupId; // 从查询参数中获取 group_id
    const personaId = req.session.personaId; // 从查询参数中获取 persona_id

    if (!username) {
        return res.status(401).json({ message: 'User not logged in' });
    }

    // 获取分页参数，默认 limit 为 5，page 为 1
    const limit = parseInt(req.query.limit) || 5;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * limit;

    let query = `
        SELECT cs.system_name, cs.work_classification, cs.superintendent_name, cs.created_at
        FROM card_system cs
        JOIN user_businesssystem_map ubm ON cs.system_id = ubm.businessSystem_id
        WHERE ubm.group_id = ?
    `;

    const queryParams = [groupId];

    if (personaId == 707) {
        query += ' AND cs.superintendent_name = ?';
        queryParams.push(username);
    }

    query += ' LIMIT ? OFFSET ?';
    queryParams.push(limit, offset);

    console.log("userWorks sql:", query)
    console.log("userWorks parms:", queryParams)

    db.query(query, queryParams, (err, results) => {
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

// 新增接口：根据用户名、系统名称和工作分类查询任务
router.get('/userWorkTasks', (req, res) => {
    const username = req.session.userId; // 从 session 中获取用户名
    const groupId = req.session.groupId

    if (!username) {
        return res.status(401).json({ message: 'User not logged in' });
    }

    // 从 Cookie 中获取加密的系统信息并解密
    const encryptedTaskInfo = req.cookies.taskInfo;

    cardTask.getUserWorkTasks(groupId, encryptedTaskInfo, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        } else {
            return res.status(200).json(results);
        }
    });
});

// 新增接口：新增评估系统
router.post('/addUserWork', (req, res) => {
    const username = req.session.userId; // 从 session 中获取用户名

    if (!username) {
        return res.status(401).json({ message: 'User not logged in' });
    }

    const { businessSystemName, superintendentName, superintendentPhone, superintendentEmail, workClassification, creationDate } = req.body;

    // 先查询是否存在同名同任务类型的评估任务
    const checkQuery = `
        SELECT * FROM card_task ct
        JOIN card_system cs ON ct.task_id = cs.task_id
        JOIN user_businesssystem_map ubm ON cs.system_id = ubm.businessSystem_id
        JOIN card_users cu ON ubm.user_businessSystem_list_id = cu.businessSystemListID
        WHERE cu.username = ? AND cs.system_name = ? AND ct.work_classification = ?;
    `;

    db.query(checkQuery, [username, businessSystemName, workClassification], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (results.length > 0) {
            return res.status(400).json({ message: 'Evaluation system with the same name and task type already exists' });
        }

        const taskId = uuidv4();

        // 在 card_system 中创建评估系统记录
        const insertSystemQuery = `
            INSERT INTO card_system (system_name, superintendent_name, superintendent_phone, superintendent_email, work_classification, task_id, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?);
        `;

        db.query(insertSystemQuery, [businessSystemName, superintendentName, superintendentPhone, superintendentEmail, workClassification, taskId, creationDate], (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            const systemId = result.insertId;

            // 将创建的评估系统记录与 card_users 中对应的用户进行关联
            const insertUserSystemMapQuery = `
                INSERT INTO user_businesssystem_map (user_businessSystem_list_id, businessSystem_id)
                SELECT businessSystemListID, ? FROM card_users WHERE username = ?;
            `;

            db.query(insertUserSystemMapQuery, [systemId, username], (err) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }

                // 根据 workClassification 参数的值在 card_task_template 表中查询出对应的任务
                const selectTaskTemplateQuery = `
                    SELECT * FROM card_task_template WHERE work_classification = ?;
                `;

                db.query(selectTaskTemplateQuery, [workClassification], (err, taskTemplates) => {
                    if (err) {
                        return res.status(500).json({ error: err.message });
                    }

                    // 在 card_task 表中新增对应记录，并关联 task_id
                    const insertTaskQuery = `
                        INSERT INTO card_task (title, work_classification, description, guide, reportContent, materialPath, taskCategory, created_at, updated_at, task_id)
                        VALUES ?;
                    `;

                    const taskValues = taskTemplates.map(task => [
                        task.title,
                        task.work_classification,
                        task.description,
                        task.guide,
                        task.reportContent,
                        task.materialPath,
                        task.taskCategory,
                        new Date(),
                        new Date(),
                        taskId // 关联 task_id
                    ]);

                    db.query(insertTaskQuery, [taskValues], (err) => {
                        if (err) {
                            return res.status(500).json({ error: err.message });
                        }

                        res.status(200).json({ message: 'Evaluation system and tasks added successfully' });
                    });
                });
            });
        });
    });
});

// 新增接口：根据任务ID修改任务
router.post('/updateTask/:id', (req, res) => {
    const taskId = req.params.id;
    const updatedTaskInfo = req.body;
    const personaId = req.session.personaId; // 获取 persona_id

    if (personaId == 707) {
        return res.status(403).json({ status: false,message: 'Permission denied' });
    }

    cardTask.updateTaskById(taskId, updatedTaskInfo, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        } else {
            return res.status(200).json({ message: 'Task updated successfully' });
        }
    });
});

// 新增接口：根据任务ID修改materialPath值，并且存储文件到项目根目录下的uploads/system_name/work_classification目录下
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const { system_name, work_classification } = JSON.parse(decrypt(req.cookies.taskInfo)); // 从 Cookie 中获取加密的系统信息并解密
        const decodedSystemName = Buffer.from(system_name, 'latin1').toString('utf8'); // 处理 system_name 为中文的情况
        const uploadDir = path.join(__dirname, '../../uploads', decodedSystemName, work_classification);
        fs.mkdirSync(uploadDir, { recursive: true });
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const decodedFileName = Buffer.from(file.originalname, 'latin1').toString('utf8'); // 处理文件名称为中文的情况
        cb(null, decodedFileName);
    }
});

const upload = multer({ storage });

router.post('/updateTaskMaterial/:id', upload.single('file'), (req, res) => {
    const taskId = req.params.id;
    const personaId = req.session.personaId; // 获取 persona_id

    if (personaId == 707) {
        return res.status(403).json({ message: 'Permission denied' });
    }

    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const file = req.file;
    const decodedFileName = Buffer.from(file.originalname, 'latin1').toString('utf8'); // 处理文件名称为中文的情况
    const relativeFilePath = path.relative(path.join(__dirname, '../../'), path.join(file.destination, decodedFileName));

    // 更新任务的 materialPath 值
    const updateQuery = `
        UPDATE card_task
        SET materialPath = ?
        WHERE id = ?;
    `;

    db.query(updateQuery, [relativeFilePath, taskId], (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        res.status(200).json({ taskId: taskId, filePath: relativeFilePath });
    });
});

// 新增接口：根据任务ID下载上传的文件
router.get('/downloadTaskMaterial/:id', (req, res) => {
    const taskId = req.params.id;

    const query = `
        SELECT materialPath FROM card_task WHERE id = ?;
    `;

    db.query(query, [taskId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const filePath = path.join(__dirname, '../../', results[0].materialPath);

        res.download(filePath, (err) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
        });
    });
});

module.exports = router;
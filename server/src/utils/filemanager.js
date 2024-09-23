const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../config/db'); // 引入数据库配置
const router = express.Router();

const UPLOAD_FILE_BASE = "../../uploads";

// 设置文件存储配置
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, UPLOAD_FILE_BASE));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// 创建表
db.query(`
  CREATE TABLE IF NOT EXISTS directories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    isOpen BOOLEAN DEFAULT 0
  )
`);

db.query(`
  CREATE TABLE IF NOT EXISTS files (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    path VARCHAR(255) NOT NULL,
    directory_id INT,
    FOREIGN KEY (directory_id) REFERENCES directories(id)
  )
`);

// 获取目录和文件
router.get('/directories', (req, res) => {
  db.query("SELECT * FROM directories", (err, directories) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    const dirPromises = directories.map(dir => {
      return new Promise((resolve, reject) => {
        db.query("SELECT * FROM files WHERE directory_id = ?", [dir.id], (err, files) => {
          if (err) {
            reject(err);
          } else {
            dir.files = files;
            resolve(dir);
          }
        });
      });
    });
    Promise.all(dirPromises)
      .then(results => res.json(results))
      .catch(err => res.status(500).json({ error: err.message }));
  });
});

// 创建目录
router.post('/directories', (req, res) => {
  const { name } = req.body;

  db.query("SELECT * FROM directories WHERE name = ?", [name], (err, rows) => {
    if (rows.length > 0) {
      return res.json({ status: false, message: '目录名称已存在' });
    }

    db.query("INSERT INTO directories (name, isOpen) VALUES (?, ?)", [name, 0], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      const newDirectory = { id: result.insertId, name, files: [], isOpen: false };
      const uploadBasePath = path.join(__dirname, UPLOAD_FILE_BASE);
      if (!fs.existsSync(uploadBasePath)) {
        fs.mkdirSync(uploadBasePath, { recursive: true });
      }
      const directoryPath = path.join(uploadBasePath, name);
      fs.mkdirSync(directoryPath, { recursive: true });
      res.json({ status: true, directory: newDirectory });
    });
  });
});

// 添加文件
router.post('/files', upload.single('file'), (req, res) => {
  const { directory_id, name } = req.body;
  db.query("SELECT * FROM directories WHERE id = ?", [directory_id], (err, rows) => {
    if (rows.length > 0) {
      const directory = rows[0];
      const newFilePath = path.join(UPLOAD_FILE_BASE, directory.name, name || req.file.originalname);
      db.query("INSERT INTO files (name, path, directory_id) VALUES (?, ?, ?)", [name || req.file.originalname, newFilePath, directory_id], (err, result) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        const newFile = { id: result.insertId, name: name || req.file.originalname, path: newFilePath };
        const targetPath = path.join(__dirname, newFilePath);
        fs.rename(req.file.path, targetPath, (err) => {
          if (err) {
            return res.status(500).json({ error: '文件存储失败' });
          }
          res.json(newFile);
        });
      });
    } else {
      res.status(404).json({ error: 'Directory not found' });
    }
  });
});

// 删除文件
router.delete('/files/:file_id', (req, res) => {
  const { file_id } = req.params;
  db.query("SELECT * FROM files WHERE id = ?", [file_id], (err, rows) => {
    if (rows.length > 0) {
      const file = rows[0];
      const filePath = path.join(__dirname, file.path);
      fs.unlink(filePath, (err) => {
        if (err) {
          return res.status(500).json({ error: '文件删除失败' });
        }
        db.query("DELETE FROM files WHERE id = ?", [file_id], (err) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          res.json({ success: true });
        });
      });
    } else {
      res.status(404).json({ error: 'File not found' });
    }
  });
});

// 下载文件
router.get('/files/:file_id/download', (req, res) => {
  const { file_id } = req.params;
  db.query("SELECT * FROM files WHERE id = ?", [file_id], (err, rows) => {
    if (rows.length > 0) {
      const file = rows[0];
      console.log(__dirname)
      const filePath = path.join(__dirname, file.path);
      res.download(filePath, file.name, (err) => {
        if (err) {
          return res.status(500).json({ error: '文件下载失败' });
        }
      });
    } else {
      res.status(404).json({ error: 'File not found' });
    }
  });
});

module.exports = router;

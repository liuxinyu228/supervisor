const fs = require('fs');
const path = require('path');

class FileManager {
    constructor(basePath) {
        this.basePath = basePath;
    }

    createDirectory(dirPath) {
        const fullPath = path.join(this.basePath, dirPath);
        if (!fs.existsSync(fullPath)) {
            fs.mkdirSync(fullPath, { recursive: true });
        }
        return fullPath;
    }

    saveFile(file, dirPath) {
        const fullPath = this.createDirectory(dirPath);
        const decodedFileName = Buffer.from(file.originalname, 'latin1').toString('utf8');
        const filePath = path.join(fullPath, decodedFileName);
        fs.renameSync(file.path, filePath);
        return filePath;
    }

    deleteFile(filePath) {
        const fullPath = path.join(this.basePath, filePath);
        if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
        }
    }

    downloadFile(res, filePath, fileName) {
        const fullPath = path.join(this.basePath, filePath);
        res.download(fullPath, fileName, (err) => {
            if (err) {
                res.status(500).json({ error: '文件下载失败', message: err.message });
            }
        });
    }
}

module.exports = FileManager;

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');  // 用于生成唯一ID
const router = express.Router();

// 使用 body-parser 来解析请求体
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

// 测试数据，用户名liuxinyu，密码liuliu228@
const users = {
    liuxinyu: 'liuliu228@'
};

// 存储生成的验证码
let captchas = {};

// 生成验证码的简单函数 (可以根据需要修改)
function generateCaptcha() {
    return Math.floor(1000 + Math.random() * 9000).toString(); // 4位数字验证码
}

// /captcha 接口，生成并返回验证码
router.get('/captcha', (req, res) => {
    const captcha = generateCaptcha();
    const captchaId = uuidv4();  // 为验证码生成唯一ID

    // 保存验证码，绑定到会话
    captchas[captchaId] = captcha;
    req.session.captchaId = captchaId;  // 将 captchaId 绑定到用户 session

    res.json({ captchaId, captcha });  // 返回给客户端
});

// /login 接口，处理登录逻辑
router.post('/login', (req, res) => {
    const { username, password, captchaId, captcha } = req.body;

    console.log(username,password,captchaId,captcha)
    // 验证用户名和密码
    if (!users[username] || users[username] !== password) {
        return res.status(401).json({ message: 'Invalid username or password' });
    }

    // 验证验证码
    if (!captchaId || !captchas[captchaId] || captchas[captchaId] !== captcha) {
        return res.status(400).json({ message: 'Invalid or expired captcha' });
    }

    // 登录成功，创建 session
    req.session.userId = username;

    console.log("登陆成功：",req.session)
    // 登录成功后删除已使用的验证码
    delete captchas[captchaId];

    res.json({ message: 'Login successful', session: req.sessionID });
});

// 新增 /checkLogin 接口，检查用户是否已登录
router.get('/checkLogin', (req, res) => {
    if (req.session.userId) {
        res.json({ loggedIn: true, userId: req.session.userId });
    } else {
        res.json({ loggedIn: false });
    }
});

module.exports = router;
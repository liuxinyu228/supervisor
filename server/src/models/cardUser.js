const connection = require('../config/db');

class cardUser {
  // 查询所有用户
  static getAllUsers(callback) {
    const sql = 'SELECT * FROM card_users';
    connection.query(sql, callback);
  }

  // 根据ID查询用户
  static getUserById(id, callback) {
    const sql = 'SELECT * FROM card_users WHERE user_id = ?';
    connection.query(sql, [id], callback);
  }


  // 新增用户
  static addUser(user, callback) {
    // 定义user对象的结构
    const userStructure = {
      username: user.name,
      password: user.password,
      status: 0,
      email: user.email,
      phone:user.phone,
      is_admin:0
    };
    const sql = 'INSERT INTO users SET ?';
    connection.query(sql, user, callback);
  }

  // 删除用户
  static deleteUser(id, callback) {
    const sql = 'DELETE FROM users WHERE user_id = ?';
    connection.query(sql, [id], callback);
  }

  // 修改用户
  static updateUser(id, user, callback) {
    const sql = 'UPDATE users SET ? WHERE user_id = ?';
    connection.query(sql, [user, id], callback);
  }
}

module.exports = cardUser;

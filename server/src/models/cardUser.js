const connection = require('../config/db');

class cardUser {
  // 查询所有用户
  static getAllUsers(callback) {
    const sql = 'SELECT id,username, status, email, is_admin ,phone, group_id, persona_id FROM card_users';
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
      username: user.username? user.username: "opp",
      password: user.password ? user.password : "opopopoppopopo",
      status: 0 ? user.status:0,
      email: user.email ? user.email : "",
      phone:user.phone ? user.phone : "",
      is_admin: 0 ? user.is_admin : 0,
      group_id: user.group_id ? user.group_id : 999, 
      persona_id: user.persona_id ? user.persona_id : 606
    };

    console.log("password:", user.password)
    const sql = 'INSERT INTO card_users SET ?';
    connection.query(sql, userStructure, callback);
  }

  // 删除用户
  static deleteUser(id, callback) {
    const sql = 'DELETE FROM card_users WHERE id = ?';
    connection.query(sql, [id], callback);
  }

  // 修改用户
  static updateUser(id, user, callback) {
    const userStructure = {
      username: user.username,
      status: user.status,
      email: user.email,
      phone: user.phone,
      is_admin: user.is_admin,
      group_id: user.group_id,
      persona_id: user.persona_id
    };
    const sql = 'UPDATE card_users SET ? WHERE id = ?';
    connection.query(sql, [userStructure, id], callback);
  }
}

module.exports = cardUser;

const db = require('../../config/db');
const bcrypt = require('bcryptjs');

class User {
    static async create(userData) {
        const {username, password} =userData;
        const hashedPassword = await bcrypt.hash(password, 10)

        const [rows] = await   db.execute('SELECT COUNT(*) as count FROM Users');
        const isFirstUser = rows[0].count === 0;

        const role = isFirstUser ? 'admin' : 'user';

        const [result] = await db.execute(
            'INSERT INTO Users (username, password, role) VALUES (?,?,?)',
            [username, hashedPassword, role]
        );
        return result.insertId;
    }
    static  async findByUsername(username) {
        const [rows] = await  db.execute(
            'SELECT * FROM Users WHERE username = ?',
            [username]
        )
        return rows[0];
    }
    static  async validatePassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }
    static  async findAllUsers() {
        const [rows] = await db.execute(
            'SELECT id, username , role FROM Users'
        );
        return rows;
    }
     static async countUsers() {
        const [rows] = await db.execute('SELECT COUNT(*) AS total FROM users');
        return rows[0].total; 
    }

}
module.exports = User;
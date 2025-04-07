import { query } from '../../lib/db';
import bcrypt from 'bcryptjs';

export class User {
  static async create({ username, email, password }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await query(
      'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );
    return result.insertId;
  }

  static async findByEmail(email) {
    const users = await query(
      'SELECT * FROM users WHERE email = ? LIMIT 1',
      [email]
    );
    return users[0];
  }

  static async recordLogin(userId) {
    await query(
      'INSERT INTO logins (user_id) VALUES (?)',
      [userId]
    );
  }

  static async count() {
    const result = await query('SELECT COUNT(*) as count FROM users');
    return result[0].count;
  }
}
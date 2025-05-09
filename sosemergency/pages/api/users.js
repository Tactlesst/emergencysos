import bcrypt from 'bcryptjs';
import pool from '../../lib/db'; // Your MySQL connection

const validRoles = ['station', 'super_admin', 'user'];

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const [users] = await pool.query('SELECT * FROM users');
      return res.status(200).json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      return res.status(500).json({ message: 'Error fetching users' });
    }
  }

  else if (req.method === 'POST') {
    const { firstName, lastName, phone, password, dob, userType } = req.body;

    if (!validRoles.includes(userType)) {
      return res.status(400).json({ message: 'Invalid userType provided' });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const [result] = await pool.query(
        'INSERT INTO users (firstName, lastName, phone, password, dob, userType) VALUES (?, ?, ?, ?, ?, ?)',
        [firstName, lastName, phone, hashedPassword, dob, userType]
      );

      const [newUser] = await pool.query('SELECT * FROM users WHERE id = ?', [result.insertId]);
      return res.status(201).json(newUser[0]);
    } catch (error) {
      console.error('Error adding user:', error);
      return res.status(500).json({ message: 'Error adding user' });
    }
  }

  else if (req.method === 'PUT') {
    const { id, firstName, lastName, phone, dob, userType, password } = req.body;

    if (!validRoles.includes(userType)) {
      return res.status(400).json({ message: 'Invalid userType provided' });
    }

    try {
      let query = 'UPDATE users SET firstName=?, lastName=?, phone=?, dob=?, userType=?';
      const values = [firstName, lastName, phone, dob, userType];

      if (password && password.trim() !== '') {
        const hashedPassword = await bcrypt.hash(password, 10);
        query += ', password=?';
        values.push(hashedPassword);
      }

      query += ' WHERE id=?';
      values.push(id);

      const [result] = await pool.query(query, values);

      if (result.affectedRows === 0) {
        return res.status(400).json({ message: 'No changes made or user not found' });
      }

      const [updatedUser] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
      return res.status(200).json(updatedUser[0]);
    } catch (error) {
      console.error('Error updating user:', error);
      return res.status(500).json({ message: 'Error updating user' });
    }
  }

  else if (req.method === 'DELETE') {
    const { id } = req.query;
    try {
      await pool.query('DELETE FROM users WHERE id = ?', [id]);
      return res.status(200).json({ message: 'User deleted' });
    } catch (error) {
      console.error('Error deleting user:', error);
      return res.status(500).json({ message: 'Error deleting user' });
    }
  }

  else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}

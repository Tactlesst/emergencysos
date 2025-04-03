import bcrypt from 'bcryptjs';
import pool from '../../lib/db'; // Assuming 'pool' is your MySQL connection

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
    
    try {
      // Hash password before inserting into database
      const hashedPassword = await bcrypt.hash(password, 10); // 10 = salt rounds

      await pool.query(
        'INSERT INTO users (firstName, lastName, phone, password, dob, userType) VALUES (?, ?, ?, ?, ?, ?)',
        [firstName, lastName, phone, hashedPassword, dob, userType]
      );

      return res.status(201).json({ message: 'User added' });
    } catch (error) {
      console.error('Error adding user:', error);
      return res.status(500).json({ message: 'Error adding user' });
    }
  } 
  
  else if (req.method === 'PUT') {
    const { id, firstName, lastName, phone, dob, userType, password } = req.body;
    
    try {
      let query = 'UPDATE users SET firstName=?, lastName=?, phone=?, dob=?, userType=?';
      let values = [firstName, lastName, phone, dob, userType];

      // If password is provided, hash it and update it as well
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        query += ', password=?';
        values.push(hashedPassword);
      }

      query += ' WHERE id=?';
      values.push(id);

      await pool.query(query, values);

      return res.status(200).json({ message: 'User updated' });
    } catch (error) {
      console.error('Error updating user:', error);
      return res.status(500).json({ message: 'Error updating user' });
    }
  } 
  
  else if (req.method === 'DELETE') {
    const { id } = req.query;
    try {
      await pool.query('DELETE FROM users WHERE id=?', [id]);
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

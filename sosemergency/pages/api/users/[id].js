import bcrypt from 'bcryptjs';
import pool from '@/lib/db';

export default async function handler(req, res) {
  console.log('Received request:', req.method, req.query);

  const { id } = req.query; // Get user ID from URL params

  if (!id) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    if (req.method === 'GET') {
      console.log('Fetching user with ID:', id);

      const [user] = await pool.query(
        `SELECT id, firstName, lastName, phone, dob, userType, disabled, password
         FROM users 
         WHERE id = ?`,
        [id]
      );

      if (user.length === 0) {
        console.log('User not found:', id);
        return res.status(404).json({ message: 'User not found' });
      }

      console.log('User found:', user[0]);
      return res.status(200).json(user[0]);
    } 
    
    else if (req.method === 'PUT') {
      console.log('Updating user with ID:', id);

      const { firstName, lastName, phone, dob, userType, disabled, password } = req.body;
      console.log('Request body:', req.body);

      // Hash the password if it's provided
      let hashedPassword = null;
      if (password) {
        hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds
      }

      // Check if user exists
      const [existingUser] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
      if (existingUser.length === 0) {
        console.log('User not found:', id);
        return res.status(404).json({ message: 'User not found' });
      }

      // Toggle disabled status if not explicitly provided
      const newDisabledStatus = disabled !== undefined ? disabled : existingUser[0].disabled === 1 ? 0 : 1;

      // Update user, including the hashed password if provided
      const [result] = await pool.query(
        `UPDATE users 
         SET firstName = ?, lastName = ?, phone = ?, dob = ?, userType = ?, disabled = ?, password = ?
         WHERE id = ?`,
        [firstName, lastName, phone, dob, userType, newDisabledStatus, hashedPassword, id]
      );

      if (result.affectedRows === 0) {
        console.log('Failed to update user:', id);
        return res.status(400).json({ message: 'Failed to update user' });
      }

      console.log(`User ${id} updated successfully. New disabled status: ${newDisabledStatus}`);
      return res.status(200).json({ message: 'User updated successfully', disabled: newDisabledStatus });
    } 
    
    else {
      console.log('Method not allowed:', req.method);
      res.setHeader('Allow', ['GET', 'PUT']);
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

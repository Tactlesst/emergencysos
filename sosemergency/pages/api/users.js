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
  } else if (req.method === 'POST') {
    const { firstName, lastName, phone, password, dob, userType } = req.body;
    try {
      await pool.query(
        'INSERT INTO users (firstName, lastName, phone, password, dob, userType) VALUES (?, ?, ?, ?, ?, ?)',
        [firstName, lastName, phone, password, dob, userType]
      );
      return res.status(201).json({ message: 'User added' });
    } catch (error) {
      console.error('Error adding user:', error);
      return res.status(500).json({ message: 'Error adding user' });
    }
  } else if (req.method === 'PUT') {
    const { id, firstName, lastName, phone, dob, userType } = req.body;
    try {
      await pool.query(
        'UPDATE users SET firstName=?, lastName=?, phone=?, dob=?, userType=? WHERE id=?',
        [firstName, lastName, phone, dob, userType, id]
      );
      return res.status(200).json({ message: 'User updated' });
    } catch (error) {
      console.error('Error updating user:', error);
      return res.status(500).json({ message: 'Error updating user' });
    }
  } else if (req.method === 'DELETE') {
    const { id } = req.query;
    try {
      await pool.query('DELETE FROM users WHERE id=?', [id]);
      return res.status(200).json({ message: 'User disabled' });
    } catch (error) {
      console.error('Error disabling user:', error);
      return res.status(500).json({ message: 'Error disabling user' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}

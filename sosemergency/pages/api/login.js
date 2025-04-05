import pool from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { phone, password } = req.body;

  try {
    // 1. Fetch user from database, including `disabled` field
    const [users] = await pool.query(
      `SELECT id, firstName, lastName, phone, password, userType, disabled 
       FROM users WHERE phone = ?`,
      [phone]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = users[0];

    // 2. Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 3. Create token
    const token = jwt.sign(
      {
        userId: user.id,
        userType: user.userType,
        phone: user.phone
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // 4. Return token, userType, and disabled status
    return res.status(200).json({
      token,
      userType: user.userType,
      disabled: user.disabled, // Include disabled status here
      user: {
        id: user.id,
        firstName: user.firstName,
        phone: user.phone
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

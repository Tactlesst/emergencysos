import pool from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { phone, password } = req.body;

  // Validate input
  if (!phone || !password) {
    return res.status(400).json({ message: 'Phone and password are required' });
  }

  try {
    // 1. Fetch user with explicit column selection
    const [users] = await pool.query(
      `SELECT 
        id, 
        firstName, 
        lastName, 
        phone, 
        password, 
        userType 
       FROM users 
       WHERE phone = ?`,
      [phone]
    );

    // 2. Debug: Log the raw query result
    console.log('Query result:', users);

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = users[0];

    // 3. Debug: Verify userType exists
    if (typeof user.userType === 'undefined') {
      console.error('userType missing in user object:', user);
      return res.status(500).json({ message: 'Server configuration error' });
    }

    // 4. Password verification
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 5. Create token payload
    const tokenPayload = {
      userId: user.id,
      userType: user.userType,
      phone: user.phone
    };

    // 6. Generate JWT
    const token = jwt.sign(
      tokenPayload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // 7. Prepare response data (exclude password)
    const responseData = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      userType: user.userType,
      token
    };

    // 8. Set cookie (optional)
    res.setHeader(
      'Set-Cookie',
      `token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=3600`
    );

    return res.status(200).json({
      message: 'Login successful',
      user: responseData
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
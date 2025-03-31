import pool from '../../lib/db';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { firstName, lastName, phone, password, dob } = req.body;
    
    // Validate input (even though client validated)
    if (!firstName || !lastName || !phone || !password || !dob) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if phone exists
    const [existing] = await pool.query(
      'SELECT id FROM users WHERE phone = ?', 
      [phone]
    );
    
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Phone number already registered' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user
    const [result] = await pool.query(
      'INSERT INTO users (firstName, lastName, phone, password, dob) VALUES (?, ?, ?, ?, ?)',
      [firstName, lastName, phone, hashedPassword, dob]
    );

    return res.status(201).json({ 
      message: 'User registered successfully',
      userId: result.insertId 
    });

  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
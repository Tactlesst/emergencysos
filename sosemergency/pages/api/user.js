import { query } from '../../../lib/db';

export default async function handler(req, res) {
  try {
    switch (req.method) {
      case 'GET':
        const users = await query('SELECT id, firstName, lastName, phone, userType FROM users');
        return res.status(200).json(users);

      case 'POST':
        const { firstName, lastName, phone, password, userType = 'user' } = req.body;
        
        if (!firstName || !lastName || !phone || !password) {
          return res.status(400).json({ error: 'Missing required fields' });
        }

        const result = await query(
          'INSERT INTO users (firstName, lastName, phone, password, userType) VALUES (?, ?, ?, ?, ?)',
          [firstName, lastName, phone, password, userType]
        );

        return res.status(201).json({
          id: result.insertId,
          firstName,
          lastName,
          phone,
          userType
        });

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
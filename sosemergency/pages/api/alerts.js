import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { alert_type, location, status, time } = req.body;

    if (!alert_type || !location || !time) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      const [result] = await pool.query(
        `INSERT INTO alerts (alert_type, location, status, time) VALUES (?, ?, ?, ?)`,
        [alert_type, location, status || 'Active', time]
      );
      return res.status(200).json({ message: 'Alert added', id: result.insertId });
    } catch (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
  }

  if (req.method === 'GET') {
    try {
      const [rows] = await pool.query(
        `SELECT alert_type, location, status, time FROM alerts ORDER BY id DESC`
      );
      return res.status(200).json(rows);
    } catch (err) {
      return res.status(500).json({ error: 'Failed to fetch alerts' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

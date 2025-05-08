// pages/api/alerts/notifications.js
import db from '@/lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const [alerts] = await db.query(
        'SELECT id, alert_type, location, status, time, created_at FROM alerts ORDER BY created_at DESC LIMIT 10'
      );
      res.status(200).json(alerts);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch alerts' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

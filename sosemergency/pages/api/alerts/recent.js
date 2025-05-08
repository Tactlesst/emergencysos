// pages/api/alerts/recent.js
import db from '@/lib/db';

export default async function handler(req, res) {
  try {
    const [alerts] = await db.query(`
      SELECT id, alert_type, location, status, time 
      FROM alerts 
      ORDER BY created_at DESC 
      LIMIT 5
    `);

    res.status(200).json(alerts);
  } catch (err) {
    console.error('Error fetching recent alerts:', err);
    res.status(500).json({ error: 'Failed to fetch recent alerts' });
  }
}

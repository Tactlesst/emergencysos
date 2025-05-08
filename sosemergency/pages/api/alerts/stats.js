// pages/api/alerts/stats.js
import db from '@/lib/db';

export default async function handler(req, res) {
  try {
    const [total] = await db.query('SELECT COUNT(*) AS count FROM alerts');
    const [active] = await db.query("SELECT COUNT(*) AS count FROM alerts WHERE status = 'Active'");
    const [resolved] = await db.query("SELECT COUNT(*) AS count FROM alerts WHERE status = 'Resolved'");

    res.status(200).json({
      total: total[0].count,
      active: active[0].count,
      resolved: resolved[0].count,
    });
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ error: 'Failed to fetch alert statistics' });
  }
}

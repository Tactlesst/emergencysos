// pages/api/analytics/registrations.js
import db from '@/lib/db'; // adjust path if needed

export default async function handler(req, res) {
  try {
    const { range = '24h' } = req.query;

    // Determine grouping and interval
    let interval, groupFormat;
    if (range === '24h') {
      interval = 'INTERVAL 24 HOUR';
      groupFormat = '%Y-%m-%d %H:00:00'; // Group by hour for the last 24 hours
    } else if (range === '7d') {
      interval = 'INTERVAL 7 DAY';
      groupFormat = '%Y-%m-%d'; // Group by day for the last 7 days
    } else if (range === '30d') {
      interval = 'INTERVAL 30 DAY';
      groupFormat = '%Y-%m-%d'; // Group by day for the last 30 days
    } else {
      return res.status(400).json({ error: 'Invalid range' });
    }

    const [rows] = await db.execute(
      `
      SELECT 
        DATE_FORMAT(dateCreated, ?) AS time, 
        COUNT(*) AS count 
      FROM users 
      WHERE dateCreated >= NOW() - ${interval} 
      GROUP BY time 
      ORDER BY time ASC
      `,
      [groupFormat]
    );

    return res.status(200).json(rows);
  } catch (error) {
    console.error('Error in /api/analytics/registrations:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

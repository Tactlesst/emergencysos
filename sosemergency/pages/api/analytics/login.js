import db from '@/lib/db'; // Adjust path as needed

export default async function handler(req, res) {
  try {
    const { range = '24h' } = req.query;

    // Determine the interval and grouping format
    let interval, groupFormat;
    if (range === '24h') {
      interval = 'INTERVAL 24 HOUR';
      groupFormat = '%Y-%m-%d %H:00:00'; // Hourly data for the last 24 hours
    } else if (range === '7d') {
      interval = 'INTERVAL 7 DAY';
      groupFormat = '%Y-%m-%d'; // Daily data for the last 7 days
    } else if (range === '30d') {
      interval = 'INTERVAL 30 DAY';
      groupFormat = '%Y-%m-%d'; // Daily data for the last 30 days
    } else {
      return res.status(400).json({ error: 'Invalid range' });
    }

    const [rows] = await db.execute(
      `
      SELECT 
        DATE_FORMAT(login_time, ?) AS time,
        COUNT(*) AS count
      FROM login_logs
      WHERE login_time >= NOW() - ${interval}
      GROUP BY time
      ORDER BY time ASC
      `,
      [groupFormat]
    );

    return res.status(200).json(rows);
  } catch (error) {
    console.error('Error in /api/analytics/login:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

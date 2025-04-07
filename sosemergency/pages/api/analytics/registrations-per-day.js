// pages/api/analytics/registrations-per-day.js
import { query } from '../../../lib/db';

export default async function handler(req, res) {
  try {
    const range = req.query.range || '7d';
    let interval, dateFormat;
    
    switch(range) {
      case '24h':
        interval = '1 HOUR';
        dateFormat = '%Y-%m-%d %H:00:00';
        break;
      case '7d':
        interval = '1 DAY';
        dateFormat = '%Y-%m-%d';
        break;
      case '30d':
        interval = '1 DAY';
        dateFormat = '%Y-%m-%d';
        break;
      default:
        return res.status(400).json({ message: 'Invalid time range' });
    }

    let startDate;
    const now = new Date();
    
    if (range === '24h') {
      startDate = new Date(now.setDate(now.getDate() - 1));
    } else if (range === '7d') {
      startDate = new Date(now.setDate(now.getDate() - 7));
    } else {
      startDate = new Date(now.setDate(now.getDate() - 30));
    }

    const results = await query(`
      SELECT 
        DATE_FORMAT(dateCreated, ?) AS time_period,
        COUNT(*) AS count
      FROM users
      WHERE dateCreated >= ?
      GROUP BY time_period
      ORDER BY time_period ASC
    `, [dateFormat, startDate]);

    const formattedResults = results.map(row => ({
      time: range === '24h' 
        ? new Date(row.time_period.replace(' ', 'T') + ':00Z')
        : new Date(row.time_period + 'T00:00:00Z'),
      count: row.count
    }));

    res.status(200).json(formattedResults);
  } catch (error) {
    console.error('Error fetching registration stats:', error);
    res.status(500).json({ message: 'Error fetching registration data' });
  }
}